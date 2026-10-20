"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [notif, setNotif] = useState({
    show: false,
    type: "error",
    title: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setNotif({
        show: true,
        type: "error",
        title: "Login Gagal",
        message: "Periksa kembali username dan password kamu.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      {notif.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-gray-900 border border-gray-700 shadow-2xl p-8 flex flex-col items-center text-center transform transition-all zoom-in-95">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 bg-red-500/10 border-red-500/30">
              <span className="text-4xl">🚨</span>
            </div>

            <h2 className="text-2xl font-bold mb-3 text-red-400">
              {notif.title}
            </h2>
            <p className="text-gray-300 text-sm mb-8">{notif.message}</p>

            <button
              onClick={() => setNotif({ ...notif, show: false })}
              className="w-full p-3 rounded-xl font-bold text-white transition-all hover:scale-[1.02] bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-500/20"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-lg border border-white/10 flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-tight">
            Stream Guard
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Masuk untuk mengelola donasi kamu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              className="w-full rounded-xl border border-gray-600 bg-gray-900/50 p-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors"
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              className="w-full rounded-xl border border-gray-600 bg-gray-900/50 p-3 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={isLoading}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 p-3 font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            type="submit"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-400">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-green-400 hover:text-green-300 hover:underline transition-colors"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
