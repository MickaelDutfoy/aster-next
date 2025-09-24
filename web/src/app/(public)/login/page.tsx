import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

const loginUser = async (formdata: FormData) => {
    'use server';

    const user = {
        email: formdata.get('userEmail')?.toString(),
        password: formdata.get('userPassword')?.toString(),
    }

    try {
        await signIn("credentials", {
            redirectTo: "/",
            email: user.email,
            password: user.password,
        });
    } catch (error) {
        console.log("process failed")
    }

    redirect('/');
}

const Login = () => {
    return <>
        <h1 className="m-5">This is the login page.</h1>
        <form action={loginUser}>
            <input type="text" name="userEmail" placeholder="E-mail" />
            <input type="text" name="userPassword" placeholder="Password" />
            <button>Envoyer</button>
        </form>
        <Link href="/register">Créer un compte ?</Link>
    </>
}

export default Login;