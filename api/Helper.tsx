import Member from "../interfaces/models/Member";
import { config } from "../components/config";
import { CgPassword } from "react-icons/cg";

export const getCurrentMember = async () => {
  try {
    const response = await fetch(config.server_url + "api/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(await response.json());
    }
    const member: Member = await response.json();
    return member;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const syncGetCurrentMember = (setMemberCallback:any) => {
  fetch(
    config.server_url + `api/`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response:any) => {
    if (response.ok)  return response.json();
    throw new Error();
  }).then((jsonResponse:Member) => setMemberCallback(jsonResponse))
  .catch(err => {
    console.log(err);
    setMemberCallback(null);
  });
};

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(config.server_url + "api/login", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    if (!response.ok) {
      throw new Error(await response.json());
    }
    console.log("Hello I am here at the helper");
    return response.json();
  } catch (e) {
    console.log("login failed");
    return null;
  }
};

export const signup = async (
  email: string,
  firstname: string,
  lastname: string,
  password: string
) => {
  try {
    const response = await fetch(config.server_url + "api/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        firstname: firstname,
        lastname: lastname,
        password: password,
      }),
    });
    if (!response.ok) {
      throw new Error(await response.json());
    }
    return response.json();
  } catch (e) {
    console.log("sign up failed");
    return null;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(config.server_url + "api/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(await response.json());
    }
    return response.json();
  } catch (e) {
    console.log("logout failed");
    return null;
  }
};

export const getOnlineMembers = async () => {
  try {
    const response = await fetch(config.server_url + "api/online", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(await response.json());
    }
    return response.json();
  } catch (e:any) {
    console.log("get online members failed");
    return null;
  }
};
