'use client'

import { useRouter } from "next/navigation";
import { CircleX } from "lucide-react";

export const Modal = ({ children }: { children: React.ReactNode}) => {
    const router = useRouter();

    return (
        <div className="overlay"
            onClick={() => router.back()} // clic sur l’overlay => fermer
        >
            <div className="modal"
                onClick={(e) => e.stopPropagation()} // éviter de fermer si on clique dans la modale
            >
                <CircleX className="close" size={35}
                    onClick={() => router.back()}
                />
                {children}
            </div>
        </div>
    );
}