import { prisma } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    // TODO: auth
    const { id, address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    const location = await prisma.location.upsert({
      where: { id: id || "" },
      update: {
        address,
        updatedAt: new Date(),
      },
      create: {
        address,
      },
    });

    return NextResponse.json({ location }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to upsert location" },
      { status: 500 }
    );
  }
}
