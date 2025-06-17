import { useState } from "react";

const Upload = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
    <img
        src="/src/asetts/IMG_20250617_121752980_HDR.jpg"
        alt="Obraz"
        className="w-full max-w-md rounded-lg shadow-md mt-4"
      />

  <button
    onClick={() => setIsVisible(!isVisible)}
    className="w-full max-w-md py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
  >
    Podgląd
  </button>

  {isVisible && <h4></h4>}
</div>

  );
};

export default Upload;