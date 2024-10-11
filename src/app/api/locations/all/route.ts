import { prisma } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // TODO: admin auth
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const pageSize = Math.min(
      100,
      parseInt(request.nextUrl.searchParams.get("pageSize") || "10")
    );

    // TODO: test pagination
    const total = await prisma.location.count();
    const locations = await prisma.location.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        address: "asc",
      },
    });

    return NextResponse.json(
      {
        locations,
        pageCount: Math.ceil(total / pageSize),
        hasMore: total > page * pageSize,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
