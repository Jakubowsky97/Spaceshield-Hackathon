"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import "../globals.css";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive area chart";

const chartData = [
  {
    type: "Energy",
    dates: [
      { date: "sol 1", energy: 1000 },
      { date: "sol 2", energy: 1200 },
      { date: "sol 3", energy: 1100 },
      { date: "sol 4", energy: 1500 },
      { date: "sol 5", energy: 1400 },
      { date: "sol 6", energy: 1600 },
      { date: "sol 7", energy: 1550 },
    ],
  },
  {
    type: "Oxygen",
    dates: [
      { date: "sol 1", oxygen: 300 },
      { date: "sol 2", oxygen: 320 },
      { date: "sol 3", oxygen: 310 },
      { date: "sol 4", oxygen: 350 },
      { date: "sol 5", oxygen: 340 },
      { date: "sol 6", oxygen: 360 },
      { date: "sol 7", oxygen: 355 },
    ],
  },
  {
    type: "Resources",
    dates: [
      { date: "sol 1", water: 800, energy: 600, oxygen: 500 },
      { date: "sol 2", water: 900, energy: 700, oxygen: 600 },
      { date: "sol 3", water: 850, energy: 650, oxygen: 550 },
      { date: "sol 4", water: 950, energy: 750, oxygen: 650 },
      { date: "sol 5", water: 900, energy: 700, oxygen: 600 },
      { date: "sol 6", water: 1000, energy: 800, oxygen: 700 },
      { date: "sol 7", water: 950, energy: 750, oxygen: 650 },
    ],
  },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [type, setType] = React.useState<"Energy" | "Oxygen" | "Resources">(
    "Energy"
  );

  console.log(chartData.find((d) => d.type === type)?.dates);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>
          {(type == "Energy" && "Production level of energy") ||
            (type == "Oxygen" && "Changes in oxygen") ||
            (type == "Resources" && "Usage of: Water, Energy, etc.")}
        </CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 7 sols
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={type}
            onValueChange={(value) => {
              if (
                value === "Energy" ||
                value === "Oxygen" ||
                value === "Resources"
              ) {
                setType(value);
              }
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="Energy">Energy</ToggleGroupItem>
            <ToggleGroupItem value="Oxygen">Oxygen</ToggleGroupItem>
            <ToggleGroupItem value="Resources">Resources</ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={type}
            onValueChange={(value) => {
              if (
                value === "Energy" ||
                value === "Oxygen" ||
                value === "Resources"
              ) {
                setType(value);
              }
            }}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 7 sols" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="Energy" className="rounded-lg">
                Energy
              </SelectItem>
              <SelectItem value="Oxygen" className="rounded-lg">
                Oxygen
              </SelectItem>
              <SelectItem value="Resources" className="rounded-lg">
                Resources
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData.find((d) => d.type === type)?.dates}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              {type === "Resources" && (
                <>
                  <linearGradient id="fillWater" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-water)"
                      stopOpacity={1.0}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-water)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-energy)"
                      stopOpacity={1.0}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-energy)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillOxygen" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-oxygen)"
                      stopOpacity={1.0}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-oxygen)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </>
              )}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                value.charAt(0).toUpperCase() + value.slice(1)
              }
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    value.charAt(0).toUpperCase() + value.slice(1)
                  }
                  indicator="dot"
                />
              }
            />
            {(type === "Energy" && (
              <Area
                dataKey="energy"
                type="natural"
                fill="url(#fillEnergy)"
                stroke="var(--color-energy)"
                stackId="a"
              />
            )) ||
              (type === "Oxygen" && (
                <Area
                  dataKey="oxygen"
                  type="natural"
                  fill="url(#fillOxygen)"
                  stroke="var(--color-oxygen)"
                  stackId="a"
                />
              )) ||
              (type === "Resources" && [
                <Area
                  key="water"
                  dataKey="water"
                  type="natural"
                  fill="url(#fillWater)"
                  stroke="var(--color-water)"
                  stackId="a"
                />,
                <Area
                  key="energy"
                  dataKey="energy"
                  type="natural"
                  fill="url(#fillEnergy)"
                  stroke="var(--color-energy)"
                  stackId="a"
                />,
                <Area
                  key="oxygen"
                  dataKey="oxygen"
                  type="natural"
                  fill="url(#fillOxygen)"
                  stroke="var(--color-oxygen)"
                  stackId="a"
                />,
              ])}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
