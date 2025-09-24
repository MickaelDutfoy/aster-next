import { signOut } from "@/auth";

const Home = async () => {
  const logout = async () => {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return <>
    <h1 className="m-5">This is the landing page.</h1>
    <form action={logout}>
      <button type="submit">Se déconnecter ?</button>
    </form>
  </>
}

export default Home;