import { getDateRange, prisma } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

// Get Available Time Slots for a Specific Date
export async function GET(request: NextRequest) {
  try {
    // TODO: get based on userId
    const date = request.nextUrl.searchParams.get("date");
    if (!date) {
      return NextResponse.json(
        { error: "Date query parameter is required" },
        { status: 400 }
      );
    }

    const { start, end } = getDateRange(date, "week");
    const availableTimeSlots = await prisma.timeSlot.findMany({
      where: {
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
        // isBooked: false,
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

// TODO: add restriction for tutors creating overlaping timeslots
// TODO: restricton for creating timeslots in the past
// TODO: restrict updating booked timeslots
export async function PUT(request: NextRequest) {
  try {
    const { id, tutorNetId, courseId, locationId, startTime, endTime } =
      await request.json();

    if (!tutorNetId || !courseId || !locationId || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const timeSlot = await prisma.timeSlot.upsert({
      where: { id: id || "" },
      update: {
        tutorNetId,
        courseId,
        locationId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        updatedAt: new Date(),
      },
      create: {
        tutorNetId,
        courseId,
        locationId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        isBooked: false,
      },
    });

    return NextResponse.json({ timeSlot }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to upsert time slot" },
      { status: 500 }
    );
  }
}
