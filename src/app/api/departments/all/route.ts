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

    const total = await prisma.department.count();
    const departments = await prisma.department.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        courses: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(
      {
        departments,
        pageCount: Math.ceil(total / pageSize),
        hasMore: total > page * pageSize,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}
