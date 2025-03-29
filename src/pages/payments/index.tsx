import { DataTable } from "@/components/data-table";

// Mock data for payments
const data = [
  {
    id: 1,
    header: "John Smith",
    type: "Session Fee",
    status: "Paid",
    target: "Individual Therapy",
    limit: "$120.00",
    reviewer: "Admin"
  },
  {
    id: 2,
    header: "Jane Doe",
    type: "Monthly Package",
    status: "Paid",
    target: "Family Counseling",
    limit: "$450.00",
    reviewer: "Admin"
  },
  {
    id: 3,
    header: "Johnson Family",
    type: "Session Fee",
    status: "Pending",
    target: "Family Therapy",
    limit: "$180.00",
    reviewer: "Admin"
  },
  {
    id: 4,
    header: "Robert Williams",
    type: "Assessment",
    status: "Paid",
    target: "Initial Assessment",
    limit: "$250.00",
    reviewer: "Admin"
  },
  {
    id: 5,
    header: "Children's Center",
    type: "Group Session",
    status: "Paid",
    target: "Group Therapy",
    limit: "$600.00",
    reviewer: "Director"
  }
];

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold mb-4">Payments</h1>
        <p className="text-muted-foreground mb-6">Track and manage client payments</p>
      </div>
      <DataTable data={data} />
    </div>
  );
} 