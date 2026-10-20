import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";
import DonationForm from "./DonationForm";

export default async function DonationPageWrapper({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  const streamer = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!streamer) {
    notFound();
  }

  return <DonationForm username={streamer.username} />;
}
