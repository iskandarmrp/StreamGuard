import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import LogoutButton from "./LogoutButton";
import DonationTabs from "./DonationTabs";

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findFirst({
    where: { name: session.user?.name || "" },
  });

  const allDonations = user
    ? await prisma.donation.findMany({
        where: { streamerId: user.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const acceptedDonations = allDonations.filter((d) => d.status === "ACCEPTED");
  const totalDiterima = acceptedDonations.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-lg border border-white/10 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 w-full">
            <div className="flex flex-row items-center justify-between md:justify-start gap-4">
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-tight">
                Welcome, {user?.name}
              </h1>
            </div>

            <p className="mt-2 text-gray-400">
              Link donasi kamu:{" "}
              <a
                href={`/${user?.username}`}
                className="text-green-400 hover:underline transition-colors hover:text-green-300 break-all"
              >
                localhost:3000/{user?.username}
              </a>
            </p>
          </div>

          <div className="px-6 py-4 bg-gray-900/60 rounded-2xl border border-gray-700 shadow-inner w-full md:w-auto md:min-w-[220px]">
            <span className="text-sm text-gray-400 block mb-1">
              Total Saldo Diterima
            </span>
            <span className="text-3xl font-black text-green-400 tracking-tight">
              Rp {totalDiterima.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="px-6 py-6">
            <LogoutButton />
          </div>
        </div>

        <DonationTabs donations={allDonations} />
      </div>
    </div>
  );
}
