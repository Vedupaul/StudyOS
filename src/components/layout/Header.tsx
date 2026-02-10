"use client"

import { useSession } from 'next-auth/react'
import { Bell, Search, User } from 'lucide-react'

export function Header() {
    const { data: session } = useSession()

    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="relative w-96 max-w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search your study sessions..."
                    className="w-full bg-slate-100 dark:bg-slate-900/50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors relative">
                    <Bell className="w-5 h-5 text-slate-500" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
                </button>

                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">{session?.user?.name}</p>
                        <p className="text-xs text-slate-500 mt-1">Focus Scholar</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold p-[2px]">
                        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                            <User className="w-6 h-6 grayscale" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
