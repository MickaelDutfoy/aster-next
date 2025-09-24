import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

const registerUser = async (formdata: FormData) => {
    'use server';

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
        await prisma.members.create({data : {
            first_name: newUser.firstName,
            last_name: newUser.lastName,
            email: newUser.email,
            phone_number: newUser.phoneNumber,
            password_hash: passwordHash
        }})

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

const Register = () => {
    return <>
    <h1 className="m-5">This is the register page.</h1>
    <form action={registerUser}>
        <input type="text" name="userFirstName" placeholder="Prénom" />
        <input type="text" name="userLastName" placeholder="Nom" />
        <input type="text" name="userEmail" placeholder="E-mail" />
        <input type="text" name="userPhoneNumber" placeholder="Téléphone" />
        <input type="text" name="userPassword" placeholder="Mot de passe" />
        <button type="submit">Envoyer</button>
    </form>
    </>
}

export default Register;