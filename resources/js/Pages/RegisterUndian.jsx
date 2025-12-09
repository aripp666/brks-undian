import React, { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import CardTiketUndian from "../Components/CardTiketUndian";

export default function RegisterUndian() {
  const { flash } = usePage().props;

  const [activeTab, setActiveTab] = useState("register");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const formRegister = useForm({
    nama: "",
    whatsapp: "",
  });

  const formOtp = useForm({
    whatsapp: "",
    otp: "",
  });

  const formCek = useForm({
    whatsapp: "",
  });

  useEffect(() => {
    if (flash.success || flash.error || flash.status) {
      setModalMessage(flash.success || flash.error || flash.status);
      setShowModal(true);
    }
  }, [flash]);

  return (
    <div
      className="
        min-h-screen flex justify-center items-center 
        px-4 py-6 
        relative overflow-hidden 
        bg-cover bg-center
      "
      style={{
        backgroundImage: "url('/background.jpg')",
      }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* ORNAMENTS */}
      <div className="absolute w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-gradient-to-br from-yellow-300/20 to-yellow-600/20 rounded-full blur-3xl opacity-40 top-0 left-0"></div>
      <div className="absolute w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl opacity-30 bottom-0 right-0"></div>

      {/* MAIN CARD */}
      <div
        className="
          w-full 
          max-w-lg sm:max-w-xl lg:max-w-3xl 
          min-h-[520px] sm:min-h-[620px]
          rounded-3xl shadow-[0_30px_120px_rgba(0,0,0,0.40)]
          bg-white/15 border border-white/30 
          backdrop-blur-2xl 
          relative overflow-hidden flex flex-col
        "
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none"></div>

        {/* HEADER */}
        <div className="text-center pt-8 sm:pt-10 pb-4 z-20 px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide text-white drop-shadow-lg">
            Registrasi Doorprize
          </h1>
          <p className="text-white/80 mt-2 text-sm sm:text-base">
            Dapatkan Nomor Doorprize dan Raih Hadiah Menarik
          </p>
        </div>

        {/* TAB BUTTON */}
      <div className="flex justify-center flex-wrap gap-3 sm:gap-4 mt-4 mb-6 z-20 px-4">
            {[
                { id: "register", label: "Registrasi" },
                { id: "otp", label: "Verifikasi OTP" },
                { id: "cek", label: "Nomor Doorprize" },
            ].map((tab) => (
                <button
                key={tab.id}
                className={`min-w-[150px] text-center px-4 py-2 sm:px-5 sm:py-2 rounded-xl font-bold text-sm sm:text-base transition-all duration-300
                    ${
                    activeTab === tab.id
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-300 text-black shadow-xl scale-105"
                        : "bg-white/20 backdrop-blur-lg border border-white/40 text-white hover:bg-white/30"
                    }`}
                onClick={() => setActiveTab(tab.id)}
                >
                {tab.label}
                </button>
            ))}
            </div>


        {/* CONTENT */}
        <div className="flex-1 px-4 sm:px-8 md:px-10 pb-10 overflow-y-auto z-20">

          {/* REGISTER */}
          {activeTab === "register" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formRegister.post("/send-otp", {
                  onSuccess: () => {
                    formOtp.setData("whatsapp", formRegister.data.whatsapp);
                    formRegister.reset();
                    setActiveTab("otp");
                  },
                });
              }}
              className="space-y-5 animate-fadeIn"
            >
              <div className="flex flex-col gap-2">
                <label className="text-white font-semibold text-sm sm:text-base">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="p-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/40 text-sm sm:text-base focus:ring-2 focus:ring-yellow-300"
                  placeholder="Masukkan nama lengkap"
                  value={formRegister.data.nama}
                  onChange={(e) =>
                    formRegister.setData("nama", e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white font-semibold text-sm sm:text-base">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  className="p-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/40 text-sm sm:text-base focus:ring-2 focus:ring-yellow-300"
                  placeholder="628xxxx"
                  value={formRegister.data.whatsapp}
                  onChange={(e) =>
                    formRegister.setData("whatsapp", e.target.value)
                  }
                />
              </div>
              <button className="w-full py-3 rounded-xl text-black font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 text-sm sm:text-base shadow-xl hover:scale-[1.02] transition-all">
                Kirim OTP
              </button>
            </form>
          )}

          {/* OTP */}
          {activeTab === "otp" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formOtp.post("/verify-otp", {
                  onSuccess: () => formOtp.reset("otp"),
                });
              }}
              className="space-y-5 animate-fadeIn"
            >
              <div className="flex flex-col gap-2">
                <label className="text-white font-semibold text-sm sm:text-base">
                  Kode OTP
                </label>
                <input
                  type="text"
                  className="p-3 rounded-xl bg-white/20 text-white border border-white/40 placeholder-white/50 text-sm sm:text-base focus:ring-2 focus:ring-green-300"
                  placeholder="Masukkan kode OTP"
                  value={formOtp.data.otp}
                  onChange={(e) => formOtp.setData("otp", e.target.value)}
                />
              </div>

              <button className="w-full py-3 rounded-xl text-black font-bold text-sm sm:text-base bg-gradient-to-r from-green-300 to-green-200 shadow-xl hover:scale-105 transition-all">
                Verifikasi OTP
              </button>
            </form>
          )}

          {/* CEK */}
          {activeTab === "cek" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formCek.post("/cek-undian", {
                  onSuccess: () => formCek.reset(),
                });
              }}
              className="space-y-5 animate-fadeIn"
            >
              <div className="flex flex-col gap-2">
                <label className="text-white font-semibold text-sm sm:text-base">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  className="p-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/40 text-sm sm:text-base focus:ring-2 focus:ring-blue-300"
                  placeholder="628xxxx"
                  value={formCek.data.whatsapp}
                  onChange={(e) => formCek.setData("whatsapp", e.target.value)}
                />
              </div>

              <button className="w-full py-3 rounded-xl text-white font-bold text-sm sm:text-base bg-gradient-to-r from-blue-500 to-blue-300 shadow-xl hover:scale-105 transition-all">
                Cek Nomor Undian
              </button>
            </form>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[999] animate-fadeIn px-4">
          {modalMessage.includes("Nomor Undian Anda:") ? (
            <CardTiketUndian
              nomor={modalMessage.replace("Nomor Undian Anda: ", "")}
            />
          ) : (
            <div className="bg-white/20 border border-white/40 backdrop-blur-xl p-6 sm:p-8 rounded-3xl max-w-sm sm:max-w-md w-full text-center shadow-[0_0_50px_rgba(255,255,255,0.4)] animate-scaleIn">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Notifikasi
              </h2>

              <p className="text-white/90 text-base sm:text-lg">{modalMessage}</p>

              <button
                onClick={() => setShowModal(false)}
                className="mt-6 w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-200 text-black font-bold text-sm sm:text-base rounded-xl hover:scale-105 transition"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
