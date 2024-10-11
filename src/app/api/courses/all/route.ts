import { prisma } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // TODO: auth
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const pageSize = Math.min(
      100,
      parseInt(request.nextUrl.searchParams.get("pageSize") || "10")
    );

    // TODO: test pagination
    const total = await prisma.course.count();
    const courses = await prisma.course.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        department: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(
      {
        courses,
        pageCount: Math.ceil(total / pageSize),
        hasMore: total > page * pageSize,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
