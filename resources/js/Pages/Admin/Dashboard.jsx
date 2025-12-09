import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [peserta, setPeserta] = useState([]);
  const [pemenang, setPemenang] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [spin, setSpin] = useState(false);

  const fetchPeserta = async () => {
    try {
      const res = await axios.get("/admin/peserta");
      setPeserta(res.data);
    } catch (err) {
      console.error("Gagal mengambil data peserta:", err);
    }
  };

  const handleAcak = async () => {
    if (!confirm("Yakin ingin mengacak undian?")) return;

    setLoading(true);
    setSpin(true);

    try {
      const res = await axios.post("/admin/acak-undian");
      if (res.data.status) {
        setTimeout(() => {
          setPemenang(res.data.pemenang);
          fetchPeserta();
          setSpin(false);
        }, 1800);
      } else {
        alert(res.data.message);
      }
    } catch {
      alert("Terjadi error saat mengacak undian.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset semua pemenang?")) return;
    setResetLoading(true);

    try {
      const res = await axios.post("/admin/reset-undian");
      if (res.data.status) {
        setPemenang(null);
        fetchPeserta();
      }
    } catch {
      alert("Terjadi error saat reset.");
    } finally {
      setResetLoading(false);
    }
  };

  useEffect(() => {
    fetchPeserta();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden">

      {/* LIGHT ORB EFFECT */}
      <div className="absolute top-20 -left-20 w-60 h-60 bg-purple-300 blur-[90px] opacity-40 rounded-full"></div>
      <div className="absolute bottom-20 -right-20 w-60 h-60 bg-pink-300 blur-[90px] opacity-40 rounded-full"></div>

      {/* HEADER */}
      <div className="text-center mb-10 relative z-10">
        <h1 className="text-5xl font-extrabold text-gray-800 drop-shadow">
          Dashboard Admin 🎛️
        </h1>
        <p className="text-lg text-gray-600 mt-1">
          Undian • Monitoring Peserta • Real-Time
        </p>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={handleAcak}
          disabled={loading}
          className={`px-8 py-3 rounded-xl font-bold text-white shadow-xl transition-all duration-300 
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
          hover:scale-105 active:scale-95
          flex items-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {spin ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            "🎲"
          )}
          {loading ? "Mengacak..." : "Acak Undian"}
        </button>

        <button
          onClick={handleReset}
          disabled={resetLoading}
          className="px-8 py-3 rounded-xl font-bold text-gray-700 bg-white shadow-lg border border-gray-300 hover:bg-gray-100 transition-all"
        >
          {resetLoading ? "Mereset..." : "🔄 Reset Pemenang"}
        </button>
      </div>

      {/* FLASH PEMENANG */}
      {pemenang && (
        <div className="mb-6 p-4 bg-yellow-200 text-yellow-900 font-bold rounded-2xl text-center shadow-xl animate-bounce">
          🏆 Pemenang: {pemenang.nama} • Nomor: {pemenang.nomor_undian} 🏆
        </div>
      )}

      {/* TABLE BOX */}
      <div className="overflow-x-auto rounded-3xl shadow-2xl bg-white p-4 border border-gray-100 backdrop-blur-md z-10 relative">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white shadow-md">
            <tr>
              {["Nama", "WhatsApp", "Nomor Undian", "Status Verifikasi", "Pemenang"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {peserta.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                  Belum ada data peserta
                </td>
              </tr>
            ) : (
              peserta.map((p, index) => (
                <tr
                  key={p.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                  } hover:bg-indigo-50 transition-all duration-300 ${
                    p.is_winner
                      ? "bg-yellow-100 animate-pulse font-bold text-yellow-900"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 text-gray-800">{p.nama}</td>
                  <td className="px-6 py-4 text-gray-700">{p.whatsapp}</td>
                  <td className="px-6 py-4">{p.nomor_undian || "-"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold shadow ${
                        p.is_verified
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {p.is_verified ? "Terverifikasi" : "Belum"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">{p.is_winner ? "🏆" : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
