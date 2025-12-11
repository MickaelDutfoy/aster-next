'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export const PasswordInput = ({ name, placeholder }: { name: string; placeholder: string }) => {
  const [isHidden, setIsHidden] = useState<boolean>(true);

  return (
    <div className="password">
      <input
        className="auth-field"
        type={isHidden ? 'password' : 'text'}
        name={name}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="eye"
        onClick={() => setIsHidden((prev) => !prev)}
        aria-label={isHidden ? 'Afficher le mot de passe' : 'Masquer le mot de passe'}
      >
        {isHidden ? <Eye size={22} /> : <EyeOff size={22} />}
      </button>
    </div>
  );
};
