import { AppSidebar } from "@/components/app-sidebar"
import MarsMap from "@/components/MarsMap";
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Map() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Colony Map" />
            <MarsMap/>
      </SidebarInset>
    </SidebarProvider>
  );
}
