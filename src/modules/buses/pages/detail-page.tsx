import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Pencil, Loader2,
  Hash, Tag, Map as MapIcon, Users, LayoutGrid, Activity
} from 'lucide-react'

import { getBus } from '../services/module.service'

type Bus = { id: string; plate: string; model: string; seats_count: number; internal_number: string; line_id: string | number; status: string }

function InfoField({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
      </div>
    </div>
  )
}

export function BusesDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<Bus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await getBus(id)
      if (res.success) setRow(res.data)
      else setError(res.message || 'Error al cargar')
      setLoading(false)
    }
    void load()
  }, [id])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-teal-500" /></div>
  if (!row) return <p className="py-8 text-center text-sm text-slate-500">{error || 'Microbus no encontrado.'}</p>

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/buses" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Detalle del microbus</h1>
        </div>
      </div>

      {/* Profile card */}
      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-2xl font-bold text-white shadow-inner">
            {row.internal_number}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">{row.plate}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{row.model}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Activity className="h-3.5 w-3.5" /> Estado: {row.status}
            </span>
          </div>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2">
          <InfoField icon={<Hash className="h-4 w-4" />} label="Placa" value={row.plate} />
          <InfoField icon={<Tag className="h-4 w-4" />} label="Numero Interno" value={row.internal_number} />
          <InfoField icon={<LayoutGrid className="h-4 w-4" />} label="Modelo" value={row.model} />
          <InfoField icon={<Users className="h-4 w-4" />} label="Asientos" value={row.seats_count} />
          <InfoField icon={<MapIcon className="h-4 w-4" />} label="Linea Asignada" value={row.line_id} />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <Link to={`/buses/${row.id}/edit`} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-teal-600 hover:to-teal-700">
            <Pencil className="h-4 w-4" /> Editar microbus
          </Link>
        </div>
      </div>
    </section>
  )
}
