"use client"

import { PomodoroTimer } from '@/components/timer/PomodoroTimer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Timer as TimerIcon, History, Target, BookOpen, Settings2, Clock, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function TimerPage() {
    const [sessions, setSessions] = useState<any[]>([])
    const [stats, setStats] = useState({
        todayHours: 0,
        todayCount: 0,
        efficiency: 92
    })
    const [isLoading, setIsLoading] = useState(true)
    const [subjects, setSubjects] = useState<any[]>([])
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')

    useEffect(() => {
        fetchRecentSessions()
        fetchStats()
        fetchSubjects()
    }, [])

    const fetchSubjects = async () => {
        try {
            const res = await fetch('/api/subjects')
            const data = await res.json()
            if (data.success) setSubjects(data.data)
        } catch (e) { }
    }

    const fetchRecentSessions = async () => {
        try {
            const res = await fetch('/api/sessions?limit=5')
            const data = await res.json()
            if (data.success) setSessions(data.data)
        } catch (e) { } finally {
            setIsLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/analytics')
            const data = await res.json()
            if (data.success) {
                setStats({
                    todayCount: data.data.sessionCount,
                    todayHours: Math.round(data.data.totalMinutes / 60 * 10) / 10,
                    efficiency: 92 // Placeholder for now
                })
            }
        } catch (e) { }
    }

    const handleComplete = async (session: { duration: number }) => {
        try {
            const response = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    duration: session.duration,
                    type: 'FOCUS',
                    status: 'COMPLETED',
                    subjectId: selectedSubjectId || undefined
                })
            })

            if (response.ok) {
                toast.success('Focus session completed and saved!')
                fetchRecentSessions()
                fetchStats()
            }
        } catch (error) {
            console.error('Failed to save session:', error)
            toast.error('Failed to save study session.')
        }
    }

    const [focusMinutes, setFocusMinutes] = useState(25)
    const [breakMinutes, setBreakMinutes] = useState(5)

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Focus <span className="text-indigo-500">Timer</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
                        Concentrate on your work without distractions.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900/40 border-2 border-slate-100 dark:border-slate-800 rounded-[3.5rem] p-12 lg:p-20 shadow-2xl shadow-indigo-500/5 flex flex-col items-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform"></div>
                        
                        <div className="mb-10 w-full max-w-xs relative z-10">
                            <label className="text-[10px] font-semibold tracking-widest text-slate-500 ml-4 mb-2 block">Focus Subject</label>
                            <select
                                value={selectedSubjectId}
                                onChange={(e) => setSelectedSubjectId(e.target.value)}
                                className="w-full bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-3 px-5 text-sm font-bold focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                            >
                                <option value="">General Study</option>
                                {subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <PomodoroTimer 
                            onComplete={handleComplete} 
                            workDuration={focusMinutes}
                            breakDuration={breakMinutes}
                        />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center text-center group hover:border-indigo-500/20 transition-all active:scale-95 shadow-lg">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl group-hover:shadow-indigo-600/20">
                                <Target className="w-6 h-6" />
                            </div>
                            <p className="text-[10px] font-semibold text-slate-500 tracking-widest leading-none mb-1">Daily Total</p>
                            <p className="text-2xl font-semibold tracking-tighter text-slate-900 dark:text-white">{stats.todayHours} <span className="text-indigo-500">Hours</span></p>
                        </div>
                        <div className="bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center text-center group hover:border-emerald-500/20 transition-all active:scale-95 shadow-lg">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xl group-hover:shadow-emerald-600/20">
                                <History className="w-6 h-6" />
                            </div>
                            <p className="text-[10px] font-semibold text-slate-500 tracking-widest leading-none mb-1">Today's Sessions</p>
                            <p className="text-2xl font-semibold tracking-tighter text-slate-900 dark:text-white">{stats.todayCount} <span className="text-emerald-500">Blocks</span></p>
                        </div>
                        <div className="bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center text-center group hover:border-purple-500/20 transition-all active:scale-95 shadow-lg">
                            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-xl group-hover:shadow-purple-600/20">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <p className="text-[10px] font-semibold text-slate-500 tracking-widest leading-none mb-1">Efficiency</p>
                            <p className="text-2xl font-semibold tracking-tighter text-slate-900 dark:text-white">{stats.efficiency}<span className="text-purple-500">%</span></p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-[3rem] bg-slate-900 text-white border-none shadow-3xl overflow-hidden min-h-[400px]">
                        <CardHeader className="p-10 pb-4">
                            <CardTitle className="text-2xl font-semibold tracking-tighter flex items-center gap-3">
                                <TimerIcon className="w-6 h-6 text-indigo-500" />
                                Session <span className="text-indigo-500">History</span>
                            </CardTitle>
                            <CardDescription className="text-slate-500 font-bold tracking-widest text-[10px] mt-1">
                                Your recent focus blocks
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-4">
                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="py-20 flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500/20 border-t-indigo-500"></div>
                                    </div>
                                ) : sessions.length === 0 ? (
                                    <div className="py-12 text-center bg-slate-800/20 rounded-[2rem] border-2 border-slate-800/50 border-dashed">
                                        <p className="text-sm text-slate-600 font-bold tracking-widest">No sessions yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {sessions.map((s, i) => (
                                            <div key={s.id} className="bg-slate-800/40 p-5 rounded-[1.5rem] flex items-center justify-between border border-slate-800/50 group hover:border-indigo-500/30 transition-all cursor-default">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                                    <div>
                                                        <p className="text-sm font-semibold tracking-tighter">Study Block</p>
                                                        <p className="text-[10px] text-slate-600 font-semibold tracking-widest leading-none mt-1">{format(new Date(s.createdAt), 'h:mm a')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <p className="text-sm font-semibold text-indigo-400 group-hover:scale-110 transition-transform">{s.duration} <span className="text-[10px]">Min</span></p>
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[3rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 backdrop-blur-xl p-10 shadow-xl overflow-hidden relative">
                        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
                        <h3 className="text-lg font-semibold tracking-tight mb-8 flex items-center gap-3">
                            <Settings2 className="w-5 h-5 text-indigo-500" /> Timer Config
                        </h3>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-semibold tracking-widest text-slate-500">Focus Duration</span>
                                    <span className="text-indigo-500 font-semibold">{focusMinutes} <span className="text-[8px]">min</span></span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="60" 
                                    value={focusMinutes} 
                                    onChange={(e) => setFocusMinutes(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-semibold tracking-widest text-slate-500">Break Duration</span>
                                    <span className="text-emerald-500 font-semibold">{breakMinutes} <span className="text-[8px]">min</span></span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="30" 
                                    value={breakMinutes} 
                                    onChange={(e) => setBreakMinutes(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                            </div>
                            
                            <div className="pt-2">
                                <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                                    <p className="text-[9px] font-semibold tracking-widest text-slate-400 leading-relaxed text-center">
                                        Changes are applied <span className="text-indigo-500">instantly</span> to the next session
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
