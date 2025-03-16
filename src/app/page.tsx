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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { GeoJSONData } from "@/components/world/globe";
import { useFields } from "@/data/fields";
import { calculateRemainingTime } from "@/lib/calculate-remaining-time";
import { formatDate } from "@/lib/format-date";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChartLine,
  Ellipsis,
  HistoryIcon,
  Plus,
  SquarePen,
  Trash,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function LoadingMap() {
  return (
    <div className="flex items-center justify-center">
      <Spinner />
    </div>
  );
}

const WorldMap = dynamic(() => import("@/components/world/scene"), {
  ssr: false,
  loading: () => (
    <div className="relative h-full w-full">
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center justify-center space-y-1 text-muted-foreground">
          <Spinner />
          <span>Loading your globe...</span>
        </div>
      </span>
    </div>
  ),
});

function greeting() {
  const today = new Date();
  const hour = today.getHours();
  if (hour >= 6 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

export default function Page() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const router = useRouter();

  const { fields, removeField, setLoading } = useFields();

  const [animationParent] = useAutoAnimate();

  return (
    <div>
      <div className="mb-4 flex flex-col gap-0.5 leading-none">
        <h2 className="text-2xl font-bold">{greeting()}, User!</h2>
        <p className="text-muted-foreground">
          View your fields, analyze your data, and manage your crops.
        </p>
      </div>
      <div className="flex h-full flex-col gap-5 lg:flex-row">
        <section className="flex h-full w-full flex-col gap-5">
          <Card className="h-3/5">
            <CardHeader>
              <CardTitle>Field maps</CardTitle>
              <CardDescription>View your fields on the map.</CardDescription>
            </CardHeader>
            <CardContent className="relative h-3/5 md:h-4/5">
              <React.Suspense fallback={<LoadingMap />}>
                <WorldMap />
              </React.Suspense>
            </CardContent>
          </Card>
          <Card className="h-2/5">
            <CardHeader>
              <CardTitle>Data</CardTitle>
              <CardDescription>
                View and analyze your data. See your field&apos;s health, crop
                growth, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Data />
            </CardContent>
          </Card>
        </section>
        <Card className="lg:min-h-[75vh]">
          <CardHeader className="flex flex-row justify-between space-x-4">
            <div className="flex-1 space-y-1.5">
              <CardTitle>My fields</CardTitle>
              <CardDescription>
                Manage your fields and crops. Add new fields, edit existing
                ones, and track your crops.
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a new field</DialogTitle>
                  <DialogDescription>
                    Enter the details of your new field.
                  </DialogDescription>
                </DialogHeader>
                <NewFieldForm setDialogOpen={setDialogOpen} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-2" ref={animationParent}>
              {fields.length <= 0 ? (
                <div className="flex h-full items-center justify-center">
                  <span className="text-muted-foreground">
                    No fields found, create one and start analyzing!
                  </span>
                </div>
              ) : (
                fields.map((field, i) => (
                  <Card key={i} className="bg-background shadow-md">
                    <CardHeader>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex flex-col gap-1.5 leading-none">
                          <CardTitle>{field.name}</CardTitle>
                          <CardDescription>
                            {field.crop} | Last updated{" "}
                            {formatDate(field.lastUpdated)}
                          </CardDescription>
                        </div>
                        <Image
                          src={field.imageSrc}
                          alt="Field image"
                          height={45}
                          width={45}
                        />
                      </div>
                    </CardHeader>
                    {!!field.data && (
                      <CardContent>
                        <ul>
                          <li>
                            - Field status:{" "}
                            <span
                              className={`font-bold ${
                                field.data?.infected
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            >
                              {field.data.infected ? "Infected" : "Healthy"}
                            </span>
                          </li>
                          {!field.data.infected && (
                            <li>
                              - Infection possibility:{" "}
                              <span
                                className={`font-bold ${
                                  field.data.infectationChance > 0.75
                                    ? "text-red-500"
                                    : field.data.infectationChance > 0.5
                                      ? "text-red-600"
                                      : field.data.infectationChance > 0.25
                                        ? "text-amber-500"
                                        : "text-green-500"
                                }`}
                              >
                                {field.data.infectationChance * 100}%
                              </span>
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    )}
                    <CardFooter>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Ellipsis className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <HistoryIcon className="mr-2 h-4 w-4" /> See
                                historical data
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <SquarePen className="mr-2 h-4 w-4" /> Edit
                                field
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  removeField(field.name);
                                  router.refresh();
                                }}
                              >
                                <Trash className="mr-2 h-4 w-4" /> Delete field
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button
                            onClick={() => {
                              setLoading(field.name, true);

                              router.refresh();
                              toast.loading("Analyzing field data...");
                              setTimeout(() => {
                                toast.dismiss();
                              }, 4000);
                            }}
                            disabled={field.loading}
                          >
                            {!field.loading ? (
                              <>
                                <ChartLine className="mr-2 h-4 w-4" /> Analyze
                              </>
                            ) : (
                              <>
                                <Spinner /> Analyzing...
                              </>
                            )}
                          </Button>
                        </div>
                        {!!field.loading && (
                          <span className="text-sm text-muted-foreground">
                            {calculateRemainingTime(new Date(field.finishTime))}
                          </span>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Data() {
  const mockData = [
    {
      id: "ANZ-2312",
      status: "Completed",
      probability: "54%",
      infected: "Not infected",
    },
    {
      id: "ANZ-2409",
      status: "Completed",
      probability: "87%",
      infected: "Infected",
    },
    {
      id: "ANZ-2411",
      status: "Analyzing...",
      probability: "-",
      infected: "-",
    },
  ];

  return (
    <Table className="mb-4 md:mb-0">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Analyze ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Infestation Probability</TableHead>
          <TableHead className="text-right">Infested</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockData.map((data) => (
          <TableRow key={data.id}>
            <TableCell className="font-medium">{data.id}</TableCell>
            <TableCell>{data.status}</TableCell>
            <TableCell>{data.probability}</TableCell>
            <TableCell className="text-right">{data.infected}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function NewFieldForm({
  setDialogOpen,
}: {
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { addField } = useFields();
  const router = useRouter();

  const [automatic, setAutomatic] = React.useState(false);

  const formSchema = z.object({
    name: z.string().nonempty({ message: "Please enter your field's name." }),
    crop: z.string().nonempty({ message: "Please enter the crop type." }),
    geoJson: z
      .string()
      .nonempty({ message: "Please enter the field's location." }),
    automatic: z.boolean().default(false),
    frequency: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      crop: "",
      geoJson: "",
      automatic: false,
      frequency: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const randomMinutes = Math.floor(Math.random() * 60);
    const now = new Date();
    const finishTime = new Date(now.getTime() + 1000 * randomMinutes * 60);

    addField({
      name: values.name,
      crop: values.crop,
      geoJson: JSON.parse(values.geoJson) as GeoJSONData,
      finishTime,
      imageSrc: `/fields/field${Math.floor(Math.random()) + 1}.png`,
    });

    toast.success("Field added successfully!");

    router.refresh();
    setDialogOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of the field</FormLabel>
              <FormControl>
                <Input placeholder="My corn field" {...field} />
              </FormControl>
              <FormDescription>
                This is a name to help you identify your field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="crop"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crop type</FormLabel>
              <FormControl>
                <Input placeholder="Corn" {...field} />
              </FormControl>
              <FormDescription>
                Enter the crop type you are growing in this field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="geoJson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location data</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Insert the GeoJSON data for your field"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can get this data from your GPS device or mapping software.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="automatic"
            checked={automatic}
            onCheckedChange={() => setAutomatic(!automatic)}
          />
          <label
            htmlFor="automatic"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable automatic analyzing
          </label>
        </div>
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Automatic analyzing frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={!automatic}>
                    <SelectValue placeholder="Select a frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                  <SelectItem value="Every 12 hours">Every 12 hours</SelectItem>
                  <SelectItem value="Once a day">Once a day</SelectItem>
                  <SelectItem value="3 times a week">3 times a week</SelectItem>
                  <SelectItem value="Once a week">Once a week</SelectItem>
                  <SelectItem value="Once every 2 weeks">
                    Once every 2 weeks
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">
            <Plus className="mr-2 h-4 w-4" />
            Create field
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
