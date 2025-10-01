'use client'

import "@/styles/intro.scss"
import { markSeen } from "@/app/(public)/intro/actions";
import { useState } from "react";

const Intro = () => {
    const [step, setStep] = useState(0);

    const nextFrame = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            markSeen();
        }
    }

    return <div className="intro">
        {step === 0 && <div>
            <h2>Bienvenue sur Aster !</h2>
            <p>« Aider ceux qui aident. »</p>
            <button className="main-button" onClick={nextFrame}>Voir la suite</button>
        </div>}
        {step === 1 && <div>
            <h2>Pourquoi faire ?</h2>
            <p>Aster est une application de gestion d'association de protection animale.</p>
            <p>En regroupant votre agenda, la carte de vos familles d'accueil et votre to-do list, Aster est là pour vous simplifier la vie.</p>
            <button className="main-button" onClick={nextFrame}>Voir la suite</button>
        </div>}
        {step === 2 && <div>
            <h2>Comment ça fonctionne ?</h2>
            <p>Créez un compte, enregistrez votre association, invitez vos membres, ajoutez vos familles d'accueil et vos animaux.</p>
            <p>100% gratuite et sans publicité, Aster n'a qu'un objectif : aider ceux qui font tout pour aider les animaux.</p>
            <button className="main-button" onClick={nextFrame}>Voir la suite</button>
        </div>}
        {step === 3 && <div>
            <h2>Et ensuite ?</h2>
            <p>Depuis votre bureau, vous pourrez visualiser vos familles d'accueil sur une carte et voir celles vacantes en un clin d'oeil.</p>
            <p>Vous pourrez aussi voir vos animaux en attente de placement, ceux prêts à être adoptés, ou accéder à votre agenda pour gérer vos tâches en attente et les répartir avec les autres membres.</p>
            <p>Alors, on commence ?</p>
            <button className="main-button" onClick={nextFrame}>C'est parti !</button>
        </div>}
    </div>
}

export default Intro;