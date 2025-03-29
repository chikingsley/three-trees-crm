import { DataTable } from "@/components/data-table"

// Mock data for clients
const data = [
  {
    id: 1,
    header: "John Smith",
    type: "Individual",
    status: "Active",
    target: "Weekly Sessions",
    limit: "2/week",
    reviewer: "Sarah Therapist"
  },
  {
    id: 2,
    header: "Jane Doe",
    type: "Family",
    status: "Active",
    target: "Bi-weekly Sessions",
    limit: "1/2weeks",
    reviewer: "Mike Counselor"
  },
  {
    id: 3,
    header: "Johnson Family",
    type: "Family",
    status: "On Hold",
    target: "Monthly Sessions",
    limit: "1/month",
    reviewer: "Sarah Therapist"
  },
  {
    id: 4,
    header: "Robert Williams",
    type: "Individual",
    status: "Active",
    target: "Weekly Sessions",
    limit: "1/week",
    reviewer: "Mike Counselor"
  },
  {
    id: 5,
    header: "Children's Center",
    type: "Organization",
    status: "Active",
    target: "Group Sessions",
    limit: "3/week",
    reviewer: "Director of Services"
  }
]

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold mb-4">Clients</h1>
        <p className="text-muted-foreground mb-6">Manage your client relationships</p>
      </div>
      <DataTable data={data} />
    </div>
  );
} 