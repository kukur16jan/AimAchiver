import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex items-center p-4  justify-center">
      <div
        className="w-10 h-10 border-4 border-solid rounded-full animate-spin"
        style={{
          borderTopColor: "#4f39f6",
          borderRightColor: "transparent",
          borderBottomColor: "#4f39f6",
          borderLeftColor: "transparent",
        }}
      ></div>
        <span className="ml-2 text-gray-700">It may take a while...</span>
    </div>
  );
};

export default Spinner;
