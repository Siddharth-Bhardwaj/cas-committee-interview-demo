import * as z from "zod";

export const createTimeSlotFormSchema = z.object({
  course: z.string(),
  location: z.string(),
  startTime: z.date(),
  endTime: z.date(),
});

export const timeSlotSearchFormSchema = z.object({
  department: z.string().optional(),
  course: z.string(),
});
