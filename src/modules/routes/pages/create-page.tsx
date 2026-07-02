import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Route, Map as MapIcon, AlignLeft, Loader2, CheckCircle2, XCircle, X, ChevronDown, Split, Ruler, Timer
} from 'lucide-react'

import { createRoute, listLinesLite } from '../services/module.service'

type LineRow = { id: string | number; id_linea?: number; nombre_linea?: string; code?: string; name?: string }

const inputCls = 'w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-900/40'
const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'

export function RoutesCreatePage() {
  const navigate = useNavigate()
  const [lines, setLines] = useState<LineRow[]>([])
  
  const [lineId, setLineId] = useState('')
  const [routeId, setRouteId] = useState('1')
  const [descripcion, setDescripcion] = useState('')
  const [distancia, setDistancia] = useState('')
  const [tiempo, setTiempo] = useState('')
  
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
    const res = await createRoute({
      id_linea: Number(lineId),
      id_ruta: Number(routeId),
      descripcion,
      distancia: distancia ? Number(distancia) : null,
      tiempo: tiempo ? Number(tiempo) : null,
    })
    setLoading(false)
    if (res.success) navigate('/linea-ruta')
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
        <Link to="/linea-ruta" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Nuevo recorrido</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Registrar un nuevo trazado de ida o retorno.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Linea Base *</label>
            <div className="relative">
              <MapIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select value={lineId} onChange={(e) => setLineId(e.target.value)} required className={`${inputCls} appearance-none pr-10`}>
                {lines.map((l) => <option key={String(l.id)} value={String(l.id_linea ?? l.id)}>{l.nombre_linea ?? l.name ?? l.code}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Tipo (Ruta) *</label>
            <div className="relative">
              <Split className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select value={routeId} onChange={(e) => setRouteId(e.target.value)} required className={`${inputCls} appearance-none pr-10 font-bold`}>
                <option value="1">1 - Ida / Salida</option>
                <option value="2">2 - Vuelta / Retorno</option>
                <option value="3">3 - Especial</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Descripcion del Recorrido *</label>
            <div className="relative"><AlignLeft className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" required value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej. L001 Ruta Salida Centro" className={inputCls} /></div>
          </div>

          <div>
            <label className={labelCls}>Distancia (km)</label>
            <div className="relative"><Ruler className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="number" step="0.01" value={distancia} onChange={(e) => setDistancia(e.target.value)} placeholder="22.5" className={inputCls} /></div>
          </div>
          <div>
            <label className={labelCls}>Tiempo estimado (horas)</label>
            <div className="relative"><Timer className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="number" step="0.01" value={tiempo} onChange={(e) => setTiempo(e.target.value)} placeholder="1.2" className={inputCls} /></div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
          <Link to="/linea-ruta" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</Link>
          <button type="submit" disabled={loading || lines.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Guardar recorrido
          </button>
        </div>
      </form>
    </section>
  )
}
