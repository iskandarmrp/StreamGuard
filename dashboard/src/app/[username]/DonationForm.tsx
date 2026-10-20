"use client";
import { useState } from "react";

export default function DonationForm({ username }: { username: string }) {
  const [form, setForm] = useState({
    senderName: "",
    amount: 10000 as number | string,
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // State untuk menyimpan skor AI
  const [passedAiScores, setPassedAiScores] = useState<any>(null);

  const [qrModal, setQrModal] = useState<{
    show: boolean;
    status: "waiting" | "processing";
  }>({
    show: false,
    status: "waiting",
  });

  const [notif, setNotif] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleDonateClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(form.amount) < 5000) {
      setNotif({
        show: true,
        type: "error",
        title: "Nominal Kurang",
        message: "Minimal donasi adalah Rp 5.000",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/check-ai", {
        method: "POST",
        body: JSON.stringify({
          message: form.message,
          streamerUsername: username,
          senderName: form.senderName,
          amount: form.amount,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setPassedAiScores(data.aiScores);
        setQrModal({ show: true, status: "waiting" });
      } else {
        setNotif({
          show: true,
          type: "error",
          title: "🚨 Diblokir Stream Guard",
          message: data.error,
        });
      }
    } catch (error) {
      setNotif({
        show: true,
        type: "error",
        title: "Koneksi Gagal",
        message: "Gagal menyambung ke server Stream Guard.",
      });
    } finally {
      setLoading(false);
    }
  };

  const processPaymentAndDonate = async () => {
    setQrModal({ show: true, status: "processing" });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setQrModal({ show: false, status: "waiting" });

    setLoading(true);

    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          streamerUsername: username,
          aiScores: passedAiScores,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setNotif({
          show: true,
          type: "success",
          title: "Pembayaran Diterima!",
          message: "🎉 Dana masuk. Pesanmu sudah dikirim ke layar streamer.",
        });
        setForm({ senderName: "", amount: 10000, message: "" });
        setPassedAiScores(null);
      } else {
        setNotif({
          show: true,
          type: "error",
          title: "Gagal",
          message: "Gagal mencatat donasi ke sistem.",
        });
      }
    } catch (error) {
      setNotif({
        show: true,
        type: "error",
        title: "Gagal",
        message: "Terjadi kesalahan jaringan.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      {notif.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-gray-900 border border-gray-700 shadow-2xl p-8 flex flex-col items-center text-center transform transition-all zoom-in-95">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 ${notif.type === "success" ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}
            >
              <span className="text-4xl">
                {notif.type === "success" ? "🎉" : "🚨"}
              </span>
            </div>
            <h2
              className={`text-2xl font-bold mb-3 ${notif.type === "success" ? "text-green-400" : "text-red-400"}`}
            >
              {notif.title}
            </h2>
            <p className="text-gray-300 text-sm mb-8">{notif.message}</p>
            <button
              onClick={() => setNotif({ ...notif, show: false })}
              className={`w-full p-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] ${notif.type === "success" ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-red-500 to-rose-600"}`}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {qrModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 flex flex-col items-center text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan QRIS</h2>
            <p className="text-gray-500 text-sm mb-6">
              Total Tagihan:{" "}
              <span className="font-bold text-gray-900">
                Rp {Number(form.amount).toLocaleString("id-ID")}
              </span>
            </p>

            <div className="bg-gray-100 p-4 rounded-2xl mb-6 shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=Donasi_StreamGuard_${form.amount}`}
                alt="QR Code"
                className="w-48 h-48 rounded-lg mix-blend-multiply"
              />
            </div>

            {qrModal.status === "waiting" ? (
              <div className="flex w-full gap-3">
                <button
                  onClick={() => {
                    setQrModal({ show: false, status: "waiting" });
                    setPassedAiScores(null);
                  }}
                  className="flex-1 p-3 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={processPaymentAndDonate}
                  className="flex-1 p-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                >
                  Sudah Bayar
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full py-4">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-blue-600 font-bold">Memverifikasi...</p>
                <p className="text-gray-400 text-xs mt-1">
                  Jangan tutup halaman ini
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-full max-w-lg rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-lg border border-white/10 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-tight mb-2">
          Dukung {username}
        </h1>
        <p className="text-gray-400 mb-8 text-sm text-center">
          Pesanmu akan diverifikasi secara real-time oleh model Stream Guard
          kami.
        </p>

        <form
          onSubmit={handleDonateClick}
          className="w-full flex flex-col gap-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nama Pengirim
            </label>
            <input
              className="w-full rounded-xl border border-gray-600 bg-gray-900/50 p-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors"
              type="text"
              placeholder="Nama kamu"
              value={form.senderName}
              onChange={(e) => setForm({ ...form, senderName: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nominal (Rp)
            </label>
            <input
              className="w-full rounded-xl border border-gray-600 bg-gray-900/50 p-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors"
              type="number"
              min="1000"
              value={form.amount}
              onChange={(e) =>
                setForm({
                  ...form,
                  amount: e.target.value === "" ? "" : parseInt(e.target.value),
                })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Pesan
            </label>
            <textarea
              className="w-full rounded-xl border border-gray-600 bg-gray-900/50 p-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors resize-none h-28"
              placeholder="Pesan dukungan untuk streamer..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>

          <button
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 p-3 font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
          >
            {loading ? "Menganalisa..." : "Lanjutkan Pembayaran"}
          </button>
        </form>
      </div>
    </div>
  );
}
