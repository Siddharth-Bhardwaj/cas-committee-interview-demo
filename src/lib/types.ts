import { Prisma } from "@prisma/client";
import { Dayjs } from "dayjs";

export interface LoadingSVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface TimeSlotCalendarEvent {
  id: string;
  courseId: string;
  locationId: string;
  start: Dayjs;
  end: Dayjs;
  title: string;
  location: string;
}

const timeSlotWithCourseAndLocation =
  Prisma.validator<Prisma.TimeSlotFindManyArgs>()({
    include: {
      course: true,
      location: true,
    },
  });
export type TimeSlotWithCourseAndLocation = Prisma.TimeSlotGetPayload<
  typeof timeSlotWithCourseAndLocation
>;
