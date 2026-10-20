import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { message, streamerUsername, senderName, amount } = await req.json();

    const streamer = await prisma.user.findUnique({
      where: { username: streamerUsername },
    });

    if (!streamer) {
      return NextResponse.json({ error: "Streamer tidak ditemukan" }, { status: 404 });
    }

    const aiResponse = await fetch("http://localhost:8000/check-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });

    const aiData = await aiResponse.json();

    if (aiData.status !== "ACCEPTED") {
      await prisma.donation.create({
        data: {
          amount: parseInt(amount) || 0,
          senderName: senderName || "Anonim",
          streamerId: streamer.id,
          message: message,
          status: aiData.status,
          toxicScore: aiData.toxic_score,
          judiScore: aiData.judi_score,
        },
      });

      const alasan = aiData.status === "JUDI_ONLINE" ? "Promosi Judi Online" : "Kata-kata Toxic/Kasar";
      return NextResponse.json(
        { error: `Pesanmu diblokir karena terindikasi ${alasan}. (Telah dicatat oleh sistem keamanan)` },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      message: "Pesan bersih, silakan lanjut pembayaran",
      aiScores: {
        status: aiData.status,
        toxicScore: aiData.toxic_score,
        judiScore: aiData.judi_score
      }
    }, { status: 200 });

  } catch (error) {
    console.error("AI Check Error:", error);
    return NextResponse.json({ error: "Sistem verifikasi sedang sibuk." }, { status: 500 });
  }
}