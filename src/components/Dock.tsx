"use client";

import React from "react";
import { WindowKey } from "../types";
import { motion, MotionValue, useMotionValue, useSpring, useTransform } from "framer-motion";

type DockItem = {
    key: WindowKey;
    label: string;
    icon: React.ReactNode;
    isOpen: boolean;
};

type DockProps = {
    items: DockItem[];
    onAppClick: (key: WindowKey) => void;
};

export function Dock({ items, onAppClick }: DockProps) {
    const mouseX = useMotionValue<number | null>(null);

    return (
        <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center">
            <div
                className="flex h-16 items-end gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 pb-2 backdrop-blur-md"
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(null)}
            >
                {items.map((item) => (
                    <DockIcon
                        key={item.key}
                        item={item}
                        mouseX={mouseX}
                        onClick={() => onAppClick(item.key)}
                    />
                ))}
            </div>
        </div>
    );
}

function DockIcon({
    item,
    mouseX,
    onClick,
}: {
    item: DockItem;
    mouseX: MotionValue<number | null>;
    onClick: () => void;
}) {
    const ref = React.useRef<HTMLButtonElement>(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val !== null ? val - bounds.x - bounds.width / 2 : Infinity;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <div className="group relative flex flex-col items-center gap-1">
            {/* Tooltip */}
            <div className="absolute -top-12 hidden rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-200 shadow group-hover:block">
                {item.label}
            </div>

            <motion.button
                ref={ref}
                onClick={onClick}
                style={{ width, height: width }}
                className="relative flex aspect-square items-center justify-center rounded-xl bg-zinc-800 shadow-xl transition-colors hover:bg-zinc-700"
            >
                <span className="flex h-full w-full items-center justify-center text-3xl">
                    {item.icon}
                </span>

                {/* Open Indicator */}
                {item.isOpen && (
                    <div className="absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
                )}
            </motion.button>
        </div>
    );
}
