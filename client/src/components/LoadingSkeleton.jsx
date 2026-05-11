const LoadingSkeleton = ({ className = "", rounded = "rounded-xl" }) => {
  return <div className={`skeleton ${rounded} ${className}`} />;
};

export default LoadingSkeleton;
