"use client";

import React from "react";

type DesktopIconProps = {
    label: string;
    icon: React.ReactNode;
    selected: boolean;
    onSelect: () => void;
    onOpen: () => void;
};

export function DesktopIcon({
    label,
    icon,
    selected,
    onSelect,
    onOpen,
}: DesktopIconProps) {
    return (
        <button
            onMouseDown={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                onOpen();
            }}
            className={`group flex w-24 flex-col items-center gap-1.5 rounded-lg p-2 text-left transition-colors sm:w-28 ${selected ? "bg-white/10" : "hover:bg-white/5"
                }`}
            type="button"
        >
            <div
                className={`grid h-14 w-14 place-items-center rounded-xl text-3xl shadow-sm transition-transform group-hover:scale-105 ${selected ? "bg-zinc-950/50" : "bg-transparent"
                    }`}
            >
                <span className="drop-shadow-lg filter flex items-center justify-center">{icon}</span>
            </div>
            <div
                className={`rounded px-1 text-center text-xs font-medium shadow-black/50 drop-shadow-md ${selected ? "bg-blue-600 text-white" : "text-white"
                    }`}
            >
                {label}
            </div>
        </button>
    );
}
