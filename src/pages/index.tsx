import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import type { NavigationProps } from "@/types"

// Mock data for the DataTable that matches the expected schema
const data = [
  {
    id: 1,
    header: "Client Onboarding",
    type: "Process",
    status: "Done",
    target: "New Clients",
    limit: "5/month",
    reviewer: "John Smith"
  },
  {
    id: 2,
    header: "Payment Processing",
    type: "Financial",
    status: "In Progress",
    target: "All Clients",
    limit: "15/day",
    reviewer: "Jane Doe"
  },
  {
    id: 3,
    header: "Attendance Report",
    type: "Report",
    status: "Done",
    target: "Management",
    limit: "Weekly",
    reviewer: "Mike Johnson"
  },
  {
    id: 4,
    header: "Facilitator Schedule",
    type: "Calendar",
    status: "In Progress",
    target: "Staff",
    limit: "Monthly",
    reviewer: "Sarah Williams"
  },
  {
    id: 5,
    header: "Client Feedback",
    type: "Survey",
    status: "Done",
    target: "All Clients",
    limit: "Quarterly",
    reviewer: "Robert Brown"
  }
]

export default function Dashboard(_props: NavigationProps) {
  console.log('Inspecting SectionCards import:', typeof SectionCards, SectionCards);
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  );
} 