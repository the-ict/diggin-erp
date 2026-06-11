"use client";

import { robotoText } from "@/shared/config/fonts";
import { cn } from "@/shared/lib/utils";
import { Building, ChartNoAxesCombined } from "lucide-react";

export default function Card() {
  return (
    <div className={cn("border-2 border-gray-300 rounded-lg shadow-xl", robotoText.variable)}>
        <div className="flex items-start justify-between border-b-2 border-gray-300 shadow-lg rounded-b-lg p-4 gap-5">
            <div className="p-2 bg-blue-400 rounded-full text-white">
                <Building />
            </div>
            <div className="flex flex-col items-start gap-3">
                <p>Something daaa</p>
                <h1 className="text-2xl font-bold">$20.4400.444</h1>
            </div>
        </div>
        <div className="flex items-center gap-2 p-4">
            <ChartNoAxesCombined />
            <span>2.5%</span>
           <p>via the last month</p> 
        </div>
    </div>
  );
}