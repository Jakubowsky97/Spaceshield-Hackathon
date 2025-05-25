import { use, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Droplets,
  Activity,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plug,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { useTileCounter } from "@/hooks/useTileCounter";

type EnvironmentData = {
  energyLevel: number; // Opcjonalne, jeśli nie zawsze dostępne
  maxo2Level: number; // Opcjonalne, jeśli nie zawsze dostępne
  o2Level: number;
  waterLevel: number; // Dodane do typu
};

type MetricConfig = {
  key: keyof EnvironmentData;
  title: string;
  icon: any;
  unit: string;
  color: string;
  bgColor: string;
  iconColor: string;
  optimal: { min: number; max: number };
  max: number;
};

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

function getStatusColor(value: number, optimal: { min: number; max: number }) {
  if (value >= optimal.min && value <= optimal.max) return "bg-green-500";
  if (value < optimal.min * 0.8 || value > optimal.max * 1.2)
    return "bg-red-500";
  return "bg-yellow-500";
}

function getStatusText(value: number, optimal: { min: number; max: number }) {
  if (value >= optimal.min && value <= optimal.max) return "Optimal";
  if (value < optimal.min * 0.8 || value > optimal.max * 1.2) return "Critical";
  return "Warning";
}

function getStatusVariant(
  value: number,
  optimal: { min: number; max: number }
): "default" | "secondary" | "destructive" | "outline" {
  if (value >= optimal.min && value <= optimal.max) return "default";
  if (value < optimal.min * 0.8 || value > optimal.max * 1.2)
    return "destructive";
  return "secondary";
}

function getTrendIcon(value: number, optimal: { min: number; max: number }) {
  const midPoint = (optimal.min + optimal.max) / 2;
  if (value > midPoint) return TrendingUp;
  if (value < midPoint) return TrendingDown;
  return Activity;
}

export default function Resources() {
  const [envData, setEnvData] = useState<EnvironmentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [sandStorm, setSandStorm] = useState(true
  );
  const [sandStormWarning, setSandStromWarning] = useState(false);

  // Hook używany poprawnie wewnątrz komponentu
  const { savedTiles } = useTileCounter({
    localStorageKey: "farmClusters",
  });
  const tilesCount = savedTiles > 0 ? savedTiles : 1;

  useEffect(() => {
    const saved = localStorage.getItem("farmClusters");
    if (saved) {
      setFarms(JSON.parse(saved));
    }
  }, []);

  const dailyPowerConsumption = farms.reduce((total, farm) => {
    const energyConsumption = farm.farmStats?.energyConsumption || 0;
    return total + energyConsumption;
  }, 0);

  const dailyWaterUsage = farms.reduce((total, farm) => {
    const waterUsage = farm.farmStats?.waterUsage || 0;
    return total + waterUsage;
  }, 0);

  // Metryki zdefiniowane wewnątrz komponentu, żeby mieć dostęp do savedTiles
  const metrics: MetricConfig[] = useMemo(
    () => [
      {
        key: "waterLevel",
        title: "Water Level",
        icon: Droplets,
        unit: "L",
        color: "text-blue-600",
        bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
        iconColor: "text-blue-500",
        optimal: { min: 50 * tilesCount * 10, max: 100 * tilesCount * 10 },
        max: 150 * tilesCount * 10,
      },
      {
        key: "energyLevel",
        title: "Energy Level",
        icon: Plug,
        unit: "kWh",
        color: "text-orange-600",
        bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
        iconColor: "text-orange-500",
        optimal: { min: 100 * tilesCount * (sandStorm ? 0.2 : 1), max: 200 * tilesCount * (sandStorm ? 0.2 : 1) },
        max: 300 * tilesCount * (sandStorm ? 0.2 : 1),
      },
      {
        key: "o2Level",
        title: "O₂ Level",
        icon: Activity,
        unit: "ppm",
        color: "text-green-600",
        bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
        iconColor: "text-green-500",
        optimal: { min: 300, max: 500 },
        max: 600,
      },
    ],
    [tilesCount]
  );

  const fetchEnvData = async () => {
    setLoading(true);
    setError(null);
    try {
      const simulatedData: EnvironmentData = {
        o2Level: metrics[2].optimal.max * 0.95,
        maxo2Level: metrics[2].max,
        energyLevel: metrics[1].optimal.max * 0.9,
        waterLevel: metrics[0].optimal.max * 0.85,
      };

      await new Promise((resolve) => setTimeout(resolve, 800));
      setEnvData(simulatedData);
      localStorage.setItem("envData", JSON.stringify(simulatedData));
      setLastUpdated(new Date());
      setLoading(false);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    }
  };

  useEffect(() => {
    fetchEnvData();
  }, [tilesCount]);

  const criticalAlerts = envData
    ? metrics.filter((metric) => {
        const value = envData[metric.key];
        return (
          value < metric.optimal.min * 0.8 || value > metric.optimal.max * 1.2
        );
      })
    : [];

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader
          title="Resources"
          lastUpdated={lastUpdated ?? undefined}
          loading={loading}
          fetchEnvData={fetchEnvData}
        />

        <div className="max-w-7xl px-6 py-8">
          {/* Critical Alerts */}
          {criticalAlerts.length > 0 && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Critical Alert:</strong> {criticalAlerts.length}{" "}
                parameter(s) outside safe range:{" "}
                <span className="font-medium">
                  {criticalAlerts.map((m) => m.title).join(", ")}
                </span>
              </AlertDescription>
            </Alert>
          )}

          {sandStorm == true && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Weather Alert:</strong>
                <span className="font-medium">
                  A sand storm is currently active. Outdoor operations are unsafe and solar energy production may be reduced. 
                </span>
              </AlertDescription>
            </Alert>
          )}

          {sandStormWarning == true && (
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Weather Alert:</strong>
                <span className="font-medium">
                  A sand storm may be approaching. Prepare for reduced solar energy and limit outdoor activities.
                </span>
              </AlertDescription>
            </Alert>
          )}

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Loading environment data...
                </p>
              </div>
            </div>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          {envData && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {metrics.map((metric) => {
                const value = envData[metric.key] * (sandStorm && metric.key == "energyLevel" ? 0.2 : 1);
                const Icon = metric.icon;
                const TrendIcon = getTrendIcon(value, metric.optimal);
                const progressValue = (value / metric.max) * 100;

                return (
                  <Card
                    key={metric.key}
                    className={`${metric.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg bg-white/70 ${metric.iconColor}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {metric.title}
                          </CardTitle>
                        </div>
                        <Badge
                          variant={getStatusVariant(value, metric.optimal)}
                          className="text-xs font-medium"
                        >
                          {getStatusText(value, metric.optimal)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className={`text-3xl font-bold ${metric.color}`}>
                              {typeof value === "number"
                                ? value.toFixed(1)
                                : value}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">
                              {metric.unit}
                            </p>
                            {metric.key === "waterLevel" && (
                              <p className="text-xs text-blue-700 mt-1">
                                Daily usage: {dailyWaterUsage.toFixed(1)} L
                              </p>
                            )}
                            {metric.key === "energyLevel" && (
                              <p className="text-xs text-orange-700 mt-1">
                                Daily usage: {(dailyPowerConsumption * (sandStorm ? 0.2 : 1)).toFixed(1)}{" "}
                                kWh
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-gray-500">
                            <TrendIcon className="h-4 w-4" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Progress</span>
                            <span>{Math.round(progressValue)}%</span>
                          </div>
                          <Progress value={progressValue} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              Optimal: {metric.optimal.min}-{metric.optimal.max}
                            </span>
                            <span>Max: {metric.max}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Summary Stats */}
          {envData && (
            <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                System Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {
                      metrics.filter((m) => {
                        const value = envData[m.key];
                        return value >= m.optimal.min && value <= m.optimal.max;
                      }).length
                    }
                  </p>
                  <p className="text-sm text-gray-600">Optimal Parameters</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      metrics.filter((m) => {
                        const value = envData[m.key];
                        return (
                          (value < m.optimal.min || value > m.optimal.max) &&
                          !(
                            value < m.optimal.min * 0.8 ||
                            value > m.optimal.max * 1.2
                          )
                        );
                      }).length
                    }
                  </p>
                  <p className="text-sm text-gray-600">Warning Range</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {criticalAlerts.length}
                  </p>
                  <p className="text-sm text-gray-600">Critical Issues</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      (metrics.filter((m) => {
                        const value = envData[m.key];
                        return value >= m.optimal.min && value <= m.optimal.max;
                      }).length /
                        metrics.length) *
                        100
                    )}
                    %
                  </p>
                  <p className="text-sm text-gray-600">System Health</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
