'use client'

import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname().split('/')[1];

  const titles: Record<string, string> = {
    animals: 'Animaux',
    families: "Familles d'accueil",
    map: 'Carte',
    organizations: 'Associations',
    settings: 'Paramètres',
  };

  return (
    <>
      <header>
        <h2>{titles[pathname] ?? 'Accueil'}</h2>
      </header>
      <hr />
    </>
  );
};
