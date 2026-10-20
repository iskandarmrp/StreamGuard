import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  const { username, password, name } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, name },
    });
    return NextResponse.json({ message: "User created!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Username sudah dipakai" },
      { status: 400 },
    );
  }
}
