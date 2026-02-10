"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Timer,
    Target,
    Calendar,
    BarChart3,
    History,
    Settings,
    LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Timer', href: '/timer', icon: Timer },
    { name: 'Planner', href: '/planner', icon: Calendar },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'History', href: '/history', icon: History },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-300 border-r border-slate-800/50 w-64 fixed left-0 top-0 z-50">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Timer className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">StudyOS</span>
                </div>

                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-slate-900 text-white font-medium"
                                        : "hover:bg-slate-900/50 hover:text-white"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-indigo-400" : "group-hover:text-indigo-400"
                                )} />
                                {item.name}
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 space-y-1 border-t border-slate-800/50">
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-slate-900/50 hover:text-white",
                        pathname === '/settings' ? "bg-slate-900 text-white font-medium" : ""
                    )}
                >
                    <Settings className="w-5 h-5 group-hover:text-indigo-400" />
                    Settings
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full text-left hover:bg-red-500/10 hover:text-red-400 group"
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-400" />
                    Logout
                </button>
            </div>
        </div>
    )
}
