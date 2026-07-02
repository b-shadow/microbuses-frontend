import { useEffect, useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Pencil, Loader2, GitBranch, Map as MapIcon, AlignLeft, Activity
} from 'lucide-react'

import { getVariant, VariantRow, listLinesLite, LineRowLite } from '../services/module.service'

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

export function VariantsDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<VariantRow | null>(null)
  const [lines, setLines] = useState<LineRowLite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [vRes, lRes] = await Promise.all([getVariant(id), listLinesLite()])
      if (vRes.success) setRow(vRes.data)
      else setError(vRes.message || 'Error al cargar')
      
      if (lRes.success) setLines(lRes.data)
      setLoading(false)
    }
    void load()
  }, [id])

  const lineObj = useMemo(() => {
    if (!row) return null
    return lines.find(l => String(l.id_linea ?? l.id) === String(row.line_id))
  }, [row, lines])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-fuchsia-500" /></div>
  if (!row) return <p className="py-8 text-center text-sm text-slate-500">{error || 'Variante no encontrada.'}</p>

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/variants" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Detalle de Variante</h1>
        </div>
      </div>

      {/* Profile card */}
      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 text-white shadow-inner">
            <GitBranch className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">{row.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">ID: {row.id}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${row.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              <Activity className="h-3.5 w-3.5" /> {row.is_active ? 'Activa' : 'Inactiva'}
            </span>
          </div>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <InfoField icon={<MapIcon className="h-4 w-4" />} label="Linea Base" value={
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: lineObj?.color_linea || '#cbd5e1' }} />
                <span>{lineObj?.nombre_linea || row.line_id}</span>
              </div>
            } />
          </div>
          <div className="sm:col-span-2">
            <InfoField icon={<GitBranch className="h-4 w-4" />} label="Nombre de Variante" value={row.name} />
          </div>
          <div className="sm:col-span-2">
            <InfoField icon={<AlignLeft className="h-4 w-4" />} label="Descripcion" value={row.description || <span className="text-slate-400 italic">Sin descripcion</span>} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <Link to={`/variants/${row.id}/edit`} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-fuchsia-600 hover:to-fuchsia-700">
            <Pencil className="h-4 w-4" /> Editar variante
          </Link>
        </div>
      </div>
    </section>
  )
}
