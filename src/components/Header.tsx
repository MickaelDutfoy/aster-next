'use client'

import { usePathname } from "next/navigation"

const titles: Record<string, string> = {
  "/": "Accueil",
  "/animals": "Animaux",
  "/families": "Familles d'accueil",
  "/map": "Carte",
  "/organizations": "Associations",
  "/settings": "Paramètres",
};

export const Header = () => {
  const pathname = usePathname() || "/";
  const keys = Object.keys(titles).sort((a, b) => b.length - a.length);
  const key = keys.find(k => pathname === k || pathname.startsWith(k + "/"));

  return <><header><h2>{key ? titles[key] : ""}</h2></header><hr /></>;
};
