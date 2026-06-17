"use client"

import { useState, useEffect } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
    Timer,
    Zap,
    TrendingUp,
    Calendar,
    ArrowRight,
    BookOpen,
    Trophy,
    BarChart3,
    Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StudyCalendar } from '@/components/StudyCalendar'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [stats, setStats] = useState<any>(null)
    const [tasks, setTasks] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    useEffect(() => {
        if (status === 'authenticated') {
            fetchDashboardData()
        }
    }, [status])

    const fetchDashboardData = async () => {
        setIsLoading(true)
        try {
            // Fetch stats
            const statsRes = await fetch('/api/analytics')
            const statsData = await statsRes.json()
            if (statsData.success) setStats(statsData.data)

            // Fetch today's tasks
            const date = format(new Date(), 'yyyy-MM-dd')
            const plannerRes = await fetch(`/api/planner?date=${date}`)
            const plannerData = await plannerRes.json()
            if (plannerData.success && plannerData.data.length > 0) {
                setTasks(plannerData.data[0].tasks)
            }
        } catch (e) {
            toast.error('Failed to sync dashboard')
        } finally {
            setIsLoading(false)
        }
    }

    if (status === 'loading' || !session) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-500"></div>
            </div>
        )
    }

    const statCards = [
        {
            label: "Study Time",
            value: stats ? `${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m` : '0h 0m',
            icon: Timer,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10'
        },
        {
            label: "Current Streak",
            value: '1 day', // Placeholder for actual streak API
            icon: Zap,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10'
        },
        {
            label: "Tasks Done",
            value: tasks.length > 0 ? `${Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%` : '0%',
            icon: TrendingUp,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            label: "Total Sessions",
            value: stats ? stats.sessionCount.toString() : '0',
            icon: BookOpen,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white leading-none">
                        Welcome back, <span className="text-indigo-500">{session.user?.name?.split(' ')[0]}</span>!
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium">
                        {tasks.length > 0
                            ? `You have ${tasks.filter(t => t.status !== 'completed').length} study blocks remaining today.`
                            : "Ready to crush your study goals today? Start by planning your sessions."}
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2x border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                    <Button
                        onClick={() => router.push('/timer')}
                        className="px-8 h-12 rounded-xl bg-indigo-600 text-white font-semibold tracking-tight hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                    >
                        Focus Now
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, i) => (
                    <Card key={i} className="group relative rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden cursor-default active:scale-98">
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-6">
                                <div className={stat.bg + " p-4 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-indigo-600/30"}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="h-1.5 w-10 rounded-full bg-slate-100 dark:bg-slate-900 group-hover:bg-indigo-500/20 transition-colors"></div>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 group-hover:text-indigo-500 transition-colors">{stat.label}</h3>
                                <p className="text-3xl font-semibold mt-2 text-slate-900 dark:text-white dark:group-hover:text-white tracking-tighter">{stat.value}</p>
                            </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-1000 blur-2xl"></div>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Activity Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[3rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 backdrop-blur-3xl p-10 lg:p-14 h-[500px] relative overflow-hidden flex flex-col items-center justify-center text-center group shadow-2xl">
                        <div className="absolute top-10 left-10">
                            <h3 className="text-xl font-semibold tracking-tight text-slate-400 flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-indigo-500" />
                                Growth Trends
                            </h3>
                        </div>
                        <div className="w-full h-full relative z-10 flex flex-col mt-4">
                            {isLoading ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-500"></div>
                                </div>
                            ) : stats?.dailyActivity && stats?.sessionCount > 0 ? (
                                <div className="flex-1 w-full min-h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.dailyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, className: 'text-slate-400 font-semibold' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, className: 'text-slate-400 font-semibold' }} />
                                            <Tooltip 
                                                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', fontWeight: 600 }}
                                                itemStyle={{ color: '#6366f1' }}
                                                formatter={(value) => [`${value} min`, 'Focus Time']}
                                            />
                                            <Bar dataKey="focus" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="space-y-6 flex flex-col items-center flex-1 justify-center">
                                    <div className="w-24 h-24 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center mx-auto text-indigo-500 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner border border-indigo-500/10">
                                        <BarChart3 className="w-12 h-12" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-semibold tracking-tighter">Analyzing Performance...</h4>
                                        <p className="text-slate-500 text-sm mt-3 max-w-xs mx-auto font-medium leading-relaxed">
                                            Continue your study streak to unlock advanced data visualizations and peak performance insights.
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push('/history')}
                                        className="h-14 rounded-2xl border-2 border-indigo-500/20 text-indigo-500 font-semibold tracking-tight px-8 hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
                                    >
                                        Detailed Logs <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
                    </Card>
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                    <Card className="rounded-[3rem] bg-slate-900 border-none p-10 text-white relative overflow-hidden group shadow-3xl">
                        <Trophy className="absolute -right-6 -bottom-6 w-48 h-48 opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-1000 text-indigo-500" />
                        <div className="relative z-10">
                            <h3 className="text-2xl font-semibold tracking-tighter leading-tight">Crush Your<br />Milestones</h3>
                            <p className="mt-4 text-slate-400 font-medium leading-relaxed text-sm">
                                "Your dedication determines your success. Keep pushing, Focus Scholar!"
                            </p>
                            <div className="mt-12 flex items-center justify-between bg-white/5 p-4 rounded-[1.5rem] border border-white/10 backdrop-blur-sm">
                                <div>
                                    <p className="text-[10px] text-slate-500 tracking-[0.2em] font-semibold">Level Progress</p>
                                    <p className="text-lg font-semibold tracking-tighter mt-1">Focus Novice</p>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-semibold text-xl shadow-lg shadow-indigo-600/40">
                                    01
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[3rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-xl">
                        <h3 className="text-lg font-semibold tracking-tight mb-8 flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-indigo-500" />
                            Agenda
                        </h3>
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="py-12 flex justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500/20 border-t-indigo-500"></div>
                                </div>
                            ) : tasks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-100 dark:border-slate-900 rounded-[2rem] text-slate-400 bg-slate-50/50 dark:bg-slate-900/10">
                                    <p className="text-xs font-semibold tracking-widest text-center opacity-60">Schedule Empty</p>
                                    <Button
                                        variant="link"
                                        onClick={() => router.push('/planner')}
                                        className="mt-4 text-indigo-500 font-semibold tracking-tighter"
                                    >
                                        + Plan Now
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {tasks.slice(0, 3).map((task) => (
                                        <div key={task.id} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-transparent hover:border-indigo-500/20 transition-all">
                                            <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                            <p className={`text-sm font-bold tracking-tight truncate ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>{task.taskName}</p>
                                        </div>
                                    ))}
                                    {tasks.length > 3 && (
                                        <p className="text-[10px] text-slate-400 font-semibold text-center tracking-widest mt-2">+{tasks.length - 3} more items in planner</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Study Calendar Heatmap */}
            <StudyCalendar />
        </div>
    )
}
