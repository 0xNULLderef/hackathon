import { useState } from "react";

const Ranking = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-850 text-white">

      <div className="hidden md:block w-64 bg-gray-900 p-6">
        <ul className="space-y-6 text-white pt-20">
          <li><a href="/home">Strona główna</a></li>
          <li><a href="/play">Obiektyw</a></li>
          <li><a href="/gallery">Znaleziska</a></li>
          <li><a href="/achievments">Osiągnięcia</a></li>
          
        </ul>
      </div>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute top-4 left-4 p-2 bg-gray-800 rounded text-white md:hidden z-50"
      >
        ☰
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <ul className="pt-20 ps-5 space-y-6 text-white">
          <li><a href="/home">Strona główna</a></li>
          <li><a href="/play">Obiektyw</a></li>
          <li><a href="/gallery">Znaleziska</a></li>
          <li><a href="/achievments">Osiągnięcia</a></li>
        </ul>
      </div>
  </div>
  );
};

export default Ranking;