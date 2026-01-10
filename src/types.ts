export type WindowKey = "about" | "work" | "skills" | "contact";
export type DesktopItemKey = WindowKey | "resume" | "github" | "linkedin";

export type WindowState = {
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    z: number;
    x: number; // px
    y: number; // px
    width: number;
    height: number;
};
