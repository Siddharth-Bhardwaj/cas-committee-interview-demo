"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { timeSlotSearchFormSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Course, Department } from "@prisma/client";
import axiosInstance from "@/lib/axios";
import TimeSlotCard from "@/components/TimeSlotCard";
import { TimeSlotWithCourseAndLocation } from "@/lib/types";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const [departments, setDepartments] = useState<Array<Department>>([]);
  const [courses, setCourses] = useState<Array<Course>>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loadingTimeSlots, setLoadingTimeSlots] = useState<boolean>(false);
  const [timeSlots, setTimeSlots] = useState<
    Array<TimeSlotWithCourseAndLocation>
  >([]);
  const [showCreateAppointmentModal, setShowCreateAppointmentModal] =
    useState<boolean>(false);

  let allCourses = useRef<Array<Course>>([]);
  let selectedTimeSlot = useRef<TimeSlotWithCourseAndLocation | null>(null);

  const form = useForm<z.infer<typeof timeSlotSearchFormSchema>>({
    resolver: zodResolver(timeSlotSearchFormSchema),
    defaultValues: {
      department: "",
      course: "",
    },
  });

  useEffect(() => {
    setLoading(true);
    const fetchDepartments = axiosInstance.get("/departments/all");
    const fetchCourses = axiosInstance.get("/courses/all");

    Promise.all([fetchDepartments, fetchCourses])
      .then(([departmentsResponse, coursesResponse]) => {
        if (departmentsResponse.data && departmentsResponse.data.departments) {
          setDepartments(departmentsResponse.data.departments);
        }
        if (coursesResponse.data && coursesResponse.data.courses) {
          setCourses(coursesResponse.data.courses);
          allCourses.current = coursesResponse.data.courses;
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

  const handleDateChange = (value: Date | undefined) => {
    if (value) {
      setDate(value);
    }
  };

  const handleSelectedDepartmentChange = (value: string) => {
    setSelectedDepartment(value);

    if (value === "all") {
      setCourses(allCourses.current);
    } else {
      setCourses(
        allCourses?.current
          ?.filter((course) => course.departmentId === value)
          .map((course) => course)
      );
    }

    if (selectedCourse && selectedCourse.length > 0) {
      const course = allCourses?.current?.find(
        (course) => course.id === selectedCourse
      );
      if (course && course.departmentId !== value) {
        setSelectedCourse("all");
      }
    }
  };

  const fetchTimeSlots = useCallback(async () => {
    setLoadingTimeSlots(true);
    axiosInstance
      .get("/timeslots/filter", {
        params: {
          date,
          departmentId: selectedDepartment,
          courseId: selectedCourse,
        },
      })
      .then(({ data }) => setTimeSlots(data))
      .catch((error) => {
        //TODO: error handling
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoadingTimeSlots(false);
      });
  }, [date, selectedDepartment, selectedCourse]);

  useEffect(() => {
    fetchTimeSlots();
  }, [date, selectedDepartment, selectedCourse, fetchTimeSlots]);

  const handleTimeSlotClick = (timeSlotId: string) => {
    setShowCreateAppointmentModal(true);
    selectedTimeSlot.current =
      timeSlots.find((timeSlot) => timeSlot.id === timeSlotId) || null;
  };

  const bookAppointment = async (timeSlotId: string | undefined) => {
    if (!timeSlotId) {
      console.error("Invalid time slot id");
      return;
    }
    setLoading(true);
    axiosInstance
      .post("/appointments/create", {
        timeSlotId,
        studentNetId: "snb8849", // TODO: get studentId from auth
      })
      .then(({ data, status }) => {
        // TODO: success message
        if (status === 201) {
          fetchTimeSlots();
        }
      })
      // TODO: Error handling
      .catch((error) => console.error("Error creating appointment:", error))
      .finally(() => {
        setLoading(false);
        setShowCreateAppointmentModal(false);
      });
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-16">
      <div className="flex space-x-4 w-full max-w-screen-lg">
        <div className="flex justify-center items-center w-1/3 border-2 rounded-lg h-96">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(value) => handleDateChange(value)}
          />
        </div>
        <div className="w-2/3 overflow-y-auto h-96">
          {date && (
            <div className="p-2 text-center rounded-lg font-bold bg-nyu-mv1 text-white mb-3">
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}
          <div className="overflow-y-auto">
            {loadingTimeSlots || !timeSlots ? (
              <LoadingSpinner className="w-full" />
            ) : timeSlots.length > 0 ? (
              timeSlots.map((timeSlot, index) => {
                return (
                  <TimeSlotCard
                    key={index}
                    index={index}
                    timeSlotId={timeSlot?.id}
                    course={timeSlot?.course?.name || "Course not available"}
                    dateRange={{
                      start: timeSlot?.startTime,
                      end: timeSlot?.endTime,
                    }}
                    location={
                      timeSlot?.location?.address || "Location not available"
                    }
                    onClick={handleTimeSlotClick}
                    setShowCreateAppointmentModal={
                      setShowCreateAppointmentModal
                    }
                  />
                );
              })
            ) : (
              <div className="flex flex-col items-center">
                No timeslots available
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog
        open={showCreateAppointmentModal && selectedTimeSlot?.current !== null}
        onOpenChange={setShowCreateAppointmentModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Appointment</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            You are about to create a tutoring appointment for{" "}
            <strong>{selectedTimeSlot?.current?.course?.name}</strong> at{" "}
            <strong>{selectedTimeSlot?.current?.location?.address}</strong> on{" "}
            <strong>
              {dayjs(selectedTimeSlot?.current?.startTime).format(
                "dddd, MMMM D, YYYY"
              )}
            </strong>{" "}
            from{" "}
            <strong>
              {dayjs(selectedTimeSlot?.current?.startTime).format("hh:mm A")}
            </strong>{" "}
            to{" "}
            <strong>
              {dayjs(selectedTimeSlot?.current?.endTime).format("hh:mm A")}
            </strong>
            .
          </DialogDescription>
          <DialogFooter>
            <Button
              className="w-1/4 bg-transparent text-black border-2  hover:bg-black hover:text-white"
              disabled={loading}
              onClick={() => setShowCreateAppointmentModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-1/4 bg-nyu-nv hover:bg-nyu-mv1"
              disabled={loading}
              onClick={() => bookAppointment(selectedTimeSlot?.current?.id)}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
