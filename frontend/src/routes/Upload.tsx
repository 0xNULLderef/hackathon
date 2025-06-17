import { useState } from "react";

const Upload = () => {
  const [value, setValue] = useState(0);

  const [isSent, setIsSent] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
    
    <input type="file" className=""></input>

    <input type="range" min="0" max="1" step="0.1" value={value} onChange={(e) => setValue(Number(e.target.value))}></input>
    <p className="mt-2 text-gray-700">Wartość: {value}</p>
    

  <button
    onClick={() => setIsSent(!isSent)}
    className="w-full max-w-md py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
    Prześlij
  </button>

  {isSent && <h4></h4>}
</div>

  );
};

export default Upload;
