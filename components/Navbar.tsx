import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import Link from 'next/link';
import { SidebarData } from './NavbarData';
import styles from "./Navbar.module.css";
import { IconContext } from 'react-icons';

const Navbar = () => {
  const [sidebar, setSidebar] = useState(false)
  const showSidebar = () => setSidebar(!sidebar)
  return (
    <>
      <IconContext.Provider value={{ color: 'black' }}>
      <div className={styles.navbar}>
        <Link href="/">
          <FaIcons.FaBars onClick={showSidebar} />
        </Link>
        <nav className={sidebar ? styles.nav_menu_active : styles.nav_menu}>
          <ul className={styles.nav_menu_items}>
            <li className={styles.navbar_toggle}>
              <Link href="/">
                <AiIcons.AiOutlineClose onClick={showSidebar} />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  {item.icon}
                  <Link href={item.path}>
                    <span className={styles.navbar_item_label}>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;