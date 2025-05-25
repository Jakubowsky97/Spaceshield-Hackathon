import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IconPlayerPauseFilled, IconPlayerPlay, IconPlayerPlayFilled, IconPlayerTrackNext, IconPlayerTrackNextFilled } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

export function SiteHeader({ title, lastUpdated, loading, fetchEnvData }: { title: string, lastUpdated?: Date, loading?: boolean, fetchEnvData?: () => void }) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{title}</h1>
        </div>
        {title === "Dashboard" && (
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Sol 1, 12:00 PM
            </p>
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"  
            />
            <IconPlayerPauseFilled />
            <IconPlayerPlay />
            <IconPlayerTrackNext />
          </div>
        )}
        {title === "Resources" && (
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated ? lastUpdated.toLocaleString() : "N/A"}
            </p>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 p-0"
              onClick={fetchEnvData}
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin">
                  <RefreshCw className="h-4 w-4" />
                </span>
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
