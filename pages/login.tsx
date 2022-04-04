import { Button, Input, Spacer } from "@geist-ui/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { login } from "../api/Helper";
import Wave from "../components/animations/Wave";
import { LoginAnimation } from "../components/animations/AnimationPic";
import { imgVariant, titleSlider } from "../components/animations/Animation";
import { motion } from "framer-motion";

const Login = (): React.ReactNode => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const getLogin = async () => {
    if (email.length === 0 || password.length === 0) {
      console.log("email and password required");
      return;
    }
    const existingMember = await login(email, password);
    console.log(existingMember);

    if (existingMember != null) {
      window.location.href = window.location.origin;
      return;
    }
    window.alert("Please enter a correct information");
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
              placeholder="Use a strong password"
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
            <Button
              shadow
              type="secondary"
              id="btn-new-session-signup"
              onClick={goToSignup}
            >
              Sign-Up
            </Button>
          </motion.div>
        </motion.div>
        <Wave />
        <motion.div
          className="intro-images"
          variants={imgVariant}
          initial="initial"
          animate="animate"
        >
          <LoginAnimation />
        </motion.div>
      </motion.div>
    </>
  );
};

export default Login;
