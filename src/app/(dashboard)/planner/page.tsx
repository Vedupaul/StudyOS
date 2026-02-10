"use client"

import { useState, useEffect, useMemo } from 'react'
import {
    Calendar as CalendarIcon,
    Plus,
    CheckCircle2,
    Circle,
    Clock,
    GripVertical,
    Trash2,
    X,
    PlusCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Sortable Item Component
function SortableTask({ task, toggleStatus, deleteTask }: { task: any, toggleStatus: any, deleteTask: any }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group flex items-center gap-4 p-6 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors border-b border-slate-100 dark:border-slate-900 last:border-0"
        >
            <div
                {...attributes}
                {...listeners}
                className="text-slate-300 group-hover:text-slate-400 cursor-grab active:cursor-grabbing p-1"
            >
                <GripVertical className="w-5 h-5" />
            </div>
            <button onClick={() => toggleStatus(task)} className="transition-transform active:scale-90">
                {task.status === 'completed' ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-500 fill-emerald-50" />
                ) : (
                    <Circle className="w-7 h-7 text-slate-300" />
                )}
            </button>
            <div className="flex-1">
                <p className={task.status === 'completed' ? "text-lg font-bold text-slate-400 line-through" : "text-lg font-bold text-slate-900 dark:text-white"}>
                    {task.taskName}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.plannedDuration} min</span>
                    {task.subject && <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: task.subject.color }} /> {task.subject.name}</span>}
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.id)}
                className="text-slate-300 hover:text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    )
}

