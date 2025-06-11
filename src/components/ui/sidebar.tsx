"use client";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { link } from "fs";

// Utility function
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  const { open, animate } = useSidebar();

  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
      {/* Spacer div to push content to the right on desktop */}
      <div
        className="hidden md:block shrink-0 transition-all duration-300 ease-in-out"
        style={{
          width: animate ? (open ? 300 : 60) : 300,
        }}
      />
    </>
  );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-screen px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 shrink-0 fixed left-0 top-0 z-40 border-r border-neutral-200 dark:border-neutral-700",
          className
        )}
        animate={{
          width: animate ? (open ? 300 : 60) : 300,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        onMouseEnter={() => animate && setOpen(true)}
        onMouseLeave={() => animate && setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-neutral-800 dark:text-neutral-200 cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
            onClick={() => setOpen(!open)}
            size={24}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                onClick={() => setOpen(!open)}
              >
                <X size={24} />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({ linkItem, className, ...props }) => {
  const { open, animate } = useSidebar();
  const location = useLocation();
  const isActive = linkItem.to && location.pathname === linkItem.to;
  return (
    <>
      {linkItem.to && (
        <Link
          to={linkItem.to}
          className={cn(
            "flex items-center justify-start gap-2 group/sidebar py-2 px-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-200 cursor-pointer relative",
            className
          )}
          {...props}
        >
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded bg-[#3b82f6]" />
          )}
          <div className="flex-shrink-0">{linkItem.icon}</div>
          <motion.span
            animate={{
              display: animate
                ? open
                  ? "inline-block"
                  : "none"
                : "inline-block",
              opacity: animate ? (open ? 1 : 0) : 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
          >
            {linkItem.label}
          </motion.span>
        </Link>
      )}
      {linkItem.onClick && (
        <button
          onClick={linkItem.onClick}
          className="flex items-center space-x-2 p-2 gap-2 rounded-md text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <div className="flex-shrink-0">{linkItem.icon}</div>
          <motion.span
            animate={{
              display: animate
                ? open
                  ? "inline-block"
                  : "none"
                : "inline-block",
              opacity: animate ? (open ? 1 : 0) : 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
          >
            {linkItem.label}
          </motion.span>
        </button>
      )}
    </>
  );
};
