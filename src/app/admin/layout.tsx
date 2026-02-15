import Link from "next/link";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/anmelden");
    }

    let isAdmin = false;

    try {
        const decoded = verifyToken(token);
        await connectToDatabase();
        const user = await User.findById(decoded.sub);

        if (user && user.role === "admin") {
            isAdmin = true;
        }
    } catch (error) {
        // Token invalid or DB error
    }

    if (!isAdmin) {
        // Redirect non-admins to home
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-white/10 bg-zinc-900/50 backdrop-blur-xl">
                <nav className="flex flex-col gap-2 p-4">
                    <Link
                        href="/admin"
                        className="rounded-md px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
                    >
                        Panel
                    </Link>
                    <Link
                        href="/admin/properties"
                        className="rounded-md px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
                    >
                        Immobilien
                    </Link>
                    <Link
                        href="/admin/reservations"
                        className="rounded-md px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white"
                    >
                        Reservierungen
                    </Link>
                    <Link
                        href="/"
                        className="mt-8 rounded-md bg-white/5 px-4 py-2 text-center text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
                    >
                        Zur Startseite
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                <div className="mx-auto max-w-5xl">{children}</div>
            </main>
        </div>
    );
}
