"use client"

import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    User,
    Smartphone,
    Monitor,
    Database,
    Moon,
    Check,
    Save,
    Palette
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Preferences state
    const [prefs, setPrefs] = useState({
        autoStartPomodoros: true,
        autoStartBreaks: false,
        pomodoroDuration: 25,
        shortBreakDuration: 5,
        notificationsEnabled: true
    })

    useEffect(() => {
        setMounted(true)
        fetchPreferences()
    }, [])

    const fetchPreferences = async () => {
        try {
            const res = await fetch('/api/preferences')
            const data = await res.json()
            if (data.success && data.data) {
                setPrefs(data.data)
            }
        } catch (e) { }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/preferences', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prefs)
            })
            if (res.ok) {
                toast.success('App settings saved!')
            }
        } catch (e) {
            toast.error('Failed to save settings')
        } finally {
            setIsSaving(false)
        }
    }

    const togglePref = (key: keyof typeof prefs) => {
        setPrefs(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    if (!mounted) return null

    const sections = [
        { title: 'Profile', desc: 'Manage your academy profile and info', icon: User },
        { title: 'Preferences', desc: 'Sessions, timer & study workflow', icon: SettingsIcon },
        { title: 'Appearance', desc: 'Custom visuals, themes and more', icon: Palette },
        { title: 'Notifications', desc: 'Manage alerts and reminders', icon: Bell },
        { title: 'Security', desc: 'Manage passwords and MFA', icon: Shield },
        { title: 'Data', desc: 'Export or delete your information', icon: Database },
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
                        App <span className="text-indigo-500">Settings</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
                        Customize StudyOS to match your learning style.
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((section, i) => (
                        <Card key={i} className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all cursor-pointer active:scale-95 border-2 border-transparent hover:border-indigo-500/20">
                            <div className="flex flex-col gap-5">
                                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl group-hover:shadow-indigo-600/30">
                                    <section.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black group-hover:text-indigo-500 transition-colors uppercase italic tracking-tighter leading-none">{section.title}</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2">{section.desc}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="rounded-[3rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-10 lg:p-14 overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 -mr-20 -mt-20 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row gap-12 lg:gap-20">
                        <div className="md:w-1/3">
                            <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-6 leading-none">System<br /><span className="text-indigo-500">Preferences</span></h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">Quickly toggle common settings across your unified dashboard to optimize your workflow.</p>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Theme Selection</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setTheme('light')}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${theme === 'light' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}
                                    >
                                        <Monitor className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}
                                    >
                                        <Moon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-10 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-black italic tracking-tighter uppercase text-slate-900 dark:text-white flex items-center gap-2">
                                        <Monitor className="w-5 h-5 text-indigo-500" /> Auto-Start Sessions
                                    </p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Start next focus block automatically</p>
                                </div>
                                <button
                                    onClick={() => togglePref('autoStartPomodoros')}
                                    className={`w-16 h-9 rounded-full transition-all p-1.5 flex items-center ${prefs.autoStartPomodoros ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'}`}
                                >
                                    <div className="w-6 h-6 rounded-full bg-white shadow-xl"></div>
                                </button>
                            </div>

                            <hr className="border-slate-100 dark:border-slate-900" />

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-black italic tracking-tighter uppercase text-slate-900 dark:text-white flex items-center gap-2">
                                        <Bell className="w-5 h-5 text-indigo-500" /> Study Notifications
                                    </p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Receive alerts for breaks and goals</p>
                                </div>
                                <button
                                    onClick={() => togglePref('notificationsEnabled')}
                                    className={`w-16 h-9 rounded-full transition-all p-1.5 flex items-center ${prefs.notificationsEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'}`}
                                >
                                    <div className="w-6 h-6 rounded-full bg-white shadow-xl"></div>
                                </button>
                            </div>

                            <hr className="border-slate-100 dark:border-slate-900" />

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-black italic tracking-tighter uppercase text-slate-900 dark:text-white flex items-center gap-2">
                                        <Smartphone className="w-5 h-5 text-indigo-500" /> Mobile Sync
                                    </p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Keep sessions synced across all devices</p>
                                </div>
                                <button className="w-16 h-9 rounded-full bg-slate-200 dark:bg-slate-800 p-1.5 flex justify-start items-center opacity-50 cursor-not-allowed">
                                    <div className="w-6 h-6 rounded-full bg-slate-400"></div>
                                </button>
                            </div>

                            <div className="pt-8">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 rounded-[1.5rem] h-16 uppercase italic tracking-tighter shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all text-xl gap-3"
                                >
                                    {isSaving ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-6 h-6" />}
                                    Commit Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
