const Layout = async ({ children }: { children: React.ReactNode }) => {
    return <div>
        <h1 className="m-3">This is a public page.</h1>
        {children}
    </div>
}

export default Layout;