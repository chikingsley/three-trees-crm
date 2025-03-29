import { DataTable } from "@/components/data-table";

// Mock data for attendance
const data = [
  {
    id: 1,
    header: "John Smith",
    type: "Individual",
    status: "Attended",
    target: "Weekly Session",
    limit: "May 1, 2024",
    reviewer: "Sarah Therapist"
  },
  {
    id: 2,
    header: "Jane Doe",
    type: "Family",
    status: "Attended",
    target: "Family Session",
    limit: "May 2, 2024",
    reviewer: "Mike Counselor"
  },
  {
    id: 3,
    header: "Johnson Family",
    type: "Family",
    status: "Cancelled",
    target: "Family Session",
    limit: "May 3, 2024",
    reviewer: "Sarah Therapist"
  },
  {
    id: 4,
    header: "Robert Williams",
    type: "Individual",
    status: "No Show",
    target: "Assessment",
    limit: "May 4, 2024",
    reviewer: "Mike Counselor"
  },
  {
    id: 5,
    header: "Children's Group",
    type: "Group",
    status: "Attended",
    target: "Group Session",
    limit: "May 5, 2024",
    reviewer: "Group Leader"
  }
];

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold mb-4">Attendance</h1>
        <p className="text-muted-foreground mb-6">Track client session attendance</p>
      </div>
      <DataTable data={data} />
    </div>
  );
} 