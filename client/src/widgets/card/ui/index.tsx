"use client";

import { Building, ChartNoAxesCombined } from "lucide-react";

export default function Card() {
  return (
    <div className="border border-gray-500 rounded-lg shadow-lg">
        <div className="flex items-start justify-between border-b border-gray-500 shadow-lg rounded-b-lg p-4 gap-5">
            <div className="p-2 bg-blue-400 rounded-full text-white">
                <Building />
            </div>
            <div className="flex flex-col items-start gap-3">
                <p>Something daaa</p>
                <h1>$20.4400.444</h1>
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