import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { Dot, EllipsisVertical, User } from "lucide-react";

export default function RenderCards() {
  return (
    <div className="flex items-start justify-between py-4 border-b-2 border-gray-300 w-full">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-100 h-full rounded-lg cursor-pointer">
          <User />
        </div>
        <div>
          <h1 className="font-bold text-[20px]">somethign</h1>
          <p className="text-gray-600 font-bold">something abotu</p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="px-4">
          {["somethign 1", "something 2", "something 3"].map((item) => (
            <div key={item}>
              {item}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}