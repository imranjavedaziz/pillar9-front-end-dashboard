const LoadingSpinner = ({ w = "18px", h = "18px" }) => {
  const spinnerStyle = {
    display: "inline-block",
    width: w,
    height: h,
    border: "3px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "100%",
    borderTopColor: "#000",
    animation: "spin 1s ease-in-out infinite",
    WebkitAnimation: "spin 1s ease-in-out infinite",
    marginBlock: "auto",
  };
  return <div id="loading" style={spinnerStyle}></div>;
};

export default LoadingSpinner;
