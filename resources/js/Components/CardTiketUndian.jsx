import html2canvas from "html2canvas";
import { useRef } from "react";

export default function CardTiketUndian({ nomor }) {
  const cardRef = useRef(null);

  // Format nomor → ambil 3 digit terakhir
  const nomorFix = String(nomor).slice(-3);

  const downloadImage = async () => {
    const canvas = await html2canvas(cardRef.current, {
      scale: 4,
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
    });

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `Kupon-Doorprize-${nomorFix}.png`; // gunakan nomorFix
    a.click();
  };

  return (
    <div
      className="flex flex-col items-center px-4 py-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* BACK BUTTON */}
      <button
        onClick={() => (window.location.href = "/")}
        className="mb-4 self-start px-4 py-2 rounded-xl bg-white/20 border border-white/40 text-white font-medium shadow-lg hover:bg-white/30 transition"
      >
        ← Kembali
      </button>

      {/* TIKET ROTATE (PORTRAIT) */}
      <div
        ref={cardRef}
        className="relative"
        style={{
          width: "720px",
          height: "720px",
          transform: "rotate(-90deg)",
          transformOrigin: "center",
          backgroundImage: "url('/Kupon.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* NOMOR LANDSCAPE */}
        <div
          style={{
            position: "absolute",
            top: "410px",
            left: "505px",
            transform: "translate(-50%, -50%) rotate(90deg)",
            fontSize: "40px",
            fontWeight: "900",
            color: "#000",
            letterSpacing: "4px",
            whiteSpace: "nowrap",
          }}
        >
          {nomorFix}
        </div>
      </div>

      {/* DOWNLOAD */}
      <button
        onClick={downloadImage}
        className="mt-6 w-full max-w-[400px] py-3 rounded-xl bg-gradient-to-r from-[#7B001C] via-[#FF7A00] to-[#7B001C] text-white font-semibold text-lg shadow-xl hover:scale-105 transition"
      >
        Download Kupon
      </button>
    </div>
  );
}
