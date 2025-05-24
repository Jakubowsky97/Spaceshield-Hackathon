import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Tile = [number, number];

type Farm = {
  tiles: Tile[];
  type: string;
  name?: string;
};

type FarmStats = {
  cropsYield: number;
  waterUsage: number;
  energyConsumption: number;
};

const exampleStats: Record<string, FarmStats> = {
  "Sunny Farm": {
    cropsYield: 15,
    waterUsage: 12000,
    energyConsumption: 500,
  },
  "Green Valley": {
    cropsYield: 10,
    waterUsage: 8000,
    energyConsumption: 300,
  },
  "Farm #1": {
    cropsYield: 8,
    waterUsage: 9000,
    energyConsumption: 400,
  },
};

export default function Farms() {
  const [farms, setFarms] = useState<Farm[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("farmClusters");
    if (saved) {
      setFarms(JSON.parse(saved));
    }
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Farms" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {farms.length === 0 && <p>No farms saved yet.</p>}

          {farms.map((farm, idx) => {
            const farmName = farm.name ?? `Farm #${idx + 1}`;
            const stats = exampleStats[farmName] ?? {
              cropsYield: 5,
              waterUsage: 7000,
              energyConsumption: 250,
            };

            return (
              <Card key={idx} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {farmName}
                    <Badge variant="secondary">{farm.type}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Tiles: <strong>{farm.tiles.length}</strong>
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <p>Crops yield: <strong>{stats.cropsYield} tons</strong></p>
                    <p>Water usage: <strong>{stats.waterUsage} liters</strong></p>
                    <p>Energy consumption: <strong>{stats.energyConsumption} kWh</strong></p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
