const Gallery = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-850 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Twoje znaleziska</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            src: '/src/asetts/IMG_20250617_121752980_HDR.jpg',
            miejsce: 'Jaworzno, Elektrownia',
            czas: '17.06.2025, 12:17',
          },
          {
            src: '/src/asetts/IMG_20250617_121813889_HDR.jpg',
            miejsce: 'Jaworzno',
            czas: '17.06.2025, 12:18',
          },
          {
            src: '/src/asetts/IMG_20250617_121654925_HDR.jpg',
            miejsce: 'Jaworzno',
            czas: '17.06.2025, 12:20',
          },
          {
            src: '/src/asetts/IMG_20250617_121625927_HDR.jpg',
            miejsce: 'Jaworzno',
            czas: '17.06.2025, 12:22',
          },
          {
            src: '/src/asetts/IMG_20250617_121752980_HDR.jpg',
            miejsce: 'Jaworzno',
            czas: '17.06.2025, 12:25',
          },
          {
            src: '/src/asetts/IMG_20250617_121813889_HDR.jpg',
            miejsce: 'Jaworzno',
            czas: '17.06.2025, 12:30',
          },
        ].map((item, index) => (
          <div key={index} className="relative">
            <img
              src={item.src}
              alt="Obraz"
              className="w-full max-w-md rounded-lg shadow-md"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-opacity-10 text-white text-sm p-2 rounded-b-lg">
              <p>
                <strong>Miejsce:</strong> {item.miejsce}
              </p>
              <p>
                <strong>Czas:</strong> {item.czas}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Gallery
