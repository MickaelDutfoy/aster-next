'use server'

import { cookies } from "next/headers";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function markSeen() {
    const session = await auth();

    const cookieStore = await cookies();
    cookieStore.set("intro_seen", "1", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
    });
    if (!session) {
        redirect("/login");
    } else {
        redirect("/");
    }
}