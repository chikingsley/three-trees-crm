// import { DataTable } from "@/components/data-table";
// import { ChartAreaInteractive } from "@/components/chart-area-interactive";

// // Mock data for reports
// const data = [
//   {
//     id: 1,
//     header: "Monthly Client Summary",
//     type: "Monthly",
//     status: "Generated",
//     target: "Management",
//     limit: "May 1, 2024",
//     reviewer: "Director"
//   },
//   {
//     id: 2,
//     header: "Attendance Trends",
//     type: "Quarterly",
//     status: "Generated",
//     target: "Staff",
//     limit: "Q2 2024",
//     reviewer: "Director"
//   },
//   {
//     id: 3,
//     header: "Revenue Report",
//     type: "Monthly",
//     status: "Pending",
//     target: "Finance",
//     limit: "May 31, 2024",
//     reviewer: "Finance Manager"
//   },
//   {
//     id: 4,
//     header: "Facilitator Caseload",
//     type: "Weekly",
//     status: "Generated",
//     target: "Clinical Director",
//     limit: "May 7, 2024",
//     reviewer: "Admin"
//   },
//   {
//     id: 5,
//     header: "Client Outcomes",
//     type: "Biannual",
//     status: "Generated",
//     target: "Board",
//     limit: "July 1, 2024",
//     reviewer: "Research Team"
//   }
// ];

// export default function ReportsPage() {
//   return (
//     <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//       <div className="px-4 lg:px-6">
//         <h1 className="text-2xl font-bold mb-4">Reports</h1>
//         <p className="text-muted-foreground mb-6">Generate and view performance reports</p>
//       </div>
      
//       <div className="px-4 lg:px-6 mb-6">
//         <ChartAreaInteractive />
//       </div>
      
//       <DataTable data={data} />
//     </div>
//   );
// } 