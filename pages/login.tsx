import { Button, Input, Spacer } from "@geist-ui/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { login } from "../components/Helper";
import Wave from "../components/Wave";
import { LoginAnimation } from "../components/AnimationPic";

const Login = (): React.ReactNode => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");

  const getLogin = async () => {
    if (email.length === 0 || firstname.length === 0 || lastname.length === 0) {
      console.log("email, firstname, lastname required");
      return;
    }
    const newMember = await login(email, firstname, lastname);
    if (
      newMember === null ||
      newMember === undefined ||
      newMember?.memberId === null ||
      newMember?.memberId === undefined
    ) {
      console.log("login failed");
      return;
    }
    // router.push({
    //     pathname: "/",
    // });
    window.location.href = window.location.origin;
  };

  return (
    <div className="intro">
      <div className="intro-login">
        <h1>Harmony Hub</h1>
        <div>
          <Input
            clearable
            label="Email"
            placeholder="someone@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Spacer h={0.75} />
          <Input
            clearable
            label="First Name"
            placeholder="Harmony"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <Spacer h={0.75} />
          <Input
            clearable
            label="Last Name"
            placeholder="Hub"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
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
        </div>
      </div>
      <Wave />
      <div className="intro-images">
        <LoginAnimation />
      </div>
    </div>
  );
};

export default Login;
