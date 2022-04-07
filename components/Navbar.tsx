import { useContext, useState } from "react";
import Link from "next/link";
import { MemberContext } from "../context/member";
import { Link as GeistLink } from "@geist-ui/core";

import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md";
import * as CgIcons from "react-icons/cg";
import * as GiIcons from "react-icons/gi";
import { Button, Drawer } from "@geist-ui/core";

const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome color="white" />,
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
  const member = useContext(MemberContext);

  return (
    <>
      <Button
        auto
        onClick={() => setSidebar(true)}
        scale={1}
        style={{ borderRadius: "0px 0px 6px 0px", position: "absolute" }}
        className="navbar"
      >
        <FaIcons.FaBars />
      </Button>
      <Drawer
        visible={sidebar}
        onClose={() => setSidebar(false)}
        placement="left"
        style={{ background: "linear-gradient(#733d97, #512957, #831b77)" }}
      >
        <Drawer.Title style={{ color: "white" }}>Harmony Hub</Drawer.Title>
        <Drawer.Subtitle style={{ color: "#f0f0f0" }}>
          Navigation
        </Drawer.Subtitle>
        <Drawer.Content style={{ height: "100%" }}>
          <ul style={{ margin: "none" }}>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link href={item.path} passHref>
                    <GeistLink
                      block
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <div>{item.icon}</div>
                      <div
                        style={{
                          width: "100%",
                          textAlign: "center",
                          color: "white",
                        }}
                      >
                        <span>{item.title}</span>
                      </div>
                    </GeistLink>
                  </Link>
                </li>
              );
            })}
            {(member?.memberId ?? undefined) === undefined ? (
              <li key={SidebarData.length} className={SidebarData[0].cName}>
                <Link href={"/login"} passHref>
                  <GeistLink
                    block
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <div>
                      <CgIcons.CgLogIn color="white" />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      <span>Login</span>
                    </div>
                  </GeistLink>
                </Link>
              </li>
            ) : (
              <li key={SidebarData.length} className={SidebarData[0].cName}>
                <Link href={"/logout"} passHref>
                  <GeistLink
                    block
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <div>
                      <CgIcons.CgLogOut color="white" />
                    </div>
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      <span>Logout</span>
                    </div>
                  </GeistLink>
                </Link>
              </li>
            )}
          </ul>
        </Drawer.Content>
      </Drawer>
    </>
  );
};

export default Navbar;
