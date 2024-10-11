import { prisma } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // TODO: auth
    const { studentNetId, timeSlotId } = await request.json();

    if (!studentNetId || !timeSlotId) {
      return NextResponse.json(
        { error: "StudentNetId and TimeSlotId are required" },
        { status: 400 }
      );
    }

    // Check if the time slot is already booked
    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: timeSlotId },
    });

    if (!timeSlot) {
      return NextResponse.json(
        { error: "TimeSlot not found" },
        { status: 404 }
      );
    }

    if (timeSlot.isBooked) {
      return NextResponse.json(
        { error: "TimeSlot is already booked" },
        { status: 400 }
      );
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        studentNetId,
        timeSlotId: timeSlotId,
      },
    });

    // Mark the time slot as booked
    await prisma.timeSlot.update({
      where: { id: timeSlotId },
      data: { isBooked: true },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
