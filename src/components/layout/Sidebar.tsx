"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { motion } from "framer-motion";
import {
  BarChart3,
  User,
  ArrowLeft,
  FolderUp,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { logoutUser } from "@/api/auth";
import { useUserContext } from "@/context/user";

// Utility function
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export function SidebarMain() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useUserContext();
  const [links, setLinks] = useState([
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: (
        <LayoutDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      to: "/profile",
      icon: (
        <User className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Data Uploader",
      to: "/data-uploader",
      icon: (
        <FolderUp className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      onClick: () => {
        logoutUser();
        logout();
        navigate("/login");
      },
      icon: (
        <LogOut className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ]);

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "mx-auto flex w-full  flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-full" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <>
              <Logo />
            </>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((linkItem, idx) => (
                <SidebarLink key={idx} linkItem={linkItem} className="" />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              linkItem={{
                label: "Adinath Yadav",
                to: "/",
                icon: (
                  <User className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                ),
              }}
              className=""
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {/* pass setlinks to children */}
      <div className="flex-1 overflow-hidden">
        <Outlet context={{ setLinks, links }} />
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-xl gap-1 font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm  dark:bg-white">
        <img src="./android-chrome-192x192.png" alt="logo" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white uppercase"
      >
        Data visualizer
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};
