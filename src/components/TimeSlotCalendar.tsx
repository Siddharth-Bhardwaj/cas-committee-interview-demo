"use client";
import { TimeSlotCalendarEvent } from "@/lib/types";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";
import { Calendar, SlotInfo, Views, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarEvent from "./CalendarEvent";
import "./css/calendar.css";

const localizer = dayjsLocalizer(dayjs);

export default function TimeSlotCalendar({
  date,
  setDate,
  events = [],
  height,
  style,
  handleSelectSlot,
  handleSelectEvent,
  ...calendarProps
}: {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  events?: Array<TimeSlotCalendarEvent> | undefined;
  height?: string | undefined;
  style?: React.CSSProperties | undefined;
  handleSelectSlot: (slotInfo: SlotInfo) => void;
  handleSelectEvent: (
    event: TimeSlotCalendarEvent,
    e: SyntheticEvent<HTMLElement, Event>
  ) => void;
}) {
  return (
    <>
      <Calendar
        selectable
        localizer={localizer}
        views={[Views.WEEK]}
        defaultView={Views.WEEK}
        date={date}
        onNavigate={(date) => {
          setDate(new Date(date));
        }}
        min={new Date(1972, 0, 1, 9, 0, 0)}
        max={new Date(1972, 0, 1, 20, 0, 0)}
        timeslots={1}
        step={60}
        events={events}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: height ? height : "72vh", ...style }}
        formats={{
          eventTimeRangeFormat: () => {
            return "";
          },
        }}
        components={{
          event: CalendarEvent,
        }}
        {...calendarProps}
      />
    </>
  );
}
