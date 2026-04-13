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
    Save,
    Palette,
    Trash2,
    Plus,
    X,
    Eye,
    EyeOff,
    Lock,
    CheckCircle2
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'
import { useSession } from 'next-auth/react'

/* ─── Reusable Modal Shell ─── */
function Modal({ open, onClose, title, children }: { open: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
    useEffect(() => {
        const handle = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', handle)
        return () => window.removeEventListener('keydown', handle)
    }, [onClose])
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl w-full max-w-lg p-10 relative border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900">
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">{title}</h2>
                {children}
            </div>
        </div>
    )
}

/* ─── Profile Modal ─── */
function ProfileModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    const { data: session, update } = useSession()
    const [name, setName] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (open && session?.user?.name) setName(session.user.name)
    }, [open, session])

    const handleSave = async () => {
        if (!name.trim()) return
        setIsSaving(true)
        try {
            const res = await fetch('/api/user', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim() })
            })
            const data = await res.json()
            if (data.success) {
                await update({ name: name.trim() })
                toast.success('Profile updated!')
                onClose()
            } else {
                toast.error(data.message || 'Failed to update profile')
            }
        } catch { toast.error('Failed to update profile') }
        finally { setIsSaving(false) }
    }

    return (
        <Modal open={open} onClose={onClose} title="Edit Profile">
            <div className="space-y-6">
                <div>
                    <label className="text-xs font-bold tracking-widest text-slate-500 mb-2 block">DISPLAY NAME</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSave()}
                        className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 px-5 text-sm font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Your name"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold tracking-widest text-slate-500 mb-2 block">EMAIL ADDRESS</label>
                    <input
                        value={session?.user?.email || ''}
                        readOnly
                        className="w-full h-12 rounded-2xl bg-slate-100 dark:bg-slate-900/50 px-5 text-sm font-semibold text-slate-400 border border-slate-200 dark:border-slate-800 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Email cannot be changed.</p>
                </div>
                <div className="flex gap-3 pt-2">
                    <Button onClick={onClose} variant="outline" className="flex-1 rounded-2xl h-12 font-semibold border-slate-200 dark:border-slate-800">Cancel</Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !name.trim()}
                        className="flex-1 rounded-2xl h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20"
                    >
                        {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

/* ─── Notifications Modal ─── */
function NotificationsModal({ open, onClose, prefs, onChange, onSave }: any) {
    const [isSaving, setIsSaving] = useState(false)

    const items = [
        { key: 'notificationsEnabled', label: 'Study Alerts', desc: 'Break reminders and session ends' },
        { key: 'autoStartBreaks', label: 'Auto-Start Breaks', desc: 'Begin break timer automatically' },
        { key: 'autoStartPomodoros', label: 'Auto-Start Sessions', desc: 'Start next focus block automatically' },
    ]

    const handleSave = async () => {
        setIsSaving(true)
        await onSave()
        setIsSaving(false)
        onClose()
    }

    return (
        <Modal open={open} onClose={onClose} title="Notification Settings">
            <div className="space-y-4">
                {items.map(item => (
                    <div key={item.key} className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-900 last:border-0">
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                        <button
                            onClick={() => onChange(item.key)}
                            className={`w-14 h-8 rounded-full transition-all duration-300 p-1 flex items-center ${prefs[item.key] ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'}`}
                        >
                            <div className="w-6 h-6 rounded-full bg-white shadow-md" />
                        </button>
                    </div>
                ))}
                <div className="flex gap-3 pt-4">
                    <Button onClick={onClose} variant="outline" className="flex-1 rounded-2xl h-12 font-semibold border-slate-200 dark:border-slate-800">Cancel</Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 rounded-2xl h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20"
                    >
                        {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Save'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

/* ─── Security Modal ─── */
function SecurityModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    const [current, setCurrent] = useState('')
    const [next, setNext] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNext, setShowNext] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const reset = () => { setCurrent(''); setNext(''); setConfirm('') }

    const handleSave = async () => {
        if (!current || !next || !confirm) return toast.error('Please fill all fields')
        if (next !== confirm) return toast.error('New passwords do not match')
        if (next.length < 8) return toast.error('Password must be at least 8 characters')
        setIsSaving(true)
        try {
            const res = await fetch('/api/user/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword: current, newPassword: next })
            })
            const data = await res.json()
            if (data.success) {
                toast.success('Password changed successfully!')
                reset()
                onClose()
            } else {
                toast.error(data.message || 'Failed to change password')
            }
        } catch { toast.error('Failed to change password') }
        finally { setIsSaving(false) }
    }

    const strength = next.length === 0 ? 0 : next.length < 8 ? 1 : next.length < 12 ? 2 : 3
    const strengthLabels = ['', 'Weak', 'Good', 'Strong']
    const strengthColors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500']

    return (
        <Modal open={open} onClose={() => { reset(); onClose() }} title="Change Password">
            <div className="space-y-5">
                <div>
                    <label className="text-xs font-bold tracking-widest text-slate-500 mb-2 block">CURRENT PASSWORD</label>
                    <div className="relative">
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            value={current}
                            onChange={e => setCurrent(e.target.value)}
                            className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 px-5 pr-12 text-sm font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter current password"
                        />
                        <button onClick={() => setShowCurrent(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold tracking-widest text-slate-500 mb-2 block">NEW PASSWORD</label>
                    <div className="relative">
                        <input
                            type={showNext ? 'text' : 'password'}
                            value={next}
                            onChange={e => setNext(e.target.value)}
                            className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 px-5 pr-12 text-sm font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Min. 8 characters"
                        />
                        <button onClick={() => setShowNext(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {next.length > 0 && (
                        <div className="mt-2 flex items-center gap-3">
                            <div className="flex gap-1 flex-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-slate-200 dark:bg-slate-800'}`} />
                                ))}
                            </div>
                            <span className={`text-[10px] font-bold ${strength === 1 ? 'text-rose-500' : strength === 2 ? 'text-amber-500' : 'text-emerald-500'}`}>{strengthLabels[strength]}</span>
                        </div>
                    )}
                </div>
                <div>
                    <label className="text-xs font-bold tracking-widest text-slate-500 mb-2 block">CONFIRM NEW PASSWORD</label>
                    <input
                        type="password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSave()}
                        className={`w-full h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 px-5 text-sm font-semibold text-slate-900 dark:text-white border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${confirm && next !== confirm ? 'border-rose-400' : 'border-slate-200 dark:border-slate-800'}`}
                        placeholder="Repeat new password"
                    />
                    {confirm && next !== confirm && <p className="text-[10px] text-rose-500 mt-1 ml-1">Passwords do not match</p>}
                </div>
                <div className="flex gap-3 pt-2">
                    <Button onClick={() => { reset(); onClose() }} variant="outline" className="flex-1 rounded-2xl h-12 font-semibold border-slate-200 dark:border-slate-800">Cancel</Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !current || !next || !confirm}
                        className="flex-1 rounded-2xl h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20 gap-2"
                    >
                        {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><Lock className="w-4 h-4" /> Change Password</>}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

/* ─── Preferences Modal ─── */
function PreferencesModal({ open, onClose, prefs, onChange, onSave }: any) {
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        await onSave()
        setIsSaving(false)
        onClose()
    }

    const DurationControl = ({ label, desc, field, min, max }: { label: string, desc: string, field: string, min: number, max: number }) => (
        <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-900 last:border-0">
            <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onChange(field, Math.max(min, (prefs[field] || min) - 1))}
                    className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 transition-all"
                >
                    −
                </button>
                <span className="w-10 text-center font-bold text-slate-900 dark:text-white text-sm">{prefs[field] || min}m</span>
                <button
                    onClick={() => onChange(field, Math.min(max, (prefs[field] || min) + 1))}
                    className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 transition-all"
                >
                    +
                </button>
            </div>
        </div>
    )

    return (
        <Modal open={open} onClose={onClose} title="Study Preferences">
            <div className="space-y-2">
                <DurationControl label="Pomodoro Duration" desc="Length of each focus block" field="pomodoroDuration" min={5} max={90} />
                <DurationControl label="Short Break" desc="Rest between focus blocks" field="shortBreakDuration" min={1} max={30} />
                <DurationControl label="Long Break" desc="Extended rest after 4 sessions" field="longBreakDuration" min={5} max={60} />
                <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-900">
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">Auto-Start Sessions</p>
                        <p className="text-xs text-slate-500 mt-0.5">Begin next focus block automatically</p>
                    </div>
                    <button
                        onClick={() => onChange('autoStartPomodoros', !prefs.autoStartPomodoros)}
                        className={`w-14 h-8 rounded-full transition-all duration-300 p-1 flex items-center ${prefs.autoStartPomodoros ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'}`}
                    >
                        <div className="w-6 h-6 rounded-full bg-white shadow-md" />
                    </button>
                </div>
                <div className="flex items-center justify-between py-4">
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">Auto-Start Breaks</p>
                        <p className="text-xs text-slate-500 mt-0.5">Begin break timer automatically</p>
                    </div>
                    <button
                        onClick={() => onChange('autoStartBreaks', !prefs.autoStartBreaks)}
                        className={`w-14 h-8 rounded-full transition-all duration-300 p-1 flex items-center ${prefs.autoStartBreaks ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'}`}
                    >
                        <div className="w-6 h-6 rounded-full bg-white shadow-md" />
                    </button>
                </div>
                <div className="flex gap-3 pt-4">
                    <Button onClick={onClose} variant="outline" className="flex-1 rounded-2xl h-12 font-semibold border-slate-200 dark:border-slate-800">Cancel</Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 rounded-2xl h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20"
                    >
                        {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Save Preferences'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

/* ─── Main Settings Page ─── */
export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [subjects, setSubjects] = useState<any[]>([])
    const [newSubject, setNewSubject] = useState('')
    const [isSavingSubject, setIsSavingSubject] = useState(false)
    const [modal, setModal] = useState<'profile' | 'preferences' | 'notifications' | 'security' | null>(null)

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
        fetchSubjects()
    }, [])

    const fetchSubjects = async () => {
        try {
            const res = await fetch('/api/subjects')
            const data = await res.json()
            if (data.success) setSubjects(data.data)
        } catch (e) { }
    }

    const handleAddSubject = async () => {
        if (!newSubject.trim()) return
        setIsSavingSubject(true)
        try {
            const res = await fetch('/api/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newSubject.trim() })
            })
            if (res.ok) { toast.success('Subject added!'); setNewSubject(''); fetchSubjects() }
            else toast.error('Failed to add subject')
        } catch { toast.error('Failed to add subject') }
        finally { setIsSavingSubject(false) }
    }

    const handleDeleteSubject = async (id: string) => {
        try {
            const res = await fetch(`/api/subjects/${id}`, { method: 'DELETE' })
            if (res.ok) { toast.success('Subject deleted!'); fetchSubjects() }
            else toast.error('Failed to delete subject')
        } catch { toast.error('Failed to delete subject') }
    }

    const fetchPreferences = async () => {
        try {
            const res = await fetch('/api/preferences')
            const data = await res.json()
            if (data.success && data.data) setPrefs(data.data)
        } catch (e) { }
    }

    const handleSavePrefs = async () => {
        setIsSaving(true)
        try {
            const res = await fetch('/api/preferences', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prefs)
            })
            if (res.ok) toast.success('Settings saved!')
            else toast.error('Failed to save settings')
        } catch { toast.error('Failed to save settings') }
        finally { setIsSaving(false) }
    }

    const togglePref = (key: string, val?: any) => {
        if (val !== undefined) {
            setPrefs(prev => ({ ...prev, [key]: val }))
        } else {
            setPrefs(prev => ({ ...prev, [key]: !(prev as any)[key] }))
        }
    }

    if (!mounted) return null

    const sections = [
        { key: 'profile', title: 'Profile', desc: 'Manage your academy profile and info', icon: User, onClick: () => setModal('profile') },
        { key: 'preferences', title: 'Preferences', desc: 'Sessions, timer & study workflow', icon: SettingsIcon, onClick: () => setModal('preferences') },
        { key: 'notifications', title: 'Notifications', desc: 'Manage alerts and reminders', icon: Bell, onClick: () => setModal('notifications') },
        { key: 'security', title: 'Security', desc: 'Manage passwords and MFA', icon: Shield, onClick: () => setModal('security') },
    ]

    return (
        <>
            {/* Modals */}
            <ProfileModal open={modal === 'profile'} onClose={() => setModal(null)} />
            <PreferencesModal open={modal === 'preferences'} onClose={() => setModal(null)} prefs={prefs} onChange={togglePref} onSave={handleSavePrefs} />
            <NotificationsModal open={modal === 'notifications'} onClose={() => setModal(null)} prefs={prefs} onChange={togglePref} onSave={handleSavePrefs} />
            <SecurityModal open={modal === 'security'} onClose={() => setModal(null)} />

            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        App <span className="text-indigo-500">Settings</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
                        Customize StudyOS to match your learning style.
                    </p>
                </div>

                <div className="grid gap-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sections.map((section) => (
                            <Card
                                key={section.key}
                                onClick={section.onClick}
                                className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all border-2 border-transparent hover:border-indigo-500/20 cursor-pointer active:scale-95"
                            >
                                <div className="flex flex-col gap-5">
                                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-400 transition-all shadow-xl group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-indigo-600/30">
                                        <section.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-semibold transition-colors tracking-tighter leading-none group-hover:text-indigo-500">{section.title}</h3>
                                            <span className="text-[9px] font-bold tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">LIVE</span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-bold tracking-widest mt-2">{section.desc}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* System Preferences */}
                    <Card className="rounded-[3rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-10 lg:p-14 overflow-hidden relative shadow-2xl">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 -mr-20 -mt-20 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex flex-col md:flex-row gap-12 lg:gap-20">
                            <div className="md:w-1/3">
                                <h3 className="text-3xl font-semibold tracking-tighter mb-6 leading-none">System<br /><span className="text-indigo-500">Preferences</span></h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">Quickly toggle common settings across your unified dashboard to optimize your workflow.</p>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-semibold tracking-widest text-indigo-500">Theme Selection</p>
                                    <div className="flex gap-3">
                                        <button onClick={() => setTheme('light')} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${theme === 'light' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}>
                                            <Monitor className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => setTheme('dark')} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}`}>
                                            <Moon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-semibold tracking-tighter text-slate-900 dark:text-white flex items-center gap-2"><Monitor className="w-5 h-5 text-indigo-500" /> Auto-Start Sessions</p>
                                        <p className="text-xs font-bold text-slate-500 tracking-widest mt-1">Start next focus block automatically</p>
                                    </div>
                                    <button onClick={() => togglePref('autoStartPomodoros')} className={`w-16 h-9 rounded-full transition-all p-1.5 flex items-center ${prefs.autoStartPomodoros ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'}`}>
                                        <div className="w-6 h-6 rounded-full bg-white shadow-xl" />
                                    </button>
                                </div>
                                <hr className="border-slate-100 dark:border-slate-900" />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-semibold tracking-tighter text-slate-900 dark:text-white flex items-center gap-2"><Bell className="w-5 h-5 text-indigo-500" /> Study Notifications</p>
                                        <p className="text-xs font-bold text-slate-500 tracking-widest mt-1">Receive alerts for breaks and goals</p>
                                    </div>
                                    <button onClick={() => togglePref('notificationsEnabled')} className={`w-16 h-9 rounded-full transition-all p-1.5 flex items-center ${prefs.notificationsEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'}`}>
                                        <div className="w-6 h-6 rounded-full bg-white shadow-xl" />
                                    </button>
                                </div>
                                <hr className="border-slate-100 dark:border-slate-900" />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-semibold tracking-tighter text-slate-900 dark:text-white flex items-center gap-2"><Smartphone className="w-5 h-5 text-indigo-500" /> Mobile Sync</p>
                                        <p className="text-xs font-bold text-slate-500 tracking-widest mt-1">Keep sessions synced across all devices</p>
                                    </div>
                                    <button className="w-16 h-9 rounded-full bg-slate-200 dark:bg-slate-800 p-1.5 flex justify-start items-center opacity-50 cursor-not-allowed">
                                        <div className="w-6 h-6 rounded-full bg-slate-400" />
                                    </button>
                                </div>
                                <div className="pt-8">
                                    <Button onClick={handleSavePrefs} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-12 rounded-[1.5rem] h-16 tracking-tighter shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all text-xl gap-3">
                                        {isSaving ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-6 h-6" />}
                                        Commit Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Subject Management */}
                    <Card className="rounded-[3rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-10 lg:p-14 overflow-hidden relative shadow-2xl">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 -mr-20 -mt-20 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex flex-col md:flex-row gap-12 lg:gap-20">
                            <div className="md:w-1/3">
                                <h3 className="text-3xl font-semibold tracking-tighter mb-6 leading-none">Subject<br /><span className="text-emerald-500">Management</span></h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">Customize your focus subjects. Categories added here will instantly reflect in your timer and planner.</p>
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="flex gap-4">
                                    <input
                                        className="flex-1 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-900 dark:text-white"
                                        placeholder="e.g. History, Machine Learning..."
                                        value={newSubject}
                                        onChange={e => setNewSubject(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleAddSubject()}
                                    />
                                    <Button disabled={isSavingSubject || !newSubject.trim()} onClick={handleAddSubject} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl h-12 px-6 font-semibold shadow-lg shadow-emerald-500/20">
                                        <Plus className="w-5 h-5 md:mr-2" /> <span className="hidden md:inline">Add</span>
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {subjects.map((sub: any) => (
                                        <div key={sub.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color || '#10b981' }} />
                                                <p className="font-semibold text-slate-900 dark:text-white tracking-tight">{sub.name}</p>
                                            </div>
                                            <button onClick={() => handleDeleteSubject(sub.id)} className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-2 bg-white dark:bg-slate-950 rounded-xl shadow-sm">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {subjects.length === 0 && <p className="text-center text-slate-400 text-sm font-bold tracking-widest py-8 opacity-50">No subjects created yet.</p>}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}
