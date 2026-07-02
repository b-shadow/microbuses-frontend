import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Hash, Tag, Users, LayoutGrid, Map as MapIcon, Loader2, CheckCircle2, XCircle, X, ChevronDown,
} from 'lucide-react'

import { createBus, listLines } from '../services/module.service'

type LineRow = { id: string | number; id_linea?: number; nombre_linea?: string; code?: string; name?: string }

const inputCls = 'w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-teal-600 dark:focus:ring-teal-900/40'
const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'

export function BusesCreatePage() {
  const navigate = useNavigate()
  const [lines, setLines] = useState<LineRow[]>([])
  const [plate, setPlate] = useState('')
  const [model, setModel] = useState('')
  const [seats, setSeats] = useState('20')
  const [internalNumber, setInternalNumber] = useState('')
  const [lineId, setLineId] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    const load = async () => {
      const res = await listLines()
      if (res.success) {
        setLines(res.data)
        if (res.data[0]) setLineId(String(res.data[0].id_linea ?? res.data[0].id))
      }
    }
    void load()
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await createBus({ plate, model, seats_count: Number(seats), internal_number: internalNumber, current_line_id: Number(lineId) })
    setLoading(false)
    if (res.success) navigate('/buses')
    else showToast(res.message || 'Error al crear', 'error')
  }

  return (
    <section className="space-y-6">
      {toast && (
        <div className={`fixed right-4 top-4 z-[60] flex items-center gap-2 rounded-xl border px-4 py-3 shadow-lg ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/80 dark:text-red-300'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 rounded p-0.5 hover:bg-black/5"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/buses" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Nuevo microbus</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Registrar un nuevo microbus en la flota.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Placa *</label>
            <div className="relative"><Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" required value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="1234ABC" className={inputCls} /></div>
          </div>
          <div>
            <label className={labelCls}>Numero Interno *</label>
            <div className="relative"><Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" required value={internalNumber} onChange={(e) => setInternalNumber(e.target.value)} placeholder="05" className={inputCls} /></div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Modelo *</label>
            <div className="relative"><LayoutGrid className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" required value={model} onChange={(e) => setModel(e.target.value)} placeholder="Nissan Civilian" className={inputCls} /></div>
          </div>
          <div>
            <label className={labelCls}>Asientos *</label>
            <div className="relative"><Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="number" required min={1} value={seats} onChange={(e) => setSeats(e.target.value)} className={inputCls} /></div>
          </div>
        </div>

        <div>
          <label className={labelCls}>Linea Asignada *</label>
          <div className="relative">
            <MapIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select value={lineId} onChange={(e) => setLineId(e.target.value)} required className={`${inputCls} appearance-none pr-10`}>
              {lines.map((line) => <option key={String(line.id)} value={String(line.id_linea ?? line.id)}>{line.nombre_linea ?? line.name ?? line.code ?? line.id}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
          <Link to="/buses" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</Link>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-teal-600 hover:to-teal-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Guardar microbus
          </button>
        </div>
      </form>
    </section>
  )
}
