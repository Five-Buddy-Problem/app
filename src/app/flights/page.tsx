"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/codeblock";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function DronesPage() {
  const [timeRange, setTimeRange] = React.useState("1d");
  const [selectedDrone, setSelectedDrone] = React.useState<string>("droneOne");

  const logs =
    "[20:12.32] [DRONE 1] [STATUS UPDATE]: Flight started for Field 1\n[20:15.12] [DRONE 1] [STATUS UPDATE]: Flight completed for Field 1\n[20:15.12] [DRONE 1] [STATUS UPDATE]: Flight started for Field 2\n[20:20.12] [DRONE 1] [STATUS UPDATE]: Flight completed for Field 2\n[20:20.12] [DRONE 1] [STATUS UPDATE]: Flight started for Field 3\n[20:25.12] [DRONE 1] [STATUS UPDATE]: Flight completed for Field 3\n[20:25.12] [DRONE 1] [STATUS UPDATE]: Flight started for Field 4\n[20:30.12] [DRONE 1] [STATUS UPDATE]: Flight completed for Field 4\n[20:30.12] [DRONE 1] [STATUS UPDATE]: Flight started for Field 5\n[20:35.12] [DRONE 1] [STATUS UPDATE]: Flight completed for Field 5\n[20:35.12] [DRONE 1] [STATUS UPDATE]: Flight started for Field 6\n[20:40.12] [DRONE 1] [STATUS UPDATE]: Flight completed for Field 6\n[20:40.12] [DRONE 1] [STATUS UPDATE]: Flight started for Field 7\n[20:45.12] [DRONE 1] [STATUS UPDATE]: Flight completed for Field 7\n[20:45.12] [DRONE 1] [STATUS UPDATE]: Flight started for Field 8\n[20:50.12] [DRONE 1] [STATUS UPDATE]: Flight completed for Field 8\n[20:50.12] [DRONE 1] [STATUS UPDATE]: Flight started for Field 9\n[20:55.12] [DRONE 1] [STATUS UPDATE]: Flight completed for Field 9\n[20:55.12] [DRONE 1] [STATUS UPDATE]: Flight started for Field 10\n[21:00.12] [DRONE 1] [STATUS UPDATE]: Flight completed for Field 10";

  return (
    <div>
      <div className="mb-4 flex flex-col gap-0.5 leading-none">
        <h2 className="text-2xl font-bold">Flight logs</h2>
        <p className="text-muted-foreground">See the logs from your drones</p>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="grid flex-1 gap-1">
              <CardTitle>See the logs from your drones</CardTitle>
              <CardDescription>
                Select a drone to see its flight logs
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                  className="w-[160px] rounded-lg sm:ml-auto"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Last hour" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1d" className="rounded-lg">
                    Last hour
                  </SelectItem>
                  <SelectItem value="3d" className="rounded-lg">
                    This day
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    This week
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDrone} onValueChange={setSelectedDrone}>
                <SelectTrigger
                  className="w-[160px] rounded-lg sm:ml-auto"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Drone 1" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="droneOne" className="rounded-lg">
                    Drone 1
                  </SelectItem>
                  <SelectItem value="droneTwo" className="rounded-lg">
                    Drone 2
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <CodeBlock value={logs} language="bash" />
          </CardContent>
          <CardFooter className="justify-end space-x-2">
            <Button variant="outline">Learn more</Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(logs);
                toast.success("Copied the logs to clipboard");
              }}
            >
              <Copy /> Copy logs
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
