import { getDateRange, prisma } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // TODO: auth
    const date = request.nextUrl.searchParams.get("date");
    const departmentId = request.nextUrl.searchParams.get("departmentId");
    const courseId = request.nextUrl.searchParams.get("courseId");

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const { start, end } = getDateRange(date, "day");
    // TODO: select only required columns in all APIs and create their types
    const availableTimeSlots = await prisma.timeSlot.findMany({
      where: {
        ...(courseId && courseId != "all" ? { courseId: courseId } : {}),
        ...(departmentId && departmentId != "all"
          ? { course: { departmentId: departmentId } }
          : {}),
        OR: [
          {
            startTime: {
              gte: start,
              lt: end,
            },
          },
          {
            endTime: {
              gte: start,
              lt: end,
            },
          },
        ],
        isBooked: false,
      },
      include: {
        course: true,
        location: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(availableTimeSlots, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch available time slots" },
      { status: 500 }
    );
  }
}
