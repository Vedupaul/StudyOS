"use client"

import { useSession } from 'next-auth/react'
import { Bell, Search, User } from 'lucide-react'

export function Header() {
    const { data: session } = useSession()

    return (
        <header className="h-16 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between shadow-md shadow-slate-900/5 dark:shadow-slate-900/20">
            <div className="relative w-96 max-w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search your study sessions..."
                    className="w-full bg-slate-100 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 outline-none"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all duration-300 hover:scale-110 relative group">
                    <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse-glow"></span>
                </button>

                <div className="h-8 w-[1px] bg-slate-200/50 dark:bg-slate-800/50 mx-2"></div>

                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none group-hover:text-indigo-500 transition-colors">{session?.user?.name}</p>
                        <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors mt-1">Focus Scholar</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold p-[2px] group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:scale-110">
                        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                            <User className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
