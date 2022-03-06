import { Button, Input, Spacer, Text } from "@geist-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { login, logout } from "../components/Helper";

const Login = (): React.ReactNode => {

    const router = useRouter();

    const goToLogin = () => {
        router.push({
            pathname: "/login",
        });
    }

    const getLogout = async () => {
        await logout();
    }

    useEffect(() => {
        getLogout();
    }, []);
  
    return (
      <>
        <Text h2>Goodbye, come again.</Text>
        <Button shadow type="secondary" id="btn-new-session" onClick={goToLogin}>
            Login
        </Button>
      </>
    );
  };
  
  export default Login;