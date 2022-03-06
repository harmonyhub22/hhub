import { Button, Input, Spacer } from "@geist-ui/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { login } from "../components/Helper";

const Login = (): React.ReactNode => {
    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');

    const getLogin = async () => {
        if (email.length === 0 || firstname.length === 0 || lastname.length === 0) {
            console.log('email, firstname, lastname required');
            return;
        }
        const newMember = await login(email, firstname, lastname);
        if (newMember === null || newMember === undefined || newMember?.memberId === null || newMember?.memberId === undefined) {
            console.log('login failed');
            return;
        }
        // router.push({
        //     pathname: "/",
        // });
        window.location.href = window.location.origin;
    }
  
    return (
      <>
        <h1>Login</h1>
        <Input clearable label="email" placeholder="someone@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Spacer h={.5} />
        <Input clearable label="first name" placeholder="Harmony" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
        <Spacer h={.5} />
        <Input clearable label="last name" placeholder="Hub" value={lastname} onChange={(e) => setLastname(e.target.value)} />
        <Spacer h={.5} />
        <Button shadow type="secondary" id="btn-new-session" onClick={getLogin}>
            Login
        </Button>
      </>
    );
  };
  
  export default Login;