import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Hash, Tag, Users, LayoutGrid, Loader2, CheckCircle2, XCircle, X, ChevronDown, Activity
} from 'lucide-react'

import { getBus, updateBus } from '../services/module.service'

const inputCls = 'w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-teal-600 dark:focus:ring-teal-900/40'
const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'

export function BusesEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [plate, setPlate] = useState('')
  const [model, setModel] = useState('')
  const [seats, setSeats] = useState('20')
  const [internalNumber, setInternalNumber] = useState('')
  const [status, setStatus] = useState('INACTIVE')
  
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    const load = async () => {
      const res = await getBus(id)
      if (res.success) {
        setPlate(res.data.plate)
        setModel(res.data.model)
        setSeats(String(res.data.seats_count))
        setInternalNumber(res.data.internal_number)
        setStatus(res.data.status)
      } else {
        showToast(res.message || 'Error al cargar', 'error')
      }
      setLoadingData(false)
    }
    void load()
  }, [id])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await updateBus(id, {
      plate, model, seats_count: Number(seats), internal_number: internalNumber, status
    })
    setLoading(false)
    if (res.success) navigate('/buses')
    else showToast(res.message || 'Error al actualizar', 'error')
  }

  if (loadingData) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-teal-500" /></div>

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Editar microbus</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Actualizar la informacion del microbus {internalNumber}.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Placa *</label>
            <div className="relative"><Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" required value={plate} onChange={(e) => setPlate(e.target.value)} className={inputCls} /></div>
          </div>
          <div>
            <label className={labelCls}>Numero Interno *</label>
            <div className="relative"><Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" required value={internalNumber} onChange={(e) => setInternalNumber(e.target.value)} className={inputCls} /></div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Modelo *</label>
            <div className="relative"><LayoutGrid className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" required value={model} onChange={(e) => setModel(e.target.value)} className={inputCls} /></div>
          </div>
          <div>
            <label className={labelCls}>Asientos *</label>
            <div className="relative"><Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="number" required min={1} value={seats} onChange={(e) => setSeats(e.target.value)} className={inputCls} /></div>
          </div>
        </div>

        <div>
          <label className={labelCls}>Estado *</label>
          <div className="relative">
            <Activity className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} required className={`${inputCls} appearance-none pr-10`}>
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
              <option value="MAINTENANCE">Mantenimiento</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
          <Link to="/buses" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</Link>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-teal-600 hover:to-teal-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Guardar cambios
          </button>
        </div>
      </form>
    </section>
  )
}
