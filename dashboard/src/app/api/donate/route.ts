import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { streamerUsername, senderName, senderId, amount, message, aiScores } = await req.json();

    const streamer = await prisma.user.findUnique({ where: { username: streamerUsername } });
    if (!streamer) {
      return NextResponse.json({ error: "Streamer tidak ditemukan" }, { status: 404 });
    }

    const donation = await prisma.donation.create({
      data: {
        amount: parseInt(amount),
        senderName: senderName || "Anonim",
        senderId: senderId || null,
        streamerId: streamer.id,
        message: message,
        status: aiScores.status,
        toxicScore: aiScores.toxicScore,
        judiScore: aiScores.judiScore
      }
    });

    return NextResponse.json({ message: "Donasi berhasil masuk!", donation }, { status: 201 });

  } catch (error) {
    console.error("Donate DB Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat mencatat donasi." }, { status: 500 });
  }
}