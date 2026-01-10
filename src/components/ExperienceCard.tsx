"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type ExperienceCardProps = {
    role: string;
    company: string;
    date: string;
    location: string;
    description: string;
    points: string[];
    logo: string;
};

export function ExperienceCard({
    role,
    company,
    date,
    location,
    description,
    points,
    logo,
}: ExperienceCardProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-800/30 transition-colors hover:bg-zinc-800/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-start gap-4 p-4 text-left transition-colors"
            >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt={company} className="h-full w-full object-contain" />
                </div>

                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-semibold text-zinc-100">{role}</h3>
                        <span className="text-xs text-zinc-400 font-mono mt-1 sm:mt-0">{date}</span>
                    </div>
                    <div className="text-sm text-zinc-300">{company}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                        <span>📍</span>
                        <span>{location}</span>
                    </div>
                </div>

                <div className={`mt-2 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    ▼
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="border-t border-zinc-700/50 px-4 pb-4 pt-2">
                            <p className="mb-3 text-sm italic text-zinc-400">{description}</p>
                            <ul className="ml-4 list-disc space-y-2 text-sm text-zinc-300">
                                {points.map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
