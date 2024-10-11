import { EventProps } from "react-big-calendar";
import { TimeSlotCalendarEvent } from "@/lib/types";
import dayjs, { Dayjs } from "dayjs";

const formatTime = (date: Dayjs): string => dayjs(date).format("hh:mm A");

export default function CalendarEvent({
  event,
}: {
  event: TimeSlotCalendarEvent;
}) {
  return (
    <div
      className={`${
        event?.location === "ARC" ? "bg-nyu-nv" : "bg-nyu-dv" //TODO: refactor
      } text-white rounded-md shadow-md h-full p-1 whitespace-nowrap`}
    >
      <div className="text-xs font-bold">{event.title}</div>
      <p className="py-0.5 text-xs">
        {event.location} - {formatTime(event.start)} - {formatTime(event.end)}
      </p>
      <p className="text-xs overflow-hidden overflow-ellipsis"></p>
    </div>
  );
}
