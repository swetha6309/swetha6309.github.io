"use client";

import React from "react";

export function TopBar() {
    const [time, setTime] = React.useState<string>("");

    React.useEffect(() => {
        const tick = () => {
            const d = new Date();
            setTime(
                d.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800 bg-zinc-950/70 px-4 py-2 backdrop-blur-md">
            <div className="mx-auto flex w-full items-center justify-between text-sm text-zinc-200">
                <div className="flex items-center gap-4">
                    <span className="font-bold"></span>
                    <span className="font-medium">Swetha</span>
                    <span className="hidden text-zinc-400 sm:inline">File</span>
                    <span className="hidden text-zinc-400 sm:inline">Edit</span>
                    <span className="hidden text-zinc-400 sm:inline">View</span>
                    <span className="hidden text-zinc-400 sm:inline">Go</span>
                    <span className="hidden text-zinc-400 sm:inline">Window</span>
                    <span className="hidden text-zinc-400 sm:inline">Help</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 sm:flex">
                        {/* Battery/Wifi icons could go here */}
                        <span className="text-zinc-400">100%</span>
                    </div>
                    <div>{time}</div>
                </div>
            </div>
        </div>
    );
}
