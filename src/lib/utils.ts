import { PrismaClient } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import dayjs, { OpUnitType } from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import { twMerge } from "tailwind-merge";
import { DateRange } from "./types";

dayjs.extend(weekOfYear);
dayjs.extend(weekday);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const prisma = new PrismaClient();

export const findUserById = async (
  id: string,
  includeTimeSlots: boolean = false
) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      timeSlots: includeTimeSlots,
    },
  });
};

export const getDateRange = (date: string, unit: OpUnitType): DateRange => {
  const dayJsDate = dayjs(date);
  const startOfDay = dayJsDate.startOf(unit).toDate();
  const endOfDay = dayJsDate.endOf(unit).toDate();

  return {
    start: startOfDay,
    end: endOfDay,
  };
};
