import { createTimeSlotFormSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import {
  TimePicker,
  TimePickerSegment,
  TimePickerSeparator,
} from "./TimePicker";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Course, Location } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { LoadingSpinner } from "./LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TimeSlotFormType } from "@/lib/enums";
import { TimeSlotCalendarEvent } from "@/lib/types";

function TimeSlotForm({
  type,
  slotStart,
  slotEnd,
  closeDialog,
  selectedEvent,
}: {
  type: TimeSlotFormType;
  slotStart: Date | undefined;
  slotEnd: Date | undefined;
  closeDialog: () => void;
  selectedEvent?: TimeSlotCalendarEvent;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [courses, setCourses] = useState<Array<Course>>([]);
  const [locations, setLocations] = useState<Array<Location>>([]);

  useEffect(() => {
    setLoading(true);

    const fetchCourses = axiosInstance.get("/courses/all");
    const fetchLocations = axiosInstance.get("/locations/all");

    Promise.all([fetchCourses, fetchLocations])
      .then(([coursesResponse, locationsResponse]) => {
        if (coursesResponse.data && coursesResponse.data.courses) {
          setCourses(coursesResponse.data.courses);
        }
        if (locationsResponse.data && locationsResponse.data.locations) {
          setLocations(locationsResponse.data.locations);
        }
      })
      .catch((error) => {
        // TODO: Error handling
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const form = useForm<z.infer<typeof createTimeSlotFormSchema>>({
    resolver: zodResolver(createTimeSlotFormSchema),
    defaultValues: {
      course:
        type === TimeSlotFormType.EDIT && selectedEvent
          ? selectedEvent?.courseId
          : "",
      location:
        type === TimeSlotFormType.EDIT && selectedEvent
          ? selectedEvent?.locationId
          : "",
      startTime: slotStart,
      endTime: slotEnd,
    },
  });

  // TODO: Handle update slot
  const handleSubmit = (formData: z.infer<typeof createTimeSlotFormSchema>) => {
    axiosInstance
      .put("/timeslots", {
        ...(type === TimeSlotFormType.EDIT && selectedEvent && selectedEvent.id
          ? { id: selectedEvent.id }
          : {}),
        tutorNetId: "snb8849", // TODO: use from auth
        courseId: formData.course,
        locationId: formData.location,
        startTime: formData.startTime,
        endTime: formData.endTime,
      })
      .then(({ data, status }) => {
        if (status === 201) {
          closeDialog();
        }
      });
  };

  if (loading) {
    return <LoadingSpinner className="w-full" />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select
                defaultValue={
                  type === TimeSlotFormType.EDIT && selectedEvent
                    ? selectedEvent?.courseId
                    : ""
                }
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courses &&
                    courses.map((course) => {
                      return (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select
                defaultValue={
                  type === TimeSlotFormType.EDIT && selectedEvent
                    ? selectedEvent?.locationId
                    : ""
                }
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations &&
                    locations.map((location) => {
                      return (
                        <SelectItem key={location.id} value={location.id}>
                          {location.address}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="w-1/3">
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <TimePicker onChange={field.onChange} value={field.value}>
                  <TimePickerSegment segment={"hours"} />
                  <TimePickerSeparator>:</TimePickerSeparator>
                  <TimePickerSegment segment={"minutes"} />
                </TimePicker>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem className="w-1/3">
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <TimePicker onChange={field.onChange} value={field.value}>
                  <TimePickerSegment segment={"hours"} />
                  <TimePickerSeparator>:</TimePickerSeparator>
                  <TimePickerSegment segment={"minutes"} />
                </TimePicker>
              </FormControl>
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button
            type="button"
            className="w-1/4 bg-transparent text-black border-2  hover:bg-black hover:text-white"
            disabled={loading}
            onClick={closeDialog}
          >
            Cancel
          </Button>
          {type === TimeSlotFormType.EDIT && (
            <Button
              type="button"
              className="w-1/4 bg-red-600 hover:bg-red-500"
              disabled={loading}
            >
              Delete
            </Button>
          )}
          <Button
            type="submit"
            className="w-1/4 bg-nyu-nv hover:bg-nyu-mv1"
            disabled={loading}
          >
            {type === TimeSlotFormType.CREATE ? "Create" : "Update"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default function TimeSlotFormDialog({
  open,
  onOpenChange,
  type,
  slotStart,
  slotEnd,
  closeDialog,
  selectedEvent,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: TimeSlotFormType;
  slotStart: Date | undefined;
  slotEnd: Date | undefined;
  closeDialog: () => void;
  selectedEvent?: TimeSlotCalendarEvent;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${
            type === TimeSlotFormType.CREATE ? "Create" : "Edit"
          } Time Slot`}</DialogTitle>
        </DialogHeader>
        <TimeSlotForm
          type={type}
          slotStart={slotStart}
          slotEnd={slotEnd}
          closeDialog={closeDialog}
          selectedEvent={selectedEvent}
        />
      </DialogContent>
    </Dialog>
  );
}
