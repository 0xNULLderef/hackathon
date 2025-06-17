import { useState } from "react";
import CameraComponent from "../components/CameraComponent";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  const imageData = JSON.parse(
    '{"src": "/src/asetts/IMG_20250617_121813889_HDR.jpg", "accuracy": "92%"}'
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-850 text-white relative">

      {}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute top-4 left-4 p-2 bg-gray-800 rounded text-white md:hidden z-50"
      >
        ☰
      </button>

      {}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="p-14 space-y-6 text-white">
          <li><a href="/home" className="">Strona główna</a></li>
          <li><a href="/gallery" className="">Znaleziska</a></li>
          <li><a href="/ranking" className="">Ranking</a></li>
          <li><a href="/achievements" className="">Osiągnięcia</a></li>
        </ul>
      </div>

      {}
      <div className="relative w-full max-w-md mt-4">
        <img
          src={imageData.src}
          alt="Obraz"
          className="w-full rounded-lg shadow-md"
        />
        <span className="absolute top-2 left-2 bg-opacity-60 text-white text-sm px-2 py-1 rounded">
          Dokładność: {imageData.accuracy}
        </span>
      </div>

      {}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="w-full max-w-md py-2 mt-4 bg-gray-800 rounded"
      >
        Podgląd
      </button>

      {}
      {isVisible && (
        <h4 className="mt-4 text-lg text-gray-300">
          Treść podglądu...
        </h4>
      )}
    </div>
  );
};

export default Home;