import { useState } from "react";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-white relative">
      
      {}
      <button onClick={() => setMenuOpen(!menuOpen)} className="absolute top-4 left-4 p-2 bg-blue-500 rounded text-white md:hidden">
        ☰
      </button>

      {}
      {menuOpen && (
        <div className="absolute top-12 left-4 bg-white dark:bg-gray-700 shadow-md rounded-lg p-4 text-black dark:text-white">
          <ul className="flex flex-col space-y-2">
            <li><a href="/home" className="hover:text-blue-500">Strona główna</a></li>
            <li><a href="/upload" className="hover:text-blue-500">Upload Page</a></li>
            <li><a href="/gallery" className="hover:text-blue-500">Znaleziska</a></li>
            <li><a href="/ranking" className="hover:text-blue-500">Ranking</a></li>
            <li><a href="/achievements" className="hover:text-blue-500">Osiągnięcia</a></li>
          </ul>
        </div>
      )}

      {}
      <img
        src="/src/assets/IMG_20250617_121752980_HDR.jpg"
        alt="Obraz"
        className="w-full max-w-md rounded-lg shadow-md mt-4"
      />

      {}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="w-full max-w-md py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
        Podgląd
      </button>

      {isVisible && <h4 className="mt-4 text-lg text-gray-700">Treść podglądu...</h4>}
    </div>
  );
};

export default Home;
