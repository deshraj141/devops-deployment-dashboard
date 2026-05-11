pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = 'dockerhub-creds'
    DOCKERHUB_USER = 'your-dockerhub-username'
    BACKEND_IMAGE = "${DOCKERHUB_USER}/devops-dashboard-backend:${BUILD_NUMBER}"
    FRONTEND_IMAGE = "${DOCKERHUB_USER}/devops-dashboard-frontend:${BUILD_NUMBER}"
  }

  stages {
    stage('Clone Repository') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        dir('server') {
          sh 'npm ci'
        }
        dir('client') {
          sh 'npm ci'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('client') {
          sh 'npm run build'
        }
      }
    }

    stage('Test Backend') {
      steps {
        dir('server') {
          sh 'npm test'
        }
      }
    }

    stage('Build Backend Docker Image') {
      steps {
        sh "docker build -t ${BACKEND_IMAGE} ./server"
      }
    }

    stage('Build Frontend Docker Image') {
      steps {
        sh "docker build -t ${FRONTEND_IMAGE} ./client"
      }
    }

    stage('Push Images to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh "docker push ${BACKEND_IMAGE}"
          sh "docker push ${FRONTEND_IMAGE}"
        }
      }
    }

    stage('Deploy with Docker Compose') {
      steps {
        sh 'docker compose down || true'
        sh 'docker compose up -d --build'
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
    }
    success {
      echo 'Pipeline completed successfully.'
    }
    failure {
      echo 'Pipeline failed. Check stage logs for details.'
    }
  }
}
