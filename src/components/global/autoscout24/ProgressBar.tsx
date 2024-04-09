import React from "react";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
      <div
        className="bg-green-500 h-2.5 rounded-full dark:bg-green-500"
        style={{width: `${progress}%`}}
      ></div>
    </div>
  );
};

export default ProgressBar;
