"use client"

import { useState, useEffect, useMemo } from 'react'
import { History as HistoryIcon, Search, Calendar, Filter, Clock, BookOpen, ExternalLink, Download, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { toast } from 'sonner'

export default function HistoryPage() {
    const [sessions, setSessions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/sessions')
            const data = await response.json()
            if (data.success) {
                setSessions(data.data)
            }
        } catch (e) {
            toast.error('Failed to load history')
        } finally {
            setLoading(false)
        }
    }

    const filteredSessions = useMemo(() => {
        return sessions.filter(session => {
            const matchesSearch = session.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                session.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                !searchQuery
            const matchesStatus = statusFilter === 'ALL' || session.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [sessions, searchQuery, statusFilter])

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic leading-none">
                        Study <span className="text-indigo-500">History</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium">
                        Your complete academic track record and focus logs.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => toast.info('Export functionality coming soon!')}
                        variant="outline"
                        className="rounded-2xl gap-2 font-black text-xs uppercase tracking-widest border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 h-12 px-6 shadow-lg shadow-indigo-500/5 active:scale-95 transition-all"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </Button>
                </div>
            </div>

            <Card className="rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/50 backdrop-blur-xl overflow-hidden shadow-2xl shadow-indigo-500/5">
                <CardHeader className="p-8 lg:p-10 border-b border-slate-100 dark:border-slate-900 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="relative w-full max-w-md group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find by subject or notes..."
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-transparent focus:border-indigo-500/20 rounded-[1.5rem] py-4 pl-14 pr-12 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-14 px-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest outline-none focus:border-indigo-500/30 transition-all cursor-pointer appearance-none"
                        >
                            <option value="ALL">All Status</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="PARTIAL">Partial</option>
                        </select>
                        <Button variant="ghost" className="rounded-2xl h-14 w-14 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center p-0">
                            <Calendar className="w-5 h-5 text-slate-500" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-900/30">
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Timeline</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Academic Focus</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Energy Spent</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Efficiency</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Ref</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-900 font-medium">
                                {loading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="p-8"><div className="h-6 bg-slate-100 dark:bg-slate-900 rounded-2xl w-full"></div></td>
                                        </tr>
                                    ))
                                ) : filteredSessions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-32 text-center h-full">
                                            <div className="flex flex-col items-center gap-4 opacity-40">
                                                <HistoryIcon className="w-16 h-16 text-slate-300" />
                                                <p className="font-black uppercase tracking-widest text-sm text-slate-400">Inventory Empty</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSessions.map((session) => (
                                        <tr key={session.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-all border-l-4 border-l-transparent hover:border-l-indigo-500">
                                            <td className="p-8">
                                                <p className="text-base font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">{format(new Date(session.startTime || session.createdAt), 'MMM dd, yyyy')}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">{format(new Date(session.startTime || session.createdAt), 'HH:mm a')}</p>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(var(--color),0.5)]" style={{ backgroundColor: session.subject?.color || '#cbd5e1' }} />
                                                    <div>
                                                        <span className="text-base font-black uppercase tracking-tighter italic">{session.subject?.name || 'Self Study'}</span>
                                                        {session.notes && <p className="text-[10px] text-slate-500 font-medium mt-1 truncate max-w-[200px]">{session.notes}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="w-4 h-4 text-indigo-500 opacity-50" />
                                                    <span className="text-lg tabular-nums font-black italic tracking-tighter">{session.duration}<span className="text-xs uppercase text-slate-400 not-italic ml-1">min</span></span>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl ${session.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                                                    }`}>
                                                    {session.status}
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <Button
                                                    onClick={() => toast.info('Detailed session view coming soon!')}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="rounded-[1.2rem] h-12 w-12 p-0 text-slate-300 hover:text-indigo-500 hover:bg-white dark:hover:bg-slate-900 shadow-sm transition-all active:scale-90"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
