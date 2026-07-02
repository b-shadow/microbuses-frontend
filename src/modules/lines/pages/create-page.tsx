import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Map, Palette, Loader2, CheckCircle2, XCircle, X
} from 'lucide-react'

import { createLine } from '../services/module.service'

const inputCls = 'w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-600 dark:focus:ring-indigo-900/40'
const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'

export function LinesCreatePage() {
  const navigate = useNavigate()
  const [nombreLinea, setNombreLinea] = useState('')
  const [colorLinea, setColorLinea] = useState('#0284C7')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 4000)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await createLine({ nombre_linea: nombreLinea, color_linea: colorLinea })
    setLoading(false)
    if (res.success) navigate('/lineas')
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
        <Link to="/lineas" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Nueva linea</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Registrar una nueva ruta/linea en el sistema.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>Nombre de la linea *</label>
            <div className="relative"><Map className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" required value={nombreLinea} onChange={(e) => setNombreLinea(e.target.value)} placeholder="Ej. Linea 100" className={inputCls} /></div>
          </div>
          <div>
            <label className={labelCls}>Color identificador *</label>
            <div className="relative flex items-center gap-3">
              <div className="relative flex-1">
                <Palette className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" required value={colorLinea} onChange={(e) => setColorLinea(e.target.value)} placeholder="#0284C7" className={inputCls} />
              </div>
              <input type="color" value={colorLinea} onChange={(e) => setColorLinea(e.target.value)} className="h-11 w-12 cursor-pointer rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800" />
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
          <Link to="/lineas" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</Link>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Guardar linea
          </button>
        </div>
      </form>
    </section>
  )
}
