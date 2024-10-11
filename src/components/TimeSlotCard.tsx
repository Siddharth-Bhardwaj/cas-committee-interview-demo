import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DateRange } from "@/lib/types";
import dayjs from "dayjs";

const TimeSlotCard = ({
  index,
  timeSlotId,
  course,
  dateRange,
  location,
  onClick,
}: {
  index: number;
  timeSlotId: string;
  course: string;
  dateRange: DateRange;
  location: string;
  onClick: (timeSlotId: string) => void;
  setShowCreateAppointmentModal: (show: boolean) => void;
}) => {
  return (
    <>
      <Card
        key={index}
        onClick={() => onClick(timeSlotId)}
        className={`${
          index > 0 ? "mt-3" : "mb-3"
        } border rounded-lg font-bold shadow-sm hover:shadow-md transition duration-500 ease-in-out cursor-pointer hover:bg-blue-100`}
      >
        <CardHeader>
          <div className="grid grid-cols-3 items-center">
            <div className="col-span-2 space-y-1">
              <CardDescription>{course}</CardDescription>
              <CardTitle className="text-lg">
                {dayjs(dateRange.start).format("hh:mm A")} -{" "}
                {dayjs(dateRange.end).format("hh:mm A")}
              </CardTitle>
            </div>
            <div className="flex items-center justify-end">
              <CardDescription>{location}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </>
  );
};

export default TimeSlotCard;
