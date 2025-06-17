import { useState } from "react";

const Upload = () => {
  const [value, setValue] = useState(0);
  const [isSent, setIsSent] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
      <input type="file" className="mt-4 border border-gray-300 rounded-lg shadow-sm px-4 py-2 bg-white dark:bg-gray-900" />

      <p className="mt-2 text-white">Skala dokładności zdjęcia: {value}</p>
      <input type="range" min="0" max="1" step="0.1" value={value} onChange={(e) => setValue(Number(e.target.value))} className="mt-4 w-full max-w-md accent-blue-500 bg-transparent rounded-lg cursor-pointer" />
      

      <button
        onClick={() => setIsSent(!isSent)}
        className="w-full max-w-md py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
      >
        Prześlij
      </button>

      {isSent && <h4 className="mt-4 text-green-500">Plik został przesłany!</h4>}
    </div>
  );
};

export default Upload;
