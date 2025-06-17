import { useState } from "react";

const Ranking = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-850 text-white relative">

      {/* Nawigacja desktopowa */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-gray-900 shadow-lg p-6 justify-center">
        <ul className="flex space-x-16 text-white text-lg">
          <li><a href="/home" className="hover:text-blue-400">Strona główna</a></li>
          <li><a href="/gallery" className="hover:text-blue-400">Znaleziska</a></li>
          <li><a href="/ranking" className="hover:text-blue-400">Ranking</a></li>
          <li><a href="/achievements" className="hover:text-blue-400">Osiągnięcia</a></li>
        </ul>
      </nav>

      {/* Przycisk menu mobilnego */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute top-4 left-4 p-2 bg-gray-800 rounded text-white md:hidden z-50"
      >
        ☰
      </button>

      {/* Nawigacja mobilna pełnej wysokości */}
      {menuOpen && (
        <div className="fixed top-0 left-0 h-screen w-64 bg-gray-900 shadow-lg rounded-lg transition-transform duration-300 ease-in-out z-40 md:hidden flex flex-col items-center justify-center">
          <ul className="space-y-6 text-white text-lg">
            <li><a href="/home" className="hover:text-blue-400">Strona główna</a></li>
            <li><a href="/gallery" className="hover:text-blue-400">Znaleziska</a></li>
            <li><a href="/ranking" className="hover:text-blue-400">Ranking</a></li>
            <li><a href="/achievements" className="hover:text-blue-400">Osiągnięcia</a></li>
          </ul>
        </div>
      )}

    </div>
  );
};

export default Ranking;
