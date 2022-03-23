import Member from "../interfaces/models/Member";
import { config } from "../components/config";

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

export const login = async (
  email: string,
  firstname: string,
  lastname: string
) => {
  try {
    const response = await fetch(config.server_url + "api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        firstname: firstname,
        lastname: lastname,
      }),
    });
    if (!response.ok) {
      throw new Error(await response.json());
    }
    return response.json();
  } catch (e) {
    console.log("login failed");
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
