/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useFields } from "@/data/fields";

export default function ReportsPage() {
  const [timeRange, setTimeRange] = React.useState("90d");
  const { fields } = useFields();

  const downloadSteps: { title: string; content: React.ReactNode }[] = [
    {
      title: "Select the field you want to download data for:",
      content: (
        <Select>
          <SelectTrigger
            className="w-[160px] rounded-lg"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select your field" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {fields.map((field) => (
              <SelectItem
                key={field.name}
                value={field.name}
                className="rounded-lg"
              >
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      title: "Select your fields and the time range you want to download:",
      content: (
        <Select>
          <SelectTrigger
            className="w-[160px] rounded-lg"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      title: "Click the download button to get your data",
      content: (
        <Button>
          <Download className="mr-2 h-4 w-4" /> Download your data
        </Button>
      ),
    },
  ];

  const chartConfig = {
    desktop: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const chartData = [
    { month: "Detected pests", desktop: 186 },
    { month: "Probability of infection", desktop: 305 },
    { month: "Infected crops", desktop: 237 },
    { month: "Field health", desktop: 273 },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-col gap-0.5 leading-none">
        <h2 className="text-2xl font-bold">Data & Reports</h2>
        <p className="text-muted-foreground">
          View and download reports for your organization
        </p>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="grid flex-1 gap-1">
              <CardTitle>History of your fields</CardTitle>
              <CardDescription>
                View the health of your fields over time
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <Chart timeRange={timeRange} />
          </CardContent>
        </Card>
        <div className="space-y-4 md:flex md:space-x-4 md:space-y-0">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Download your data</CardTitle>
              <CardDescription>
                Inspect your data more by downloading it
              </CardDescription>
              <CardContent className="px-0 pt-4">
                <div className="space-y-6">
                  {downloadSteps.map((step, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="flex aspect-square items-center justify-center rounded-full bg-secondary px-3 font-bold text-secondary-foreground">
                          {index + 1}
                        </span>
                        <p className="text-muted-foreground">{step.title}</p>
                      </div>
                      {step.content}
                    </div>
                  ))}
                </div>
              </CardContent>
            </CardHeader>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>View your KPIs</CardTitle>
              <CardDescription>
                Check the key performance indicators of your fields
              </CardDescription>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto max-h-[320px]"
                >
                  <RadarChart data={chartData}>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <PolarAngleAxis dataKey="month" />
                    <PolarGrid />
                    <Radar
                      dataKey="desktop"
                      fill="var(--color-desktop)"
                      fillOpacity={0.6}
                      dot={{
                        r: 4,
                        fillOpacity: 1,
                      }}
                    />
                  </RadarChart>
                </ChartContainer>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Chart({ timeRange }: { timeRange: string }) {
  const chartData = [
    { date: "2025-01-01", desktop: 222, mobile: 150 },
    { date: "2025-01-02", desktop: 97, mobile: 180 },
    { date: "2025-01-03", desktop: 167, mobile: 120 },
    { date: "2025-01-01", desktop: 242, mobile: 260 },
    { date: "2025-01-02", desktop: 373, mobile: 290 },
    { date: "2025-01-03", desktop: 301, mobile: 340 },
    { date: "2025-01-07", desktop: 245, mobile: 180 },
    { date: "2025-01-08", desktop: 409, mobile: 320 },
    { date: "2025-01-09", desktop: 59, mobile: 110 },
    { date: "2025-01-10", desktop: 261, mobile: 190 },
    { date: "2025-01-11", desktop: 327, mobile: 350 },
    { date: "2025-01-12", desktop: 292, mobile: 210 },
    { date: "2025-01-13", desktop: 342, mobile: 380 },
    { date: "2025-01-14", desktop: 137, mobile: 220 },
    { date: "2025-01-15", desktop: 120, mobile: 170 },
    { date: "2025-01-16", desktop: 138, mobile: 190 },
    { date: "2025-01-17", desktop: 446, mobile: 360 },
    { date: "2025-01-18", desktop: 364, mobile: 410 },
    { date: "2025-01-19", desktop: 243, mobile: 180 },
    { date: "2025-01-20", desktop: 89, mobile: 150 },
    { date: "2025-01-21", desktop: 137, mobile: 200 },
    { date: "2025-01-22", desktop: 224, mobile: 170 },
    { date: "2025-01-23", desktop: 138, mobile: 230 },
    { date: "2025-01-24", desktop: 387, mobile: 290 },
    { date: "2025-01-25", desktop: 215, mobile: 250 },
    { date: "2025-01-26", desktop: 75, mobile: 130 },
    { date: "2025-01-27", desktop: 383, mobile: 420 },
    { date: "2025-01-28", desktop: 122, mobile: 180 },
    { date: "2025-01-29", desktop: 315, mobile: 240 },
    { date: "2025-01-30", desktop: 454, mobile: 380 },
    { date: "2025-02-01", desktop: 165, mobile: 220 },
    { date: "2025-02-02", desktop: 293, mobile: 310 },
    { date: "2025-02-03", desktop: 247, mobile: 190 },
    { date: "2025-02-01", desktop: 385, mobile: 420 },
    { date: "2025-02-02", desktop: 481, mobile: 390 },
    { date: "2025-02-03", desktop: 498, mobile: 520 },
    { date: "2025-02-07", desktop: 388, mobile: 300 },
    { date: "2025-02-08", desktop: 149, mobile: 210 },
    { date: "2025-02-09", desktop: 227, mobile: 180 },
    { date: "2025-02-10", desktop: 293, mobile: 330 },
    { date: "2025-02-11", desktop: 335, mobile: 270 },
    { date: "2025-02-12", desktop: 197, mobile: 240 },
    { date: "2025-02-13", desktop: 197, mobile: 160 },
    { date: "2025-02-14", desktop: 448, mobile: 490 },
    { date: "2025-02-15", desktop: 473, mobile: 380 },
    { date: "2025-02-16", desktop: 338, mobile: 400 },
    { date: "2025-02-17", desktop: 499, mobile: 420 },
    { date: "2025-02-18", desktop: 315, mobile: 350 },
    { date: "2025-02-19", desktop: 235, mobile: 180 },
    { date: "2025-02-20", desktop: 177, mobile: 230 },
    { date: "2025-02-21", desktop: 82, mobile: 140 },
    { date: "2025-02-22", desktop: 81, mobile: 120 },
    { date: "2025-02-23", desktop: 252, mobile: 290 },
    { date: "2025-02-24", desktop: 294, mobile: 220 },
    { date: "2025-02-25", desktop: 201, mobile: 250 },
    { date: "2025-02-26", desktop: 213, mobile: 170 },
    { date: "2025-02-27", desktop: 420, mobile: 460 },
    { date: "2025-02-28", desktop: 233, mobile: 190 },
    { date: "2025-02-29", desktop: 78, mobile: 130 },
    { date: "2025-02-30", desktop: 340, mobile: 280 },
    { date: "2025-02-31", desktop: 178, mobile: 230 },
    { date: "2025-03-01", desktop: 178, mobile: 200 },
    { date: "2025-03-02", desktop: 470, mobile: 410 },
    { date: "2025-03-03", desktop: 103, mobile: 160 },
    { date: "2025-03-01", desktop: 439, mobile: 380 },
    { date: "2025-03-02", desktop: 88, mobile: 140 },
    { date: "2025-03-03", desktop: 294, mobile: 250 },
    { date: "2025-03-07", desktop: 323, mobile: 370 },
    { date: "2025-03-08", desktop: 385, mobile: 320 },
    { date: "2025-03-09", desktop: 438, mobile: 480 },
    { date: "2025-03-10", desktop: 155, mobile: 200 },
    { date: "2025-03-11", desktop: 92, mobile: 150 },
    { date: "2025-03-12", desktop: 492, mobile: 420 },
    { date: "2025-03-13", desktop: 81, mobile: 130 },
    { date: "2025-03-14", desktop: 426, mobile: 380 },
    { date: "2025-03-15", desktop: 307, mobile: 350 },
    { date: "2025-03-16", desktop: 371, mobile: 310 },
    { date: "2025-03-17", desktop: 475, mobile: 520 },
    { date: "2025-03-18", desktop: 107, mobile: 170 },
    { date: "2025-03-19", desktop: 341, mobile: 290 },
    { date: "2025-03-20", desktop: 408, mobile: 450 },
    { date: "2025-03-21", desktop: 169, mobile: 210 },
    { date: "2025-03-22", desktop: 317, mobile: 270 },
    { date: "2025-03-23", desktop: 480, mobile: 530 },
    { date: "2025-03-24", desktop: 132, mobile: 180 },
    { date: "2025-03-25", desktop: 141, mobile: 190 },
    { date: "2025-03-26", desktop: 434, mobile: 380 },
    { date: "2025-03-27", desktop: 448, mobile: 490 },
    { date: "2025-03-28", desktop: 149, mobile: 200 },
    { date: "2025-03-29", desktop: 103, mobile: 160 },
    { date: "2025-03-30", desktop: 446, mobile: 400 },
  ];

  const chartConfig = {
    visitors: {
      label: "Field health",
    },
    desktop: {
      label: "Field 1",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Field 2",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2025-03-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <AreaChart data={filteredData}>
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-mobile)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="mobile"
          type="natural"
          fill="url(#fillMobile)"
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Area
          dataKey="desktop"
          type="natural"
          fill="url(#fillDesktop)"
          stroke="var(--color-desktop)"
          stackId="a"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
