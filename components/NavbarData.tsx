import React from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md";
import * as CgIcons from "react-icons/cg";
import * as GiIcons from "react-icons/gi";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav_text",
  },
  {
    title: "Discover",
    path: "/discover",
    icon: <IoIcons.IoMdGlobe />,
    cName: "nav_text",
  },
  {
    title: "Library",
    path: "/library",
    icon: <MdIcons.MdLibraryMusic />,
    cName: "nav_text",
  },
  {
    title: "Learn",
    path: "/learn",
    icon: <GiIcons.GiMusicalScore />,
    cName: "nav_text",
  },
  {
    title: "Tutorial",
    path: "/tutorial",
    icon: <IoIcons.IoMdHelpCircleOutline />,
    cName: "nav_text",
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <CgIcons.CgProfile />,
    cName: "nav_text",
  },
];