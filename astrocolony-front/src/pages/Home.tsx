import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import data from "@/assets/data.json"

export default function Home() {
  const envData = localStorage.getItem("envData");
  const parsedData = envData ? JSON.parse(envData) : null;
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-2 px-4 pt-4 md:px-6 md:pt-6 lg:px-8 lg:pt-8">
            <h1 className="text-2xl font-bold">Welcome to AstroColony</h1>
            <p className="text-muted-foreground">
              Explore the latest data and insights from your colony.
            </p>
          </div>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards energy={parsedData.energyLevel} water={parsedData.waterLevel} oxygen={(parsedData.o2Level / parsedData.maxo2Level) * 100}/>
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
