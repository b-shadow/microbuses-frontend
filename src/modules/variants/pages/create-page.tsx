import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, GitBranch, Map as MapIcon, AlignLeft, Loader2, CheckCircle2, XCircle, X, ChevronDown
} from 'lucide-react'

import { createVariant, listLinesLite, LineRowLite } from '../services/module.service'

const inputCls = 'w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-fuchsia-600 dark:focus:ring-fuchsia-900/40'
const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'

export function VariantsCreatePage() {
  const navigate = useNavigate()
  const [lines, setLines] = useState<LineRowLite[]>([])
  const [lineId, setLineId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    const loadLines = async () => {
      const res = await listLinesLite()
      if (res.success) {
        setLines(res.data)
        if (res.data.length > 0) setLineId(String(res.data[0].id_linea ?? res.data[0].id))
      }
    }
    void loadLines()
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await createVariant({ line_id: lineId, name, description })
    setLoading(false)
    if (res.success) navigate('/variants')
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
        <Link to="/variants" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Nueva variante</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Registrar una nueva variante o ruta alterna.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <label className={labelCls}>Linea Base *</label>
          <div className="relative">
            <MapIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select value={lineId} onChange={(e) => setLineId(e.target.value)} required className={`${inputCls} appearance-none pr-10`}>
              {lines.map((l) => <option key={String(l.id)} value={String(l.id_linea ?? l.id)}>{l.nombre_linea || l.id}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div>
          <label className={labelCls}>Nombre de variante *</label>
          <div className="relative"><GitBranch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Ruta Directa Centro" className={inputCls} /></div>
        </div>

        <div>
          <label className={labelCls}>Descripcion (Opcional)</label>
          <div className="relative"><AlignLeft className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalles del recorrido..." rows={3} className={`${inputCls} resize-none pt-2.5`} /></div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
          <Link to="/variants" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</Link>
          <button type="submit" disabled={loading || lines.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-fuchsia-600 hover:to-fuchsia-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Guardar variante
          </button>
        </div>
      </form>
    </section>
  )
}
