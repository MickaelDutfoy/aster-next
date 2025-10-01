import "@/styles/login-register.scss"
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

const Register = () => {
    const registerUser = async (formdata: FormData) => {
        'use server'

        const newUser = {
            firstName: formdata.get('userFirstName')?.toString(),
            lastName: formdata.get('userLastName')?.toString(),
            email: formdata.get('userEmail')?.toString(),
            phoneNumber: formdata.get('userPhoneNumber')?.toString(),
            password: formdata.get('userPassword')?.toString(),
        }

        if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.phoneNumber || !newUser.password) return;

        const passwordHash = await bcrypt.hash(newUser.password, 12);

        try {
            await prisma.members.create({
                data: {
                    first_name: newUser.firstName,
                    last_name: newUser.lastName,
                    email: newUser.email,
                    phone_number: newUser.phoneNumber,
                    password_hash: passwordHash
                }
            })

            await signIn("credentials", {
                redirectTo: "/",
                email: newUser.email,
                password: newUser.password,
            });
        } catch (error) {
            console.log("process failed")
        }

        redirect('/');
    }

    return <div className="auth-page">
        <div className="auth-block">
            <form action={registerUser}>
                <label htmlFor="userFirstName">Prénom :</label>
                <input className="auth-field" type="text" name="userFirstName" placeholder="Prénom" />
                <label htmlFor="userLastName">Nom :</label>
                <input className="auth-field" type="text" name="userLastName" placeholder="Nom" />
                <label htmlFor="userEmail">E-mail :</label>
                <input className="auth-field" type="text" name="userEmail" placeholder="E-mail" />
                <label htmlFor="userPhoneNumber">Téléphone :</label>
                <input className="auth-field" type="text" name="userPhoneNumber" placeholder="Téléphone" />
                <label htmlFor="userPassword">Mot de passe :</label>
                <input className="auth-field" type="text" name="userPassword" placeholder="Mot de passe" />
                <p className="disclaimer">Le numéro de téléphone n'est requis que par commodité de communication pour les membres d'une association. Aster n'utilisera jamais votre numéro.</p>
                <button type="submit" className="main-button">Créer un compte</button>
            </form>
        </div>
    </div>
}

export default Register;