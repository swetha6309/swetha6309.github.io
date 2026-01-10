"use client";

import React from "react";
import { WindowState } from "../types";
import { motion, AnimatePresence } from "framer-motion";

type WindowProps = {
    title: string;
    children: React.ReactNode;
    state: WindowState;
    onClose: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
    onFocus: () => void;
    onStartDrag: (e: React.MouseEvent) => void;
    onStartResize: (e: React.MouseEvent) => void;
};

export function Window({
    title,
    children,
    state,
    onClose,
    onMinimize,
    onMaximize,
    onFocus,
    onStartDrag,
    onStartResize,
}: WindowProps) {
    // We use Framer Motion for the entry/exit animations, 
    // but for dragging we stick to the parent's controlled state for now 
    // to coordinate with the global z-index management.
    // Ideally, we could use drag controls from framer-motion too, but let's keep the existing drag logic for stability first.

    if (!state.isOpen || state.isMinimized) return null;

    const widthClass = "w-[90vw] md:w-[700px]";

    const style: React.CSSProperties = state.isMaximized
        ? {
            zIndex: state.z,
            position: "fixed",
            top: 40, // Below top bar
            left: 0,
            right: 0,
            bottom: 80, // Above dock
            width: "auto",
            height: "auto",
            transform: "none"
        }
        : {
            zIndex: state.z,
            position: "fixed",
            left: state.x,
            top: state.y,
            width: state.width,
            height: state.height,
            display: "flex",
            flexDirection: "column",
        };

    return (
        <div
            className={state.isMaximized ? "" : widthClass}
            style={style}
            onMouseDown={(e) => {
                e.stopPropagation();
                onFocus();
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-900/90 shadow-2xl backdrop-blur-xl"
            >
                {/* Title bar (drag handle) */}
                <div
                    className={`flex h-10 shrink-0 select-none items-center justify-between border-b border-zinc-800 px-4 ${state.isMaximized ? "" : "cursor-grab active:cursor-grabbing"
                        }`}
                    onMouseDown={(e) => {
                        if (state.isMaximized) return;
                        onStartDrag(e);
                    }}
                    onDoubleClick={onMaximize}
                >
                    <div className="flex items-center gap-2">
                        <WindowControl color="bg-red-500" onClick={onClose} icon="✕" />
                        <WindowControl color="bg-yellow-500" onClick={onMinimize} icon="−" />
                        <WindowControl color="bg-green-500" onClick={onMaximize} icon="+" />
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-zinc-300">
                        {title}
                    </div>
                    <div className="w-16" /> {/* Spacer for centering */}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 text-zinc-200">
                    {children}
                </div>
                {/* Resize Handle */}
                {!state.isMaximized && (
                    <div
                        className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize z-50"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            onStartResize(e);
                        }}
                    >
                        {/* Visual indicator (corner lines) */}
                        <div className="absolute bottom-1 right-1 h-2 w-2 border-b-2 border-r-2 border-zinc-500/50" />
                    </div>
                )}
            </motion.div>
        </div>
    );
}

function WindowControl({
    color,
    onClick,
    icon,
}: {
    color: string;
    onClick: (e: React.MouseEvent) => void;
    icon: string;
}) {
    return (
        <button
            onClick={onClick}
            onMouseDown={(e) => e.stopPropagation()}
            className={`group flex h-3 w-3 items-center justify-center rounded-full ${color} text-[8px] text-black/0 hover:text-black/60 focus:outline-none`}
        >
            <span className="opacity-0 group-hover:opacity-100">{icon}</span>
        </button>
    );
}
