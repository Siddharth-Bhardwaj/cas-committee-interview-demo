# Interaction Flow and Backend API Design

## Interaction Flow

### Tutor Side
1. **Login**: Tutor logs in to the system.
2. **Enter Availability**: Tutor enters available time slots.
3. **View Slots**: Tutor views their entered slots and sees if any slots are booked by students.

### Student Side
1. **Login**: Student logs in to the system.
2. **Select Date**: Student selects a date from the calendar.
3. **View Available Slots**: The system shows available time slots for the selected date without displaying tutor names.
4. **Book Slot**: Student books a selected time slot.

## Backend API

### Endpoints

#### Tutor Endpoints
- **POST /api/timeslots/create**
  - **Description**: Create a new time slot.
  - **Body**:
    ```json
    {
      "tutorId": "string",
      "startTime": "ISO Date String",
      "endTime": "ISO Date String"
    }
    ```

#### Student Endpoints
- **GET /api/timeslots/available**
  - **Description**: Get available time slots for a specific date.
  - **Query Parameters**:
    - `date`: ISO Date String

- **POST /api/appointments/create**
  - **Description**: Create a new appointment.
  - **Body**:
    ```json
    {
      "studentId": "string",
      "timeSlotId": "string"
    }
    ```
