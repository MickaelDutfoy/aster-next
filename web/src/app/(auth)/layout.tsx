const Layout = async ({ children }: { children: React.ReactNode }) => {
    return <div className="underline-offset-2 border-2 border-amber-500">
        <h1 className="m-3">This is an auth page.</h1>
        {children}
    </div>
}

export default Layout;