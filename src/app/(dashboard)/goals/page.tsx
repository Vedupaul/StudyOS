"use client"

import { useState, useEffect } from 'react'
import {
    Target,
    TrendingUp,
    Calendar,
    Trophy,
    Plus,
    ArrowUpRight,
    BookOpen,
    X,
    Target as TargetIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function GoalsPage() {
    const [activeTab, setActiveTab] = useState('weekly')
    const [goals, setGoals] = useState<any[]>([])
    const [subjects, setSubjects] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)

    // New goal state
    const [newGoal, setNewGoal] = useState({
        subjectId: '',
        targetHours: 10,
        weekStartDate: format(new Date(), 'yyyy-MM-dd'),
    })

    useEffect(() => {
        fetchGoals()
        fetchSubjects()
    }, [activeTab])

    const fetchGoals = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/goals')
            const data = await res.json()
            if (data.success) {
                // Filter based on week/month if needed, or just show all for now
                setGoals(data.data)
            }
        } catch (e) {
            toast.error('Failed to load goals')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSubjects = async () => {
        try {
            const res = await fetch('/api/subjects')
            const data = await res.json()
            if (data.success) setSubjects(data.data)
        } catch (e) { }
    }

    const handleCreateGoal = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const weekEndDate = new Date(newGoal.weekStartDate)
            weekEndDate.setDate(weekEndDate.getDate() + 6)

            const res = await fetch('/api/goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subjectId: newGoal.subjectId || undefined,
                    targetMinutes: newGoal.targetHours * 60,
                    weekStartDate: newGoal.weekStartDate,
                    weekEndDate: format(weekEndDate, 'yyyy-MM-dd'),
                })
            })

            if (res.ok) {
                toast.success('Goal created!')
                setShowModal(false)
                setNewGoal({ subjectId: '', targetHours: 10, weekStartDate: format(new Date(), 'yyyy-MM-dd') })
                fetchGoals()
            }
        } catch (e) {
            toast.error('Failed to create goal')
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
                        Study <span className="text-indigo-500">Goals</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
                        Set and track your weekly and monthly study milestones.
                    </p>
                </div>
                <div className="flex gap-2 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setActiveTab('weekly')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all uppercase tracking-tighter ${activeTab === 'weekly' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-indigo-500'}`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setActiveTab('monthly')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all uppercase tracking-tighter ${activeTab === 'monthly' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-indigo-500'}`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {isLoading ? (
                        <div className="bg-white dark:bg-slate-950/50 rounded-[3rem] p-40 border border-slate-200 dark:border-slate-800 flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-500"></div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {goals.map((goal) => {
                                const subject = subjects.find(s => s.id === goal.subjectId)
                                const progress = Math.min(Math.round((goal.actualMinutes || 0) / goal.targetMinutes * 100), 100)
                                return (
                                    <Card key={goal.id} className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all outline outline-2 outline-transparent hover:outline-indigo-500/10 active:scale-[0.98]">
                                        <CardHeader className="pb-2 p-8">
                                            <div className="flex justify-between items-start">
                                                <div className="bg-indigo-500/10 p-3 rounded-2xl">
                                                    <BookOpen className="w-6 h-6 text-indigo-500" />
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${progress >= 100 ? 'bg-emerald-500/10 text-emerald-500' :
                                                        progress > 50 ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                                                    }`}>
                                                    {progress >= 100 ? 'COMPLETED' : progress > 0 ? 'IN PROGRESS' : 'NOT STARTED'}
                                                </span>
                                            </div>
                                            <CardTitle className="mt-6 text-2xl font-black italic tracking-tighter uppercase">{subject?.name || 'General Study'}</CardTitle>
                                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-500">Target: {goal.targetMinutes / 60} hours per week</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-4 p-8">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className="text-4xl font-black italic tracking-tighter">{progress}%</span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Actual: {Math.round((goal.actualMinutes || 0) / 60)}h</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-slate-900 h-3 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-indigo-500 h-full transition-all duration-1000 group-hover:bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                            <button
                                onClick={() => setShowModal(true)}
                                className="rounded-[2.5rem] border-4 border-dashed border-slate-200 dark:border-slate-800 p-10 flex flex-col items-center justify-center gap-6 group hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-all active:scale-95"
                            >
                                <div className="w-16 h-16 rounded-[1.5rem] border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:rotate-12 transition-all shadow-xl group-hover:shadow-indigo-600/30">
                                    <Plus className="w-8 h-8 text-slate-300 group-hover:text-white" />
                                </div>
                                <div className="text-center">
                                    <p className="font-black italic tracking-tighter text-2xl text-slate-400 group-hover:text-indigo-500 uppercase">Create New Goal</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Challenge yourself today</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="rounded-[3rem] bg-slate-900 text-white p-10 relative overflow-hidden shadow-2xl">
                        <Trophy className="absolute -right-8 -bottom-8 w-48 h-48 text-indigo-500/10 rotate-12" />
                        <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2 leading-none">Milestones</h3>
                        <p className="text-slate-400 text-sm mb-8 font-medium">Badges you've earned while crushing goals.</p>
                        <div className="space-y-5">
                            <div className="flex items-center gap-5 bg-white/5 p-5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold italic tracking-tighter uppercase leading-none">Consistency King</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Study 7 days in a row</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 bg-white/5 p-5 rounded-[2rem] border border-white/5 opacity-40 grayscale translate-x-2">
                                <div className="w-12 h-12 rounded-2xl bg-slate-500/20 flex items-center justify-center text-slate-400">
                                    <TargetCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold italic tracking-tighter uppercase leading-none text-slate-400">Exam Crusher</p>
                                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">Reach monthly goal</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[3rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 backdrop-blur-xl p-10 shadow-xl">
                        <h3 className="text-lg font-black uppercase italic tracking-tight mb-8 flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-indigo-500" /> Performance
                        </h3>
                        <div className="space-y-8">
                            <div className="flex justify-between items-center group">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Weekly Growth</span>
                                <span className="text-emerald-500 flex items-center text-base font-black italic group-hover:scale-110 transition-transform"><ArrowUpRight className="w-4 h-4 mr-1" /> +12%</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Focus Score</span>
                                <span className="text-emerald-500 flex items-center text-base font-black italic group-hover:scale-110 transition-transform"><ArrowUpRight className="w-4 h-4 mr-1" /> +0.4</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Create Goal Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/40 animate-in fade-in duration-300">
                    <Card className="w-full max-w-lg rounded-[3rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-10 shadow-3xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Set <span className="text-indigo-500">Goal</span></h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-indigo-500 transition-all hover:rotate-90"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateGoal} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Subject Focus</label>
                                <select
                                    value={newGoal.subjectId}
                                    onChange={e => setNewGoal({ ...newGoal, subjectId: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-3xl py-4 px-6 text-sm font-bold focus:border-indigo-500 transition-all outline-none appearance-none"
                                >
                                    <option value="">General Study</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Target (Hours/Week)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={newGoal.targetHours}
                                        onChange={e => setNewGoal({ ...newGoal, targetHours: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-3xl py-4 px-6 text-sm font-bold focus:border-indigo-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Start From</label>
                                    <input
                                        type="date"
                                        required
                                        value={newGoal.weekStartDate}
                                        onChange={e => setNewGoal({ ...newGoal, weekStartDate: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-3xl py-4 px-6 text-sm font-bold focus:border-indigo-500 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full h-16 rounded-3xl bg-indigo-600 hover:bg-indigo-500 text-white font-black italic uppercase tracking-tight text-lg shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
                                    Create Target
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    )
}

function TargetCircle({ className }: { className?: string }) {
    return <TargetIcon className={className} />
}
