import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";


export default function MonthlyFilters() {
  return (
  <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-bold">Ishchilar ro'yhati</h1>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 font-bold px-4 py-1 border-gray-300 rounded-lg border">
              Oylik <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4">
              hello motehr fucker
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
  );
}