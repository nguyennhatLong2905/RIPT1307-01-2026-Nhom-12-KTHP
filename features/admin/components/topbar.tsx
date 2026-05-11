import { Bell, Search, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Topbar() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-black/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-black/60">
            <div className="flex items-center gap-4 lg:hidden">
                <span className="text-lg font-bold text-red-600">LUXE</span>
            </div>
            
            <div className="flex flex-1 items-center gap-4 md:ml-6">
                <div className="relative w-full max-w-md hidden md:block">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full bg-slate-900 border-slate-800 pl-10 text-white placeholder:text-slate-400 focus-visible:ring-red-600"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-red-600"></span>
                    <Bell className="h-5 w-5" />
                </button>
                <div className="h-8 w-px bg-slate-800 mx-2"></div>
                <button className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-slate-800 transition-colors">
                    <UserCircle className="h-8 w-8 text-slate-300" />
                    <div className="hidden flex-col items-start md:flex">
                        <span className="text-sm font-medium text-white">Quản Trị Viên</span>
                        <span className="text-xs text-slate-400">Super Admin</span>
                    </div>
                </button>
            </div>
        </header>
    );
}
