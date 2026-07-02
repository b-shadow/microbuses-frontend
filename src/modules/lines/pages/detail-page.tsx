import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Pencil, Loader2, Map, Palette, Activity
} from 'lucide-react'

import { getLine, LineRow } from '../services/module.service'

function InfoField({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
        <div className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200">{value}</div>
      </div>
    </div>
  )
}

export function LinesDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<LineRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await getLine(id)
      if (res.success) setRow(res.data)
      else setError(res.message || 'Error al cargar')
      setLoading(false)
    }
    void load()
  }, [id])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>
  if (!row) return <p className="py-8 text-center text-sm text-slate-500">{error || 'Linea no encontrada.'}</p>

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/lineas" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Detalle de la linea</h1>
        </div>
      </div>

      {/* Profile card */}
      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl font-bold text-white shadow-inner" style={{ backgroundColor: row.color_linea || '#4f46e5' }}>
            <Map className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">{row.nombre_linea || 'Sin nombre'}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">ID: {row.id_linea ?? row.id}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${row.is_active !== false ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              <Activity className="h-3.5 w-3.5" /> {row.is_active !== false ? 'Activa' : 'Inactiva'}
            </span>
          </div>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <InfoField icon={<Map className="h-4 w-4" />} label="Nombre de la Linea" value={row.nombre_linea} />
          </div>
          <InfoField icon={<Palette className="h-4 w-4" />} label="Color" value={
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: row.color_linea || '#4f46e5' }} />
              <span className="font-mono uppercase">{row.color_linea || '#4f46e5'}</span>
            </div>
          } />

        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <Link to={`/lineas/${row.id}/edit`} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-indigo-600 hover:to-indigo-700">
            <Pencil className="h-4 w-4" /> Editar linea
          </Link>
        </div>
      </div>
    </section>
  )
}
