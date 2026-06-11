import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import PageLink from "@/widgets/pagelink/ui";
import RenderCards from "@/widgets/renderitems/ui";
import { ChevronDown } from "lucide-react";

export default function WorkerPage() {
  return (
    <div className="custom-container space-y-5">
      <PageLink />
      <div className="border-2 border-gray-300 shadow-xl p-4 rounded-lg">
      
        <RenderCards />
      </div>
    </div>
  );
}