"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { format, subMonths, addMonths, getDaysInMonth, startOfMonth, getDay } from 'date-fns'

interface StudyData {
    [date: string]: number // date -> hours studied
}

export function StudyCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [studyData, setStudyData] = useState<StudyData>({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchStudyData()
    }, [currentDate])

    const fetchStudyData = async () => {
        setIsLoading(true)
        try {
            // Get the month range
            const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd')
            const endDate = format(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), 'yyyy-MM-dd')
            
            const res = await fetch(`/api/analytics?startDate=${startDate}&endDate=${endDate}`)
            const data = await res.json()
            
            if (data.success && data.data?.dailyActivity) {
                const dataMap: StudyData = {}
                data.data.dailyActivity.forEach((day: any) => {
                    const hours = Math.round((day.focus / 60) * 10) / 10
                    dataMap[day.name] = hours
                })
                setStudyData(dataMap)
            }
        } catch (e) {
            toast.error('Failed to load study calendar')
        } finally {
            setIsLoading(false)
        }
    }

    const getDaysArray = () => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const daysInMonth = getDaysInMonth(currentDate)
        const firstDayOfMonth = getDay(startOfMonth(currentDate))
        
        const days: (number | null)[] = []
        
        // Add empty slots for days before the month starts
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null)
        }
        
        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i)
        }
        
        return days
    }

    const getIntensityColor = (hours: number) => {
        if (hours === 0) return 'bg-slate-100 dark:bg-slate-900'
        if (hours < 1) return 'bg-indigo-200 dark:bg-indigo-900'
        if (hours < 2) return 'bg-indigo-300 dark:bg-indigo-800'
        if (hours < 3) return 'bg-indigo-400 dark:bg-indigo-700'
        return 'bg-indigo-600 dark:bg-indigo-600'
    }

    const getTodayDate = () => {
        const today = new Date()
        return format(today, 'yyyy-MM-dd')
    }

    const days = getDaysArray()
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
        <Card className="rounded-[2rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-xl">
            <CardHeader className="px-0 pt-0 pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Study Heatmap
                        </CardTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Hours studied each day
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-32 text-center">
                            {format(currentDate, 'MMMM yyyy')}
                        </span>
                        <button
                            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-0">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500/20 border-t-indigo-500"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Day labels */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {dayLabels.map(day => (
                                <div
                                    key={day}
                                    className="h-8 flex items-center justify-center text-xs font-semibold text-slate-500 dark:text-slate-400"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {days.map((day, idx) => {
                                if (day === null) {
                                    return (
                                        <div
                                            key={`empty-${idx}`}
                                            className="aspect-square"
                                        />
                                    )
                                }

                                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                                const dateStr = format(date, 'yyyy-MM-dd')
                                const hours = studyData[dateStr] || 0
                                const isToday = dateStr === getTodayDate()

                                return (
                                    <div
                                        key={day}
                                        className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold cursor-default transition-all hover:scale-110 hover:shadow-lg group relative ${getIntensityColor(hours)} ${isToday ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-950' : ''}`}
                                        title={`${dateStr}: ${hours}h studied`}
                                    >
                                        <span className={hours > 0 ? 'text-white dark:text-white' : 'text-slate-500 dark:text-slate-500'}>
                                            {day}
                                        </span>
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                            {hours}h
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Less</span>
                            <div className="flex gap-1">
                                <div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-900"></div>
                                <div className="w-3 h-3 rounded bg-indigo-200 dark:bg-indigo-900"></div>
                                <div className="w-3 h-3 rounded bg-indigo-300 dark:bg-indigo-800"></div>
                                <div className="w-3 h-3 rounded bg-indigo-400 dark:bg-indigo-700"></div>
                                <div className="w-3 h-3 rounded bg-indigo-600 dark:bg-indigo-600"></div>
                            </div>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">More</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
