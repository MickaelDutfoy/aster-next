import "@/styles/login-register.scss"
import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

const Login = () => {
    const loginUser = async (formdata: FormData) => {
        'use server'
        
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
            console.log('login error.')
        }
    
        redirect('/');
    }

    return <div className="auth-page">
        <div className="auth-block">
            <h2>Pas encore membre ?</h2>
            <Link href="/register" className="main-button">Créer un compte</Link>
        </div>
        <div className="auth-block">
            <h2>Déjà membre ?</h2>
            <form action={loginUser}>
                <label htmlFor="userEmail">E-mail :</label>
                <input className="auth-field" type="text" name="userEmail" placeholder="E-mail" />
                <label htmlFor="userPassword">Mot de passe :</label>
                <input className="auth-field" type="password" name="userPassword" placeholder="Password" />
                <button className="main-button">Se connecter</button>
            </form>
        </div>
    </div>
}

export default Login;