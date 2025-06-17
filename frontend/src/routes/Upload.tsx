import { useState } from "react";

const Upload = () => {
  const [value, setValue] = useState(0);
  const [isSent, setIsSent] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-850 text-black dark:text-white">

      <div className="flex flex-col items-center space-y-6">
        <input
          type="file"
          className="border border-gray-300 rounded-lg shadow-sm px-4 py-2 bg-white dark:bg-gray-800"
        />

        <p className="text-white text-center">Skala dokładności zdjęcia: {value}</p>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full max-w-md accent-blue-500 bg-transparent rounded-lg cursor-pointer"
        />

        <button
          onClick={() => setIsSent(!isSent)}
          className="w-full max-w-md py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-gray-800 dark:hover:bg-blue-800"
        >
          Prześlij
        </button>

        {isSent && <h4 className="text-green-500 text-center">Plik został przesłany!</h4>}
      </div>
    </div>
  );
};

export default Upload;