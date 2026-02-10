"use client"

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Calendar, Clock, BookOpen, ArrowUpRight, ArrowDownRight, LayoutGrid } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/analytics')
            const data = await res.json()
            if (data.success) {
                setStats(data.data)
            }
        } catch (e) {
            toast.error('Failed to load performance data')
        } finally {
            setIsLoading(false)
        }
    }

    const summaryItems = [
        { label: 'Total Time', value: stats ? `${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m` : '0h 0m', trend: '+14%', up: true, icon: Clock, color: 'text-indigo-500' },
        { label: 'Avg Session', value: stats ? `${Math.round(stats.totalMinutes / (stats.sessionCount || 1))} min` : '0 min', trend: '-2%', up: false, icon: Calendar, color: 'text-purple-500' },
        { label: 'Focus Score', value: '4.2/5', trend: '+0.8', up: true, icon: TrendingUp, color: 'text-emerald-500' },
        { label: 'Active Sessions', value: stats ? `${stats.sessionCount}` : '0', trend: 'Stable', up: true, icon: LayoutGrid, color: 'text-orange-500' },
    ]

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                        Performance <span className="text-indigo-500">Analytics</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium">
                        Detailed insights into your study habits and productivity trends.
                    </p>
                </div>
                <div className="flex gap-2 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <Button variant="ghost" size="sm" className="rounded-xl px-4 font-bold text-xs uppercase tracking-tighter">7 Days</Button>
                    <Button variant="ghost" size="sm" className="rounded-xl px-4 font-bold text-xs uppercase tracking-tighter bg-white dark:bg-slate-800 shadow-sm text-indigo-500">30 Days</Button>
                    <Button variant="ghost" size="sm" className="rounded-xl px-4 font-bold text-xs uppercase tracking-tighter">Custom</Button>
                </div>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryItems.map((item, i) => (
                    <Card key={i} className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 flex flex-col justify-between group overflow-hidden relative shadow-xl hover:shadow-2xl transition-all active:scale-95">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] font-black italic flex items-center px-2 py-1 rounded-lg ${item.up ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {item.up ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                    {item.trend}
                                </span>
                            </div>
                            <p className="text-3xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase leading-none">{item.value}</p>
                            <p className="text-[10px] font-black text-slate-400 mt-4 tracking-widest uppercase">{item.label}</p>
                        </div>
                        <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500/5 -mr-12 -mb-12 rounded-full z-0 group-hover:scale-125 transition-transform duration-1000 blur-2xl"></div>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 rounded-[3.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 backdrop-blur-xl p-10 flex flex-col items-center justify-center text-center h-[550px] shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -mr-40 -mt-40 group-hover:scale-110 transition-transform duration-1000"></div>

                    {isLoading ? (
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-500"></div>
                    ) : (
                        <>
                            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-full mb-8 shadow-inner">
                                <BarChart3 className="w-20 h-20 text-indigo-500/40" />
                            </div>
                            <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-4 leading-none">Activity<br /><span className="text-indigo-500">Visualizer</span></h3>
                            <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed">
                                Complete {Math.max(0, 10 - (stats?.sessionCount || 0))} more blocks to unlock your real-time productivity heatmap and subject-wise study analysis.
                            </p>
                            <div className="mt-12 flex gap-4 text-[10px] font-black uppercase tracking-widest">
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl transition-all hover:bg-indigo-500 hover:text-white cursor-help">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" /> Maths
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl transition-all hover:bg-purple-500 hover:text-white cursor-help">
                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" /> Dev
                                </div>
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl transition-all hover:bg-emerald-500 hover:text-white cursor-help">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> Logic
                                </div>
                            </div>
                        </>
                    )}
                </Card>

                <div className="space-y-6">
                    <Card className="rounded-[3rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 backdrop-blur-xl p-10 shadow-xl overflow-hidden relative">
                        <div className="absolute -left-10 -top-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
                        <h3 className="text-xl font-black italic tracking-tighter uppercase mb-8 leading-none">Productive<br /><span className="text-indigo-500">Windows</span></h3>
                        <div className="space-y-8">
                            {[
                                { time: 'Morning', val: 85, color: 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' },
                                { time: 'Afternoon', val: 45, color: 'bg-indigo-400 opacity-60' },
                                { time: 'Evening', val: 65, color: 'bg-indigo-600' },
                                { time: 'Night', val: 25, color: 'bg-slate-800 dark:bg-slate-300' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-3 group">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-500 transition-colors">
                                        <span>{item.time}</span>
                                        <span>{item.val}% Consistency</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-900 h-2.5 rounded-full overflow-hidden">
                                        <div className={`${item.color} h-full transition-all duration-1000 group-hover:scale-y-125`} style={{ width: `${item.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-[3rem] bg-indigo-600 p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                        <div className="relative z-10">
                            <BookOpen className="w-10 h-10 mb-6 drop-shadow-lg" />
                            <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-3 leading-tight">Insight of <br />the Week</h3>
                            <p className="text-sm font-medium leading-relaxed italic opacity-90 border-l-2 border-white/20 pl-4 py-2">
                                "Your concentration peaks during early morning blocks. Consider moving high-difficulty subjects like Logic or Maths before 10:00 AM."
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
