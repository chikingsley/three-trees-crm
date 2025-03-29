import { DataTable } from "@/components/data-table";

// Mock data for facilitators
const data = [
  {
    id: 1,
    header: "Sarah Therapist",
    type: "Therapist",
    status: "Active",
    target: "Individual & Family",
    limit: "20 clients",
    reviewer: "Clinical Director"
  },
  {
    id: 2,
    header: "Mike Counselor",
    type: "Counselor",
    status: "Active",
    target: "Individual",
    limit: "15 clients",
    reviewer: "Clinical Director"
  },
  {
    id: 3,
    header: "Jessica Psychologist",
    type: "Psychologist",
    status: "Active",
    target: "Assessment & Therapy",
    limit: "12 clients",
    reviewer: "Clinical Director"
  },
  {
    id: 4,
    header: "David Group Leader",
    type: "Group Facilitator",
    status: "Active",
    target: "Groups",
    limit: "4 groups",
    reviewer: "Program Manager"
  },
  {
    id: 5,
    header: "Amanda Intern",
    type: "Intern",
    status: "Training",
    target: "Supervised Sessions",
    limit: "8 clients",
    reviewer: "Mike Counselor"
  }
];

export default function FacilitatorsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold mb-4">Facilitators</h1>
        <p className="text-muted-foreground mb-6">Manage your therapy and counseling staff</p>
      </div>
      <DataTable data={data} />
    </div>
  );
} 