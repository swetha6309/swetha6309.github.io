"use client";

import React from "react";
import { WindowKey, DesktopItemKey, WindowState } from "@/types";
import { TopBar } from "@/components/TopBar";
import { DesktopIcon } from "@/components/DesktopIcon";
import { Window } from "@/components/Window";
import { Dock } from "@/components/Dock";
import { Chip, SmallButton } from "@/components/ui";
import { GithubIcon, LinkedinIcon, MailIcon, LocationIcon, EducationIcon } from "@/components/Icons";
import { ExperienceCard } from "@/components/ExperienceCard";

const LINKS = {
  github: "https://github.com/swetha6309",
  linkedin: "https://www.linkedin.com/in/swetha-narra/",
  resume: "/resume.pdf",
};

const DEFAULT_WINDOWS: Record<WindowKey, WindowState> = {
  about: { isOpen: true, isMinimized: false, isMaximized: false, z: 10, x: 100, y: 80, width: 800, height: 600 },
  work: { isOpen: false, isMinimized: false, isMaximized: false, z: 10, x: 150, y: 120, width: 800, height: 600 },
  skills: { isOpen: false, isMinimized: false, isMaximized: false, z: 10, x: 200, y: 160, width: 600, height: 400 },
  contact: { isOpen: false, isMinimized: false, isMaximized: false, z: 10, x: 250, y: 200, width: 600, height: 400 },
};

