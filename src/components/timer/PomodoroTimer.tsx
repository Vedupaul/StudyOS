"use client"

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, StopCircle, Coffee, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TimerProps {
    onComplete?: (session: { duration: number, taskId?: string }) => void
}

export function PomodoroTimer({ onComplete }: TimerProps) {
    const [mode, setMode] = useState<'work' | 'break'>('work')
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)
    const [totalSeconds, setTotalSeconds] = useState(0)

    const workDuration = 25 * 60
    const breakDuration = 5 * 60

    const toggleTimer = () => setIsActive(!isActive)

    const resetTimer = useCallback(() => {
        setIsActive(false)
        setTimeLeft(mode === 'work' ? workDuration : breakDuration)
        setTotalSeconds(0)
    }, [mode, workDuration, breakDuration])

    const switchMode = useCallback(() => {
        const newMode = mode === 'work' ? 'break' : 'work'
        setMode(newMode)
        setTimeLeft(newMode === 'work' ? workDuration : breakDuration)
        setIsActive(false)
    }, [mode, workDuration, breakDuration])

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
                if (mode === 'work') {
                    setTotalSeconds((prev) => prev + 1)
                }
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
            // Play sound here
            if (mode === 'work' && onComplete) {
                onComplete({ duration: Math.floor(totalSeconds / 60) })
            }
            switchMode()
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, timeLeft, mode, onComplete, totalSeconds, switchMode])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const progress = ((mode === 'work' ? workDuration : breakDuration) - timeLeft) / (mode === 'work' ? workDuration : breakDuration) * 100

    return (
        <div className="flex flex-col items-center space-y-8">
            <div className="relative w-80 h-80">
                <svg className="w-full h-full -rotate-90">
                    <circle
                        cx="160"
                        cy="160"
                        r="150"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-slate-200 dark:text-slate-800"
                    />
                    <circle
                        cx="160"
                        cy="160"
                        r="150"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 150}
                        strokeDashoffset={2 * Math.PI * 150 * (1 - progress / 100)}
                        strokeLinecap="round"
                        className={cn(
                            "transition-all duration-1000",
                            mode === 'work' ? "text-indigo-500" : "text-emerald-500"
                        )}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-2">
                        {mode === 'work' ? <Brain className="w-5 h-5 text-indigo-500" /> : <Coffee className="w-5 h-5 text-emerald-500" />}
                        <span className="text-sm font-bold uppercase tracking-widest text-slate-500">
                            {mode === 'work' ? 'Focus Session' : 'Short Break'}
                        </span>
                    </div>
                    <span className="text-7xl font-black tracking-tighter tabular-nums text-slate-900 dark:text-white">
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    size="lg"
                    variant="outline"
                    onClick={resetTimer}
                    className="rounded-full w-14 h-14 p-0 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                    <RotateCcw className="w-6 h-6" />
                </Button>

                <Button
                    size="lg"
                    onClick={toggleTimer}
                    className={cn(
                        "rounded-full w-20 h-20 p-0 shadow-xl transition-all duration-300 transform hover:scale-105",
                        isActive
                            ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white"
                            : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/30"
                    )}
                >
                    {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </Button>

                <Button
                    size="lg"
                    variant="outline"
                    onClick={switchMode}
                    className="rounded-full w-14 h-14 p-0 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                    <StopCircle className="w-6 h-6" />
                </Button>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => { setMode('work'); setTimeLeft(workDuration); setIsActive(false); }}
                    className={cn(
                        "px-4 py-2 rounded-full text-xs font-bold transition-all",
                        mode === 'work' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : "bg-slate-100 dark:bg-slate-900 text-slate-500"
                    )}
                >
                    Focus (25m)
                </button>
                <button
                    onClick={() => { setMode('break'); setTimeLeft(breakDuration); setIsActive(false); }}
                    className={cn(
                        "px-4 py-2 rounded-full text-xs font-bold transition-all",
                        mode === 'break' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-slate-100 dark:bg-slate-900 text-slate-500"
                    )}
                >
                    Short Break (5m)
                </button>
            </div>
        </div>
    )
}
