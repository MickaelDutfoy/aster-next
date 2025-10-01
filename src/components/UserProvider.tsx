'use client'

import { Member } from "@/lib/types";
import { createContext, useContext } from "react";

const UserCtx = createContext<Member | null>(null);
export const useUser = () => useContext(UserCtx);

export const UserProvider = ({
    value, children,
}: { value: Member | null; children: React.ReactNode }) => {
    return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
}