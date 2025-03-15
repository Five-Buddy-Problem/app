import { CircleAlert } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Image
        src="/not-found.png"
        alt="Not found image"
        height={250}
        width={300}
      />
      <h2 className="flex items-center text-2xl font-bold">
        <CircleAlert className="mr-2 h-6 w-6 font-bold" /> Oops.. not found
      </h2>
      <p className="text-muted-foreground">
        This page does not exist, maybe it was mixed in with your crops?
      </p>
    </div>
  );
}
