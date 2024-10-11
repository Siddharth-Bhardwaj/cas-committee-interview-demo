"use client";
import TimeSlotCalendar from "@/components/TimeSlotCalendar";
import { SyntheticEvent, useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import {
  TimeSlotCalendarEvent,
  TimeSlotWithCourseAndLocation,
} from "@/lib/types";
import dayjs from "dayjs";
import { TimeSlotFormType } from "@/lib/enums";
import TimeSlotFormDialog from "@/components/CreateSlotForm";

// TODO: Loading state
export default function CreateSchedulePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Array<TimeSlotCalendarEvent>>([]);
  const [slotStart, setSlotStart] = useState<Date>();
  const [slotEnd, setSlotEnd] = useState<Date>();
  const [showCreateFormDialog, setShowCreateFormDialog] =
    useState<boolean>(false);
  const [showEditFormDialog, setShowEditFormDialog] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<TimeSlotCalendarEvent>();

  useEffect(() => {
    fetchAndUpdateEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const fetchAndUpdateEvents = async () => {
    axiosInstance.get("/timeslots", { params: { date } }).then(({ data }) => {
      setEvents(
        data.map((timeSlot: TimeSlotWithCourseAndLocation) => {
          return {
            id: timeSlot.id,
            courseId: timeSlot.courseId,
            locationId: timeSlot.locationId,
            start: dayjs(timeSlot.startTime).toDate(),
            end: dayjs(timeSlot.endTime).toDate(),
            title: timeSlot.course?.name,
            location: timeSlot.location?.address,
          };
        })
      );
    });
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    if (start > end) {
      // TODO: error message
      console.error("start cannot be after end");
    }
    setSlotStart(start);
    setSlotEnd(end);
    setShowCreateFormDialog(true);
  };

  const handleSelectEvent = (
    event: TimeSlotCalendarEvent,
    e: SyntheticEvent<HTMLElement, Event>
  ) => {
    if (event) {
      setSelectedEvent(event);
      setShowEditFormDialog(true);
    }
  };

  return (
    <div className="py-16 px-12">
      <TimeSlotCalendar
        date={date}
        setDate={setDate}
        events={events}
        handleSelectSlot={handleSelectSlot}
        handleSelectEvent={handleSelectEvent}
      />
      <TimeSlotFormDialog
        open={showCreateFormDialog}
        onOpenChange={setShowCreateFormDialog}
        type={TimeSlotFormType.CREATE}
        slotStart={slotStart}
        slotEnd={slotEnd}
        closeDialog={() => {
          fetchAndUpdateEvents().then(() => setShowCreateFormDialog(false));
        }}
      />
      <TimeSlotFormDialog
        open={showEditFormDialog}
        onOpenChange={setShowEditFormDialog}
        type={TimeSlotFormType.EDIT}
        slotStart={
          selectedEvent && selectedEvent.start
            ? dayjs(selectedEvent?.start).toDate()
            : slotStart
        }
        slotEnd={
          selectedEvent && selectedEvent.end
            ? dayjs(selectedEvent?.end).toDate()
            : slotEnd
        }
        closeDialog={() => {
          fetchAndUpdateEvents().then(() => setShowEditFormDialog(false));
        }}
        selectedEvent={selectedEvent}
      />
    </div>
  );
}
