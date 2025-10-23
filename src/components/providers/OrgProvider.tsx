'use client'

import { Organization } from "@/lib/types";
import { createContext, useContext } from "react";

const OrgCtx = createContext<Organization | null>(null);
export const useOrg = () => useContext(OrgCtx);

export const OrgProvider = ({
    value, children,
}: { value: Organization | null; children: React.ReactNode }) => {
    return <OrgCtx.Provider value={value}>{children}</OrgCtx.Provider>;
}