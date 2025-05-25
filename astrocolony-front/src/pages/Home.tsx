import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import data from "@/assets/data.json";
import { useEffect, useState } from "react";

// Nowa paleta kolorów
const colorPalette = {
  primary: {
    light: "#6366f1",
    dark: "#818cf8"
  },
  secondary: {
    light: "#14b8a6",
    dark: "#2dd4bf"
  },
  accent: {
    light: "#8b5cf6",
    dark: "#a78bfa"
  }
};

export default function Home() {
  const envData = localStorage.getItem("envData");
  const parsedData = envData ? JSON.parse(envData) : null;
  const [greenhouseData, setGreenhouseData] = useState({
    temperature: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const greenhouseData = await fetch(
        "http://localhost:8080/api/environment"
      ).then((res) => res.json());
      setGreenhouseData({
        temperature: greenhouseData.temperature,
      });
    };
    if (parsedData) {
      fetchData();
    } else {
      console.error("Environment data not found in localStorage.");
    }
  }, [setGreenhouseData]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Dashboard" />
        <div className="flex flex-1 flex-col bg-gradient-to-br from-slate-50 via-indigo-50/20 to-violet-50/10 dark:from-slate-950 dark:via-slate-900/80 dark:to-violet-950/10">
          <div className="flex flex-col gap-3 px-4 pt-6 md:px-6 md:pt-8 lg:px-8 lg:pt-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg ring-1 ring-white/10">
                <span className="text-white font-bold text-2xl">🚀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-indigo-700 to-violet-600 dark:from-white dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
                  AstroColony Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-300 font-medium mt-1">
                  Real-time monitoring of space colony systems
                </p>
              </div>
            </div>
          </div>

          <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8">
            <div className="grid gap-8">
              {/* Colony Status Card */}
              <div className="group relative">
                <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-violet-500/30 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-slate-100/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg ring-1 ring-white/10">
                        <span className="text-2xl">🌍</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                          Colony Vital Signs
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                          Current environmental metrics
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <SectionCards
                      energy={parsedData?.energyLevel || 0}
                      water={parsedData?.waterLevel || 0}
                      oxygen={
                        parsedData
                          ? (parsedData.o2Level / parsedData.maxo2Level) * 100
                          : 0
                      }
                      temperature={greenhouseData.temperature}
                    />
                  </div>
                </div>
              </div>

              {/* Analytics Section */}
              <div className="grid @[900px]/main:grid-cols-2 gap-8">
                <div className="relative">
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-20"></div>
                  <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-slate-100/80 dark:border-slate-800/80 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center shadow-sm">
                        <span className="text-white text-xl">📈</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                          Performance Metrics
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          Sol system analytics
                        </p>
                      </div>
                    </div>
                    <ChartAreaInteractive />
                  </div>
                </div>

                {/* Data Table Section */}
                <div className="relative">
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-20"></div>
                  <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-slate-100/80 dark:border-slate-800/80 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-sm">
                        <span className="text-white text-xl">📑</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                          Operational Logs
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          Latest system events
                        </p>
                      </div>
                    </div>
                    <DataTable
                      data={
                        data.map((item) => ({
                          ...item,
                          status: (
                            ["In progress", "Planned", "Ended", "Delayed"].includes(item.status)
                              ? item.status
                              : "Planned"
                          ) as "In progress" | "Planned" | "Ended" | "Delayed",
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}