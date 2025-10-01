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
  const pathname = usePathname();

  return <><header>{titles[pathname] ?? ""}</header><hr /></>;
};
