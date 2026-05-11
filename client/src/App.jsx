import { Navigate, Route, Routes } from "react-router-dom";
import SidebarLayout from "./components/SidebarLayout";
import AddDeploymentPage from "./pages/AddDeploymentPage";
import DashboardPage from "./pages/DashboardPage";
import DeploymentDetailsPage from "./pages/DeploymentDetailsPage";
import DeploymentHistoryPage from "./pages/DeploymentHistoryPage";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <DashboardPage />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <ProjectsPage />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/deployments/new"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <AddDeploymentPage />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/deployments/history"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <DeploymentHistoryPage />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/deployments/:id"
        element={
          <ProtectedRoute>
            <SidebarLayout>
              <DeploymentDetailsPage />
            </SidebarLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
