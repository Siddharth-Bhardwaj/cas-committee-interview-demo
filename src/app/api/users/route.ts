import { findUserById, prisma } from "@/lib/utils";
import { ROLE } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // TODO: admin auth
    const userId = request.nextUrl.searchParams.get("id");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await findUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// can create admins but update only tutors
export async function PUT(request: NextRequest) {
  try {
    // TODO: admin auth
    const { id, netId, nyuEmail, firstName, lastName, preferredName, role } =
      await request.json();

    if (!netId || !nyuEmail || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const userRoleNotTutorUpdateError = NextResponse.json(
      { error: "User to be updated should be a Tutor" },
      { status: 400 }
    );
    if (id) {
      if (role && role != ROLE.TUTOR) {
        return userRoleNotTutorUpdateError;
      }
      const user = await findUserById(id);
      if (user && user.role != ROLE.TUTOR) {
        return userRoleNotTutorUpdateError;
      }
    }

    const user = await prisma.user.upsert({
      where: { id: id || "" },
      update: {
        netId,
        nyuEmail,
        firstName,
        lastName,
        preferredName,
        updatedAt: new Date(),
      },
      create: {
        netId,
        nyuEmail,
        firstName,
        lastName,
        preferredName: preferredName || "",
        role,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to upsert user" },
      { status: 500 }
    );
  }
}
