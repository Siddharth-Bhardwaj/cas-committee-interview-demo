import { prisma } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // TODO: admin auth
    const courseId = request.nextUrl.searchParams.get("id");
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        department: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ course }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // TODO: admin auth
    const { id, departmentId, code, name, isActive } = await request.json();

    if (!departmentId || !code || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newOrUpdatedCourse = await prisma.course.upsert({
      where: { id: id || "" },
      update: {
        departmentId,
        code,
        name,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      },
      create: {
        departmentId,
        code,
        name,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(newOrUpdatedCourse, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create or update course" },
      { status: 500 }
    );
  }
}
