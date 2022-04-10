import { Button, Input, Spacer } from "@geist-ui/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { login } from "../api/Helper";
import Wave from "../components/animations/Wave";
import * as AnimationPic from "../components/animations/AnimationPic";
import { imgVariant, titleSlider } from "../components/animations/Animation";
import { motion } from "framer-motion";
import { useCookies } from 'react-cookie';
import AuthResponse from "../interfaces/authResponse";

const Login = (): React.ReactNode => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [cookies, setCookie, removeCookie] = useCookies(['hhub-token']);

  const getLogin = async () => {
    if (email.length === 0) {
      alert("Please provide your username!")
      return;
    }
    if (password.length === 0) {
      alert("Please provide your password!")
      return;
    }
    const authResponse: AuthResponse|null = await login(email, password);
    console.log('auth Response', authResponse);

    if (authResponse !== null && authResponse.success === true) {
      setCookie('hhub-token', authResponse["hhub-token"]);
      window.location.assign("/");
      return;
    }
    window.alert("Email and password do not match");
  };

  const goToSignup = () => {
    router.push({
      pathname: "/signup",
    });
  };

  return (
    <>
      <motion.div className="intro">
        <motion.div className="intro-login">
          <motion.h1 variants={titleSlider} initial="hidden" animate="show">
            Harmony Hub
          </motion.h1>
          <motion.div className="intro-text">
            <Input
              clearable
              label="Email"
              placeholder="someone@example.com"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              style={{ backgroundColor: "white" }}
            />
            <Spacer h={0.75} />
            <Input.Password
              clearable
              label="Password"
              placeholder="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              style={{ backgroundColor: "white" }}
            />
            <Spacer h={0.75} />
            <Button
              shadow
              type="secondary"
              id="btn-new-session"
              onClick={getLogin}
            >
              Login
            </Button>
            <p>{'- or -'}</p>
            <Button
              shadow
              type="success"
              id="btn-new-session-signup"
              onClick={goToSignup}
            >
              Sign-Up
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="intro-images"
          variants={imgVariant}
          initial="initial"
          animate="animate"
        >
          <AnimationPic.DancingMan />
        </motion.div>
      </motion.div>
    </>
  );
};

export default Login;
