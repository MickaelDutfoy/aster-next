'use server'

import { signOut } from "@/auth";

export const logout = async () => {
    'use server';

    await signOut({ redirectTo: "/login" });
}