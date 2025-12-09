import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Machine() {
  const [rolling, setRolling] = useState(false);
  const [display, setDisplay] = useState("000");
  const [winner, setWinner] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const intervalRef = useRef(null);

  // === SHIFT + ENTER UNTUK MULAI ===
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Enter" && e.shiftKey && !rolling) {
        startMachine();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [rolling]);

  // FORMAT NOMOR MENJADI 000 (3 DIGIT)
  const formatThree = (num) =>
    String(num).slice(-3).padStart(3, "0");

  // === START MACHINE ===
  const startMachine = async () => {
    setRolling(true);
    setWinner(null);
    setShowModal(false);

    // efek random berjalan
    intervalRef.current = setInterval(() => {
      const random = Math.floor(Math.random() * 1000);
      setDisplay(formatThree(random));
    }, 60);

    try {
      const res = await axios.post("/admin/acak-undian");

      setTimeout(() => {
        clearInterval(intervalRef.current);

        if (res.data.status) {
          const finalNum = formatThree(res.data.pemenang.nomor_undian);

          setDisplay(finalNum);
          setWinner(res.data.pemenang);
          setShowModal(true);
        } else {
          setDisplay("ERR");
        }

        setRolling(false);
      }, 3000);
    } catch (err) {
      clearInterval(intervalRef.current);
      setDisplay("ERR");
      setRolling(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center 
      bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 select-none">

      {/* === SLOT MACHINE === */}
      <div className="
        relative w-[100vw] h-[100vh] flex items-center justify-center
        bg-gradient-to-br from-gray-200 to-gray-100
        rounded-3xl shadow-[0_0_100px_rgba(255,255,255,0.4)]
        border-8 border-gray-300 overflow-hidden
        ring-8 ring-purple-500/40
      ">
        {/* efek lampu atas */}
        <div className="absolute top-0 w-full h-6 bg-gradient-to-r 
          from-pink-500 via-yellow-300 to-blue-500 animate-pulse"/>

        {/* angka */}
        <span
          className={`text-[38vw] font-extrabold text-gray-900 z-10 leading-none
            ${rolling ? "animate-spin-slow" : ""}`}
        >
          {display}
        </span>

        <div className="absolute inset-0 bg-gradient-to-br 
          from-white/40 via-transparent to-white/10" />
      </div>

      {/* === MODAL PEMENANG === */}
      {showModal && winner && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 animate-fadeIn">
          <div className="
            bg-gradient-to-br from-yellow-400 to-yellow-200
            p-10 rounded-3xl shadow-[0_0_60px_rgba(255,215,0,1)]
            text-center border-4 border-yellow-500 animate-scaleIn
          ">
            <h2 className="text-4xl font-extrabold text-yellow-900">
              🏆 PEMENANG!
            </h2>

            <p className="text-2xl mt-4 font-bold text-yellow-900">
              {winner.nama}
            </p>

            <p className="text-4xl mt-3 font-extrabold text-yellow-700">
              Nomor: {formatThree(winner.nomor_undian)}
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="mt-8 px-8 py-3 text-xl rounded-xl font-bold
                bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* === ANIMATIONS CSS === */}
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotateX(0); }
          100% { transform: rotateX(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 0.25s linear infinite;
        }

        @keyframes scaleIn {
          0% { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
