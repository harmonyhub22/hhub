import { Button, Input, Spacer, Text, Page } from "@geist-ui/core";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { login, logout } from "../api/Helper";
import { titleSlider } from "../components/animations/Animation";
import { Galaxy } from "../components/animations/AnimationPic";
import { useCookies } from 'react-cookie';

const Login = (): React.ReactNode => {
  const router = useRouter();

  const goToLogin = () => {
    router.push({
      pathname: "/login",
    });
  };

  const getLogout = async () => {
    await logout();
  };

  useEffect(() => {
    getLogout();
  }, []);

  return (
    <motion.div className="intro">
      <motion.div className="intro-login">
        <motion.h2 variants={titleSlider} initial="hidden" animate="show">
          See you later!
        </motion.h2>
        <motion.div className="intro-text">
          <Button
            shadow
            type="secondary"
            id="btn-new-session-logout"
            onClick={goToLogin}
          >
            Login
          </Button>
        </motion.div>
      </motion.div>
      <motion.div className="intro-images">
        <Galaxy />
      </motion.div>
    </motion.div>
  );
};

export default Login;
