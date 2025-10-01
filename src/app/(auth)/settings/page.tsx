import { signOut } from "@/auth";

const Settings = () => {
    const logout = async () => {
        'use server'
        
        await signOut({ redirectTo: "/login" });
    }

    return <>
        <form action={logout}>
            <button type="submit" className="little-button">Se déconnecter ?</button>
        </form>
    </>
}

export default Settings;