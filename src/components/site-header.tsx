import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    const updateTitle = () => {
      const path = window.location.pathname;
      
      // Set page title based on current path
      if (path === "/") {
        setPageTitle("Dashboard");
      } else if (path.startsWith("/clients")) {
        setPageTitle(path === "/clients" ? "Clients" : "Client Details");
      } else if (path.startsWith("/payments")) {
        setPageTitle("Payments");
      } else if (path.startsWith("/attendance")) {
        setPageTitle("Attendance");
      } else if (path.startsWith("/facilitators")) {
        setPageTitle("Facilitators");
      } else if (path.startsWith("/reports")) {
        setPageTitle("Reports");
      } else if (path.startsWith("/settings")) {
        setPageTitle("Settings");
      }
    };

    // Set title on mount and when route changes
    updateTitle();
    window.addEventListener("popstate", updateTitle);
    
    return () => {
      window.removeEventListener("popstate", updateTitle);
    };
  }, []);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/your-username/three-trees-crm"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
