"use client";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DonationTabs({ donations }: { donations: any[] }) {
  const [activeTab, setActiveTab] = useState<"accepted" | "blocked">(
    "accepted",
  );

  const acceptedDonations = donations.filter((d) => d.status === "ACCEPTED");
  const blockedDonations = donations.filter((d) => d.status !== "ACCEPTED");

  return (
    <div className="rounded-3xl bg-white/5 p-8 shadow-2xl backdrop-blur-sm border border-white/10 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-200">Riwayat Pesan</h2>
          <p className="text-sm text-gray-400 mt-1 mb-2">
            Pantau donasi masuk dan log pesan yang diblokir.
          </p>
        </div>

        <div className="flex w-fit bg-gray-900/80 p-1.5 rounded-2xl shadow-inner">
          <button
            onClick={() => setActiveTab("accepted")}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 mr-4 ${
              activeTab === "accepted"
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 scale-[1.02] border border-gray-700/50"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              className="shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Donasi Diterima
          </button>

          <button
            onClick={() => setActiveTab("blocked")}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ml-4 ${
              activeTab === "blocked"
                ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25 scale-[1.02] border border-gray-700/50"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              className="shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-1.998A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
                clipRule="evenodd"
              />
            </svg>
            Pesan Diblokir
          </button>
        </div>
      </div>

      {activeTab === "accepted" &&
        (acceptedDonations.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/30 rounded-2xl border border-dashed border-gray-700 animate-in fade-in zoom-in-95 duration-300">
            <p className="text-gray-400">Belum ada donasi bersih yang masuk.</p>
          </div>
        ) : (
          <div className="overflow-x-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/80">
                  <th className="p-4 rounded-tl-xl border-b border-gray-700 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="p-4 border-b border-gray-700 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Pengirim
                  </th>
                  <th className="p-4 border-b border-gray-700 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Nominal
                  </th>
                  <th className="p-4 rounded-tr-xl border-b border-gray-700 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Pesan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {acceptedDonations.map((d) => (
                  <tr
                    key={d.id}
                    className="hover:bg-gray-800/40 transition-colors group"
                  >
                    <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                      {new Date(d.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 font-bold text-gray-200 whitespace-nowrap">
                      {d.senderName}
                    </td>
                    <td className="p-4 font-bold text-green-400 whitespace-nowrap">
                      Rp {d.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="p-4 text-gray-300 text-sm italic">
                      {d.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {activeTab === "blocked" &&
        (blockedDonations.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/30 rounded-2xl border border-dashed border-gray-700 animate-in fade-in zoom-in-95 duration-300">
            <p className="text-gray-400">
              Belum ada pesan spam atau toxic yang terdeteksi.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/80">
                  <th className="p-4 rounded-tl-xl border-b border-gray-700 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="p-4 border-b border-gray-700 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Pengirim
                  </th>
                  <th className="p-4 border-b border-gray-700 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Alasan Blokir
                  </th>
                  <th className="p-4 rounded-tr-xl border-b border-gray-700 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Pesan Asli
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {blockedDonations.map((d) => (
                  <tr
                    key={d.id}
                    className="hover:bg-gray-800/40 transition-colors group"
                  >
                    <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                      {new Date(d.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 font-bold text-gray-200 whitespace-nowrap">
                      {d.senderName}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-bold rounded-full flex items-center w-fit gap-1">
                        <span className="w-1.5 h-1.5"></span>
                        {d.status === "JUDI_ONLINE" ? "Judi Online" : "Toxic"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300 text-sm italic">
                      {d.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}
