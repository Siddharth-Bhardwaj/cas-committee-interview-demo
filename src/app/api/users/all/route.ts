import { prisma } from "@/lib/utils";
import { ROLE } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// will only return tutors
export async function GET(request: NextRequest) {
  try {
    // TODO: admin auth
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const pageSize = Math.min(
      100,
      parseInt(request.nextUrl.searchParams.get("pageSize") || "10")
    );

    const total = await prisma.user.count({
      where: { role: ROLE.TUTOR },
    });
    const tutors = await prisma.user.findMany({
      where: { role: ROLE.TUTOR },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        firstName: "asc",
      },
    });

    return NextResponse.json(
      {
        tutors,
        pageCount: Math.ceil(total / pageSize),
        hasMore: total > page * pageSize,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tutors" },
      { status: 500 }
    );
  }
}
