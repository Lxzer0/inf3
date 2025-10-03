export function Navbar() {
    return (
        <nav className="text-3xl flex flex-row border border-white justify-between items-center p-4">
            <div className="flex flex-row gap-4">
                <a href="/inf03" className="hover:underline">inf03</a>
                <a href="/inf04" className="hover:underline">inf04</a>
            </div>
            <div>v. delta</div>
        </nav>
    );
}
