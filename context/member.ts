import React from "react";
import Member from "../interfaces/models/Member";

export const MemberContext = React.createContext<Member>({} as Member);