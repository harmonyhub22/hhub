import React, { useContext, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import Link from 'next/link';
import { SidebarData } from './NavbarData';
import styles from "./Navbar.module.css";
import { IconContext } from 'react-icons';
import { MemberContext } from '../context/member';
import * as CgIcons from "react-icons/cg";

const Navbar = () => {
  const [sidebar, setSidebar] = useState(false)
  const showSidebar = () => setSidebar(!sidebar)

  const member = useContext(MemberContext);

  return (
    <>
      <IconContext.Provider value={{ color: "black" }}>
        <div className={styles.navbar}>
          <Link href="/" passHref>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <nav className={sidebar ? styles.nav_menu_active : styles.nav_menu}>
            <ul className={styles.nav_menu_items}>
              <li className={styles.navbar_toggle}>
                <Link href="/" passHref>
                  <AiIcons.AiOutlineClose onClick={showSidebar} />
                </Link>
              </li>
              {SidebarData.map((item, index) => {
                return (
                  <li key={index} className={item.cName}>
                    {item.icon}
                    <Link href={item.path} passHref>
                      <span className={styles.navbar_item_label}>
                        {item.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
              {(member?.memberId ?? undefined) === undefined ? (
                <li key={SidebarData.length} className={SidebarData[0].cName}>
                  <CgIcons.CgLogIn />
                  <Link href={"/login"} passHref>
                    <span className={styles.navbar_item_label}>
                      {"Login"}
                    </span>
                  </Link>
                </li>
              ) : (
                <li key={SidebarData.length} className={SidebarData[0].cName}>
                  <CgIcons.CgLogOut />
                  <Link href={"/logout"} passHref>
                    <span className={styles.navbar_item_label}>
                      {"Logout"}
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;