"use client";

import { usePathname } from "next/navigation";

export default function PageLink() {
    const path = usePathname();

    const pageName = path.split("/")[3];

    const renderPageName = () => {
        switch(pageName) {
            case "worker":
                return "Ишчилар";
            case "team":
                return "Жамоа";
            default: 
                return "Ҳаммаси"
        }
    }
    return (
            <h1 className="text-3xl">{renderPageName()}</h1>
    );
};