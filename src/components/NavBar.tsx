'use client'

import { Member } from "@/lib/types";
import { Users, Cat, HouseHeart, MapPinned, FolderOpen, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "./UserProvider";

export const NavBar = () => {
    const user: Member | null = useUser();
    const pathname = usePathname();

    return <>
        <nav>
            <Link href="/"><HouseHeart size={42} strokeWidth={pathname === "/" ? 2 : 0.5} /></Link>
            <Link className={user?.organizations?.length === 0 ? "disabled" : ""} href="/animals"><Cat size={42} strokeWidth={pathname === "/animals" ? 2 : 0.5} /></Link>
            <Link className={user?.organizations?.length === 0 ? "disabled" : ""} href="/families"><Users size={42} strokeWidth={pathname === "/families" ? 2 : 0.5} /></Link>
            <Link className={user?.organizations?.length === 0 ? "disabled" : ""} href="/map"><MapPinned size={42} strokeWidth={pathname === "/map" ? 2 : 0.5} /></Link>
            <Link href="/organizations"><FolderOpen size={42} strokeWidth={pathname === "/organizations" ? 2 : 0.5} /></Link>
            <Link href="/settings"><Settings size={42} strokeWidth={pathname === "/settings" ? 2 : 0.5} /></Link>
        </nav>
        <hr />
    </>
}