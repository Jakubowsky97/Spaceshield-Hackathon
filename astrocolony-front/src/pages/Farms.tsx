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
  farmStats?: FarmStats;
};

type FarmStats = {
  cropsYield: number;
  waterUsage: number;
  energyConsumption: number;
};

const fetchEnergyConsumption = async (tiles: Tile[]): Promise<number> => {
  const response = fetch("http://localhost:8080/api/power/calcPowerConsumption?m2=" + tiles.length * 10)
  const data = await response.then(res => res.json());
  return data;
}

const fetchWaterUsage = async (tiles: Tile[]): Promise<number> => {
  const response = fetch("http://localhost:8080/api/water/consumption?m2=" + tiles.length * 10)
  const data = await response.then(res => res.json());
  return data;
}

export default function Farms() {
  const [farms, setFarms] = useState<Farm[]>([]);
const [hasLoadedInitialFarms, setHasLoadedInitialFarms] = useState(false);

useEffect(() => {
  const saved = localStorage.getItem("farmClusters");
  if (saved) {
    setFarms(JSON.parse(saved));
    setHasLoadedInitialFarms(true);
  }
}, []);

useEffect(() => {
  const updateFarmStats = async () => {
    const updatedFarms = await Promise.all(
      farms.map(async (farm) => {
        const energyConsumption = await fetchEnergyConsumption(farm.tiles);
        const waterUsage = await fetchWaterUsage(farm.tiles);
        return {
          ...farm,
          farmStats: {
            cropsYield: 5, // Placeholder
            waterUsage: Number(waterUsage.toFixed(0)),
            energyConsumption: Number(energyConsumption.toFixed(0)),
          },
        };
      })
    );
    localStorage.setItem("farmClusters", JSON.stringify(updatedFarms));
    setFarms(updatedFarms);
  };

  if (hasLoadedInitialFarms && farms.length > 0) {
    updateFarmStats();
  }
}, [hasLoadedInitialFarms]);


  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Farms" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {farms.length === 0 && <p>No farms saved yet.</p>}

          {farms.map((farm, idx) => {
            const farmName = farm.name ?? `Farm #${idx + 1}`;
            const stats = farm.farmStats || {
              cropsYield: 0,
              waterUsage: 0,
              energyConsumption: 0,
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
                    Space taken: <strong>{farm.tiles.length * 10} m²</strong>
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
