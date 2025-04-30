import { Navbar } from "@/app/components/navbar";
import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html className="bg-black text-white font-sans">
            <body className="w-screen h-screen overflow-clip flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
            </body>
        </html>
    );
}
