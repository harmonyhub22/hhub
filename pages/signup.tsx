import { Button, Input, Spacer } from "@geist-ui/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { login, signup } from "../api/Helper";
import Wave from "../components/animations/Wave";
import { Galaxy, LoginAnimation } from "../components/animations/AnimationPic";
import { imgVariant, titleSlider } from "../components/animations/Animation";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const Signup = (): React.ReactNode => {
  const [email, setEmail] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const getSignedUp = async () => {
    if (
      email.length === 0 ||
      firstname.length === 0 ||
      lastname.length === 0 ||
      password.length === 0
    ) {
      console.log("email, firstname, lastname, and password required");
      return;
    }
    const newMember = await signup(email, firstname, lastname, password);
    if (newMember != null) {
      window.location.href = window.location.origin;
    }
  };

  return (
    <>
      <motion.div className="intro">
        <motion.div className="intro-login">
          <motion.h2 variants={titleSlider} initial="hidden" animate="show">
            Please Sign-Up
          </motion.h2>

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
            <Input
              clearable
              label="First Name"
              placeholder="Harmony"
              value={firstname}
              onChange={(e: any) => setFirstname(e.target.value)}
              style={{ backgroundColor: "white" }}
            />
            <Spacer h={0.75} />
            <Input
              clearable
              label="Last Name"
              placeholder="Hub"
              value={lastname}
              onChange={(e: any) => setLastname(e.target.value)}
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
              onClick={getSignedUp}
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
          <Galaxy />
        </motion.div>
      </motion.div>
    </>
  );
};

export default Signup;