export default function Page() {
  const [windows, setWindows] = React.useState<Record<WindowKey, WindowState>>(DEFAULT_WINDOWS);
  const [zTop, setZTop] = React.useState(20);
  const [selected, setSelected] = React.useState<DesktopItemKey | null>(null);

  // Responsive init
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) {
      // Mobile adjustments
      setWindows(prev => {
        const next = { ...prev };
        (Object.keys(next) as WindowKey[]).forEach(k => {
          next[k] = {
            ...next[k],
            x: 16,
            y: 60,
            width: window.innerWidth - 32,
            height: window.innerHeight - 200 // Leave room for dock and top bar
          };
        });
        return next;
      });
    }
  }, []);

  // Drag state
  const dragRef = React.useRef<{
    key: WindowKey | null;
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
  }>({ key: null, startMouseX: 0, startMouseY: 0, startX: 0, startY: 0 });

  const resizeRef = React.useRef<{
    key: WindowKey | null;
    startMouseX: number;
    startMouseY: number;
    startWidth: number;
    startHeight: number;
  }>({ key: null, startMouseX: 0, startMouseY: 0, startWidth: 0, startHeight: 0 });

  /* ---------------- Window Logic ---------------- */
  const bringToFront = (key: WindowKey) => {
    const nextZ = zTop + 1;
    setZTop(nextZ);
    setWindows((p) => ({ ...p, [key]: { ...p[key], z: nextZ } }));
  };

  const openWindow = (key: WindowKey) => {
    setWindows((p) => ({
      ...p,
      [key]: { ...p[key], isOpen: true, isMinimized: false },
    }));
    bringToFront(key);
  };

  const toggleWindow = (key: WindowKey) => {
    const w = windows[key];
    if (w.isOpen && !w.isMinimized) {
      if (w.z === zTop) {
        // If already focused, minimize
        minimizeWindow(key);
      } else {
        // Just focus
        bringToFront(key);
      }
    } else if (w.isMinimized) {
      // Restore
      restoreWindow(key);
    } else {
      // Open
      openWindow(key);
    }
  };

  const closeWindow = (key: WindowKey) =>
    setWindows((p) => ({
      ...p,
      [key]: { ...p[key], isOpen: false, isMinimized: false, isMaximized: false },
    }));

  const minimizeWindow = (key: WindowKey) =>
    setWindows((p) => ({
      ...p,
      [key]: { ...p[key], isMinimized: true, isMaximized: false },
    }));

  const restoreWindow = (key: WindowKey) => {
    setWindows((p) => ({
      ...p,
      [key]: { ...p[key], isOpen: true, isMinimized: false },
    }));
    bringToFront(key);
  };

  const toggleMaximize = (key: WindowKey) =>
    setWindows((p) => ({
      ...p,
      [key]: { ...p[key], isMaximized: !p[key].isMaximized, isMinimized: false },
    }));

  const onOpenItem = (key: DesktopItemKey) => {
    if (key === "resume") window.open(LINKS.resume, "_self");
    if (key === "github") window.open(LINKS.github, "_blank", "noopener,noreferrer");
    if (key === "linkedin") window.open(LINKS.linkedin, "_blank", "noopener,noreferrer");
    if (key === "about" || key === "work" || key === "skills" || key === "contact") openWindow(key);
  };

  /* ---------------- Dragging Logic ---------------- */
  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Handle Dragging
      if (dragRef.current.key) {
        const k = dragRef.current.key;
        setWindows((p) => {
          const w = p[k];
          if (!w || w.isMaximized) return p;

          const dx = e.clientX - dragRef.current.startMouseX;
          const dy = e.clientY - dragRef.current.startMouseY;

          const nextX = clamp(dragRef.current.startX + dx, -400, window.innerWidth - 50);
          const nextY = clamp(dragRef.current.startY + dy, 24, window.innerHeight - 50);

          return { ...p, [k]: { ...w, x: nextX, y: nextY } };
        });
      }

      // Handle Resizing
      if (resizeRef.current.key) {
        const k = resizeRef.current.key;
        setWindows((p) => {
          const w = p[k];
          if (!w || w.isMaximized) return p;

          const dx = e.clientX - resizeRef.current.startMouseX;
          const dy = e.clientY - resizeRef.current.startMouseY;

          const nextWidth = Math.max(300, resizeRef.current.startWidth + dx);
          const nextHeight = Math.max(200, resizeRef.current.startHeight + dy);

          return { ...p, [k]: { ...w, width: nextWidth, height: nextHeight } };
        });
      }
    };

    const onUp = () => {
      dragRef.current.key = null;
      resizeRef.current.key = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const startDrag = (key: WindowKey, e: React.MouseEvent) => {
    if (e.button !== 0) return;
    bringToFront(key);
    setWindows((p) => {
      const w = p[key];
      if (!w || w.isMaximized) return p;
      dragRef.current = {
        key,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startX: w.x,
        startY: w.y,
      };
      return p;
    });
  };

  const startResize = (key: WindowKey, e: React.MouseEvent) => {
    if (e.button !== 0) return;
    bringToFront(key);

    setWindows((p) => {
      const w = p[key];
      if (!w || w.isMaximized) return p;
      resizeRef.current = {
        key,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startWidth: w.width,
        startHeight: w.height,
      };
      return p;
    });
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-center bg-cover"
      style={{
        backgroundImage: "url(https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2940&auto=format&fit=crop)", // Darker mountain landscape
      }}
      onMouseDown={() => setSelected(null)}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/10" />

      <TopBar />

      {/* Desktop Icons */}
      <div className="relative z-0 flex flex-col flex-wrap content-start items-start gap-2 p-4 pt-16 sm:h-[80vh] sm:flex-col sm:gap-6">
        <DesktopIcon
          label="About Me"
          icon="🧑‍💻"
          selected={selected === "about"}
          onSelect={() => setSelected("about")}
          onOpen={() => onOpenItem("about")}
        />
        <DesktopIcon
          label="Work"
          icon="💼"
          selected={selected === "work"}
          onSelect={() => setSelected("work")}
          onOpen={() => onOpenItem("work")}
        />
        <DesktopIcon
          label="Skills"
          icon="🛠️"
          selected={selected === "skills"}
          onSelect={() => setSelected("skills")}
          onOpen={() => onOpenItem("skills")}
        />
        <DesktopIcon
          label="Contact"
          icon="✉️"
          selected={selected === "contact"}
          onSelect={() => setSelected("contact")}
          onOpen={() => onOpenItem("contact")}
        />
        <div className="h-4 w-full sm:h-full sm:w-4" /> {/* Spacer */}
        <DesktopIcon
          label="Resume"
          icon="📄"
          selected={selected === "resume"}
          onSelect={() => setSelected("resume")}
          onOpen={() => onOpenItem("resume")}
        />
        <DesktopIcon
          label="GitHub"
          icon={<GithubIcon className="h-8 w-8 text-white" />}
          selected={selected === "github"}
          onSelect={() => setSelected("github")}
          onOpen={() => onOpenItem("github")}
        />
        <DesktopIcon
          label="LinkedIn"
          icon={<LinkedinIcon className="h-8 w-8 text-blue-400 bg-white rounded-xs" />}
          selected={selected === "linkedin"}
          onSelect={() => setSelected("linkedin")}
          onOpen={() => onOpenItem("linkedin")}
        />
      </div>

      {/* Windows */}
      <Window
        title="About Me"
        state={windows.about}
        onFocus={() => bringToFront("about")}
        onClose={() => closeWindow("about")}
        onMinimize={() => minimizeWindow("about")}
        onMaximize={() => toggleMaximize("about")}
        onStartDrag={(e) => startDrag("about", e)}
        onStartResize={(e) => startResize("about", e)}
      >
        <div className="space-y-8">
          <div className="flex flex-col gap-6 sm:flex-row items-center sm:items-start text-center sm:text-left">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-zinc-700 bg-zinc-800 shadow-xl">
              <div className="flex h-full w-full items-center justify-center text-4xl bg-zinc-800">👩‍💻</div>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white tracking-tight">Hi, I’m Swetha 👋</h1>
              <div className="space-y-4 text-zinc-300 leading-relaxed text-sm sm:text-base">
                <p>
                  I’m a computer science enthusiast who genuinely enjoys spending most of my time on a computer — exploring how systems work, breaking things (occasionally), and putting them back together in better ways.
                </p>
                <p>
                  Professionally, I work primarily in the <strong>.NET + Azure ecosystem</strong>, modernizing legacy applications, designing microservices, and building event-driven workflows with Azure Functions. I enjoy simplifying complex systems, improving performance in measurable ways, and making software easier to deploy, scale, and maintain.
                </p>
                <p>
                  I care deeply about how software is built, not just that it works — clean boundaries, thoughtful architecture, and releases that don’t break production. Outside of work, I enjoy learning how systems behave at scale, experimenting with UI ideas, and continuously refining my craft as an engineer.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-zinc-800/40 p-4 backdrop-blur-sm border border-zinc-700/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <LocationIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-zinc-400">Location</div>
                <div className="font-medium text-zinc-200">Columbus, OH</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-zinc-800/40 p-4 backdrop-blur-sm border border-zinc-700/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <div className="text-xl">🎨</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">Hobbies</div>
                <div className="font-medium text-zinc-200">Painting, Travelling, Solving Puzzles</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <EducationIcon className="h-5 w-5 text-yellow-400" />
              Education
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 rounded-xl bg-zinc-800/20 p-4 border border-zinc-700/30">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-white p-0.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/uf_logo.png" alt="UF" className="h-full w-full object-contain" />
                  </div>
                  <div className="font-semibold text-zinc-200">University of Florida</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-200">Master of Science - MS</div>
                  <div className="text-xs text-zinc-300">Computer and Information Sciences</div>
                  <div className="text-xs text-zinc-400 pt-1"> Aug 2022 - May 2024</div>
                </div>
              </div>

              <div className="flex flex-col gap-2 rounded-xl bg-zinc-800/20 p-4 border border-zinc-700/30">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-white p-0.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/klu_logo.png" alt="KLU" className="h-full w-full object-contain" />
                  </div>
                  <div className="font-semibold text-zinc-200">KL University</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-200">Bachelor of Technology - BTech</div>
                  <div className="text-xs text-zinc-300">Computer Science</div>
                  <div className="text-xs text-zinc-400 pt-1"> Jun 2017 - May 2021</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Window>

      <Window
        title="Work Experience"
        state={windows.work}
        onFocus={() => bringToFront("work")}
        onClose={() => closeWindow("work")}
        onMinimize={() => minimizeWindow("work")}
        onMaximize={() => toggleMaximize("work")}
        onStartDrag={(e) => startDrag("work", e)}
        onStartResize={(e) => startResize("work", e)}
      >
        <div className="space-y-3">
          <ExperienceCard
            role="Full Stack Software Engineer"
            company="Ohio Department of Health"
            date="Jun 2024 – Present"
            location="Columbus, Ohio"
            logo="/odh_logo.png"
            description="Working on mission-critical public health systems, owning features end-to-end across frontend, backend, data, and deployment."
            points={[
              "Leading the modernization of a large .NET monolith into 25+ microservices, owning the full stack from Blazor UI to APIs and data layers",
              "Re-architected data access using Cosmos DB + SQL Server, doubling effective read/write throughput for high-volume services",
              "Improved front-end load times by ~1.5 seconds using Blazor optimizations, with usability testing showing increased stakeholder engagement",
              "Reduced database query latency from ~800ms to 300ms through SQL connection pooling and targeted query tuning",
              "Designed and implemented Azure DevOps CI/CD pipelines, enabling 150+ production releases per year across 6 environments",
              "Built and operated 20+ Azure Functions for real-time ingestion and scheduled workflows, significantly reducing infrastructure load",
              "Automated multi-environment SQL deployments using JAMS Scheduler, reducing manual errors across critical data workflows"
            ]}
          />

          <ExperienceCard
            role="Research Assistant"
            company="University of Florida"
            date="May 2023 – May 2024"
            location="Gainesville, Florida"
            logo="/uf_logo.png"
            description="Built and operated a production-grade Learning Management System, focusing on scalability, security, and real-time communication."
            points={[
              "Launched a full-featured LMS for 500+ active users, deployd on AWS Lambda, S3, and RDS with high availability",
              "Designed and implemented a Spring Boot authentication service with SSO, using OAuth 2.0 / JWT and role-based authorization",
              "Implemented real-time notifications using Apache Kafka, processing 1,000+ events per day across services",
              "Engineered multi-threaded backend components to handle hundreds of concurrent requests, reducing wait times under load",
              "Improved system reliability by adding 300+ unit and integration tests using JUnit and Mockito"
            ]}
          />

          <ExperienceCard
            role="Software Engineer"
            company="Optum (UnitedHealth Group)"
            date="May 2021 – Jun 2022"
            location="Hyderabad, India"
            logo="/optum_logo.png"
            description="Worked on large-scale healthcare enterprise applications, focusing on modernization, performance, and developer productivity."
            points={[
              "Migrated legacy VB.NET applications to ASP.NET Core 3.1 (C#), improving performance, maintainability, and deployment stability",
              "Refactored large JavaScript codebases into React components, preserving functionality across 100+ features",
              "Built a side-by-side Paper Claims comparison module that saved 40+ hours per week of manual validation for business users",
              "Optimized real-time socket-based communication, reducing response times by ~45% at peak load",
              "Authored SQL stored procedures supporting 650+ ICD-10 disease codes, streamlining complex multi-table updates",
              "Stabilized releases by resolving 12+ critical vulnerabilities and implementing Jenkins CI/CD pipelines"
            ]}
          />
        </div>
      </Window>

      <Window
        title="Skills"
        state={windows.skills}
        onFocus={() => bringToFront("skills")}
        onClose={() => closeWindow("skills")}
        onMinimize={() => minimizeWindow("skills")}
        onMaximize={() => toggleMaximize("skills")}
        onStartDrag={(e) => startDrag("skills", e)}
        onStartResize={(e) => startResize("skills", e)}
      >
        <div className="space-y-8">
          {/* Core Engineering Stack */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="text-2xl">🧠</span> Core Engineering Stack
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-zinc-400">Backend & APIs</h4>
                <div className="flex flex-wrap gap-2">
                  {["C#", "ASP.NET Core", "Spring Boot", "Node.js", "REST APIs", "OAuth 2.0", "JWT"].map(s => <Chip key={s}>{s}</Chip>)}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-zinc-400">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  {["Blazor", "React", "HTML", "CSS", "Bootstrap"].map(s => <Chip key={s}>{s}</Chip>)}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-zinc-400">Cloud & Serverless</h4>
                <div className="flex flex-wrap gap-2">
                  {["Azure Functions", "Azure DevOps", "Service Bus", "Logic Apps", "AWS Lambda", "S3", "RDS"].map(s => <Chip key={s}>{s}</Chip>)}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-zinc-400">Data & Messaging</h4>
                <div className="flex flex-wrap gap-2">
                  {["SQL Server", "Cosmos DB", "PostgreSQL", "Apache Kafka"].map(s => <Chip key={s}>{s}</Chip>)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* DevOps & Reliability */}
            <div className="space-y-3 rounded-xl bg-zinc-800/20 p-4 border border-zinc-700/30">
              <h3 className="flex items-center gap-2 font-bold text-white">
                <span className="text-xl">⚙️</span> DevOps & Reliability
              </h3>
              <p className="text-xs text-zinc-400 italic">Focused on shipping safely and operating systems in production.</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["Azure DevOps CI/CD", "Jenkins"].map(s => <Chip key={s}>{s}</Chip>)}
              </div>
              <ul className="list-disc ml-4 space-y-1 text-xs text-zinc-300">
                <li>Multi-environment deployments (Dev / QA / Prod)</li>
                <li>One-click rollbacks, automated SQL deployments</li>
                <li>Monitoring, performance tuning, and production debugging</li>
              </ul>
            </div>

            {/* Testing & Quality */}
            <div className="space-y-3 rounded-xl bg-zinc-800/20 p-4 border border-zinc-700/30">
              <h3 className="flex items-center gap-2 font-bold text-white">
                <span className="text-xl">🧪</span> Testing & Quality
              </h3>
              <p className="text-xs text-zinc-400 italic">Making sure systems behave correctly under change.</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["NUnit", "JUnit", "Mockito", "Postman", "Selenium"].map(s => <Chip key={s}>{s}</Chip>)}
              </div>
              <ul className="list-disc ml-4 space-y-1 text-xs text-zinc-300">
                <li>Writing testable, maintainable code</li>
              </ul>
            </div>
          </div>

          {/* Also Worked With */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 font-bold text-white">
              <span className="text-xl">📚</span> Also Worked With
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Python", "Java", "TypeScript", "DynamoDB", "MySQL", "Linux", "GitHub", "VS Code"].map(s => <Chip key={s}>{s}</Chip>)}
            </div>
          </div>
        </div>
      </Window>

      <Window
        title="Contact"
        state={windows.contact}
        onFocus={() => bringToFront("contact")}
        onClose={() => closeWindow("contact")}
        onMinimize={() => minimizeWindow("contact")}
        onMaximize={() => toggleMaximize("contact")}
        onStartDrag={(e) => startDrag("contact", e)}
        onStartResize={(e) => startResize("contact", e)}
      >
        <div className="flex flex-col items-center justify-center gap-6 py-8">
          <div className="text-center">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-xl font-bold text-white">Get in Touch</h2>
            <p className="text-zinc-400">I'm always open to discussing new projects and opportunities.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <SmallButton href={`mailto:swethanarra18@gmail.com`}>Email Me</SmallButton>
            <SmallButton href={LINKS.linkedin} external>
              LinkedIn
            </SmallButton>
            <SmallButton href={LINKS.github} external>
              GitHub
            </SmallButton>
          </div>

          <div className="mt-4 rounded-lg bg-zinc-800/50 px-4 py-2 font-mono text-sm text-zinc-300 select-all border border-zinc-700/50">
            swethanarra18@gmail.com
          </div>
        </div>
      </Window>

      {/* Dock */}
      <Dock
        items={[
          { key: "about", label: "About", icon: "🧑‍💻", isOpen: windows.about.isOpen },
          { key: "work", label: "Work", icon: "💼", isOpen: windows.work.isOpen },
          { key: "skills", label: "Skills", icon: "🛠️", isOpen: windows.skills.isOpen },
          { key: "contact", label: "Contact", icon: "✉️", isOpen: windows.contact.isOpen },
        ]}
        onAppClick={toggleWindow}
      />
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
