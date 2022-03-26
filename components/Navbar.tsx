import { useContext, useState } from "react";
import Link from "next/link";
import { IconContext } from "react-icons";
import { MemberContext } from "../context/member";

import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md";
import * as CgIcons from "react-icons/cg";
import * as GiIcons from "react-icons/gi";

const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome color="white" />,
    cName: "nav_text",
  },
  {
    title: "Discover",
    path: "/discover",
    icon: <IoIcons.IoMdGlobe color="white" />,
    cName: "nav_text",
  },
  {
    title: "Library",
    path: "/library",
    icon: <MdIcons.MdLibraryMusic color="white" />,
    cName: "nav_text",
  },
  {
    title: "Learn",
    path: "/learn",
    icon: <GiIcons.GiMusicalScore color="white" />,
    cName: "nav_text",
  },
  {
    title: "Tutorial",
    path: "/tutorial",
    icon: <IoIcons.IoMdHelpCircleOutline color="white" />,
    cName: "nav_text",
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <CgIcons.CgProfile color="white" />,
    cName: "nav_text",
  },
];

const Navbar = () => {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);

  const member = useContext(MemberContext);

  return (
    <>
      <IconContext.Provider value={{ color: "black" }}>
        <div className="navbar">
          <div className="menu_bars">
            <Link href="/" passHref>
              <FaIcons.FaBars onClick={showSidebar} />
            </Link>
          </div>
          <div className="menu_items">
            <nav className={sidebar ? "nav_menu_active" : "nav_menu"}>
              <ul className="nav_menu_items">
                <li className="navbar_toggle">
                  <Link href="/" passHref>
                    <AiIcons.AiOutlineClose onClick={showSidebar} />
                  </Link>
                </li>
                {SidebarData.map((item, index) => {
                  return (
                    <li key={index} className={item.cName}>
                      {item.icon}
                      <Link href={item.path} passHref>
                        <span className="navbar_item_label">{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
                {(member?.memberId ?? undefined) === undefined ? (
                  <li key={SidebarData.length} className={SidebarData[0].cName}>
                    <CgIcons.CgLogIn color="white" />
                    <Link href={"/login"} passHref>
                      <span className="navbar_item_label">{"Login"}</span>
                    </Link>
                  </li>
                ) : (
                  <li key={SidebarData.length} className={SidebarData[0].cName}>
                    <CgIcons.CgLogOut color="white" />
                    <Link href={"/logout"} passHref>
                      <span className="navbar_item_label">{"Logout"}</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </IconContext.Provider>
    </>
  );
};

export default Navbar;