export default function PlannerPage() {
    const [date, setDate] = useState(new Date())
    const [tasks, setTasks] = useState<any[]>([])
    const [subjects, setSubjects] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [quickAddText, setQuickAddText] = useState('')

    // New task state
    const [newTask, setNewTask] = useState({
        name: '',
        duration: 30,
        subjectId: ''
    })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        fetchTasks()
        fetchSubjects()
    }, [date])

    const fetchTasks = async () => {
        setIsLoading(true)
        try {
            const formattedDate = format(date, 'yyyy-MM-dd')
            const response = await fetch(`/api/planner?date=${formattedDate}`)
            const data = await response.json()
            if (data.success && data.data.length > 0) {
                setTasks(data.data[0].tasks)
            } else {
                setTasks([])
            }
        } catch (error) {
            toast.error('Failed to load tasks')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSubjects = async () => {
        try {
            const response = await fetch('/api/subjects')
            const data = await response.json()
            if (data.success) setSubjects(data.data)
        } catch (e) { }
    }

    const handleAddTask = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        const name = e ? newTask.name : quickAddText
        if (!name) return

        try {
            // Ensure plan exists
            const planRes = await fetch('/api/planner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planDate: format(date, 'yyyy-MM-dd') })
            })
            const planData = await planRes.json()

            if (planData.success) {
                const response = await fetch('/api/planner/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dailyPlanId: planData.data.id,
                        taskName: name,
                        plannedDuration: e ? newTask.duration : 25,
                        subjectId: e ? (newTask.subjectId || undefined) : undefined,
                        taskOrder: tasks.length
                    })
                })
                if (response.ok) {
                    fetchTasks()
                    toast.success('Task added!')
                    setNewTask({ name: '', duration: 30, subjectId: '' })
                    setQuickAddText('')
                    setShowModal(false)
                }
            }
        } catch (error) {
            toast.error('Failed to add task')
        }
    }

    const toggleStatus = async (task: any) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed'
        try {
            const res = await fetch('/api/planner/tasks', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: task.id, status: newStatus })
            })
            if (res.ok) {
                setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
                if (newStatus === 'completed') toast.success('Nicely done!')
            }
        } catch (error) {
            toast.error('Update failed')
        }
    }

    const deleteTask = async (id: string) => {
        try {
            const res = await fetch(`/api/planner/tasks?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                setTasks(tasks.filter(t => t.id !== id))
                toast.success('Task removed')
            }
        } catch (error) {
            toast.error('Delete failed')
        }
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = tasks.findIndex((t) => t.id === active.id)
            const newIndex = tasks.findIndex((t) => t.id === over?.id)
            const newTasks = arrayMove(tasks, oldIndex, newIndex)
            setTasks(newTasks)

            // Sync with backend (simple implementation: update order of moved item)
            // In a more robust app, you'd send the whole new order or a specific move command
            try {
                await fetch('/api/planner/tasks', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: active.id, taskOrder: newIndex })
                })
            } catch (e) { }
        }
    }

    const completionRate = Math.round((tasks.filter(t => t.status === 'completed').length / (tasks.length || 1)) * 100)

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase italic">
                        Daily <span className="text-indigo-500">Planner</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
                        {format(date, 'EEEE, MMMM do')}
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <Button variant="ghost" size="sm" onClick={() => {
                        const d = new Date(date)
                        d.setDate(d.getDate() - 1)
                        setDate(d)
                    }} className="rounded-xl font-bold">Prev</Button>
                    <div className="px-4 py-2 text-sm font-bold flex items-center gap-2 text-slate-700 dark:text-slate-200">
                        <CalendarIcon className="w-4 h-4 text-indigo-500" />
                        {format(date, 'MMM dd')}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {
                        const d = new Date(date)
                        d.setDate(d.getDate() + 1)
                        setDate(d)
                    }} className="rounded-xl font-bold">Next</Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 bg-white dark:bg-slate-950/50 backdrop-blur-xl overflow-hidden min-h-[500px] flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-900 p-8 py-6">
                            <div>
                                <CardTitle className="text-xl font-black uppercase italic tracking-tight">Today's Schedule</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">
                                    {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'} Planned
                                </CardDescription>
                            </div>
                            <Button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl px-6 gap-2 font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform">
                                <Plus className="w-4 h-4" /> NEW TASK
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            {isLoading ? (
                                <div className="h-full flex items-center justify-center p-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500"></div>
                                </div>
                            ) : tasks.length === 0 ? (
                                <div className="p-20 text-center flex flex-col items-center justify-center h-full">
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
                                        <CalendarIcon className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No tasks planned yet</p>
                                    <Button variant="link" onClick={() => setShowModal(true)} className="text-indigo-500 mt-2 font-bold">Add your first study block</Button>
                                </div>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={tasks.map(t => t.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="divide-y divide-slate-100 dark:divide-slate-900">
                                            {tasks.map((task) => (
                                                <SortableTask
                                                    key={task.id}
                                                    task={task}
                                                    toggleStatus={toggleStatus}
                                                    deleteTask={deleteTask}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] bg-indigo-600 text-white border-none p-10 overflow-hidden relative group shadow-2xl shadow-indigo-600/30">
                        <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-4 leading-none">Focus<br />Activity</h3>
                            <div className="text-6xl font-black tabular-nums tracking-tighter mb-4">{completionRate}%</div>
                            <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden mb-6">
                                <div
                                    className="bg-white h-full transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                                    style={{ width: `${completionRate}%` }}
                                />
                            </div>
                            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">
                                {tasks.filter(t => t.status === 'completed').length} / {tasks.length} Tasks COMPLETED
                            </p>
                        </div>
                    </Card>

                    <Card className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 backdrop-blur-xl p-8 shadow-xl">
                        <h3 className="text-lg font-black uppercase italic tracking-tight mb-6 flex items-center gap-3">
                            <PlusCircle className="w-5 h-5 text-indigo-500" /> Quick Entry
                        </h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={quickAddText}
                                onChange={(e) => setQuickAddText(e.target.value)}
                                placeholder="Next study task..."
                                className="w-full bg-slate-100 dark:bg-slate-900/80 border-2 border-transparent focus:border-indigo-500/30 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask() }}
                            />
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center px-4 leading-relaxed">
                                Press <span className="text-indigo-500">Enter</span> to instantly append to your schedule
                            </p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Task Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/40 animate-in fade-in duration-300">
                    <Card className="w-full max-w-lg rounded-[3rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-10 shadow-3xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Plan <span className="text-indigo-500">Task</span></h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-indigo-500 transition-all hover:rotate-90"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddTask} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Task Description</label>
                                <input
                                    autoFocus
                                    required
                                    value={newTask.name}
                                    onChange={e => setNewTask({ ...newTask, name: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-3xl py-4 px-6 text-sm font-bold focus:border-indigo-500 transition-all outline-none"
                                    placeholder="What are you studying?"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Duration (Min)</label>
                                    <input
                                        type="number"
                                        value={newTask.duration}
                                        onChange={e => setNewTask({ ...newTask, duration: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-3xl py-4 px-6 text-sm font-bold focus:border-indigo-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Subject</label>
                                    <select
                                        value={newTask.subjectId}
                                        onChange={e => setNewTask({ ...newTask, subjectId: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-3xl py-4 px-6 text-sm font-bold focus:border-indigo-500 transition-all outline-none appearance-none"
                                    >
                                        <option value="">General</option>
                                        {subjects.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full h-16 rounded-3xl bg-indigo-600 hover:bg-indigo-500 text-white font-black italic uppercase tracking-tight text-lg shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
                                    Confirm & Schedule
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    )
}
