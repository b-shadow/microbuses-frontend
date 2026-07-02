import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { 
  ArrowLeft, Pencil, Loader2, MapPin, MapPinned, Info, Navigation
} from 'lucide-react'

import { getStop, type StopRow } from '../services/module.service'

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

export function StopsDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<StopRow | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await getStop(id)
      setLoading(false)
      if (!res.success) {
        setMessage(res.message || 'Error de red')
        return
      }
      if (res.data) {
        setRow(res.data)
      } else {
        setMessage('Punto no encontrado en la base de datos')
      }
    }
    void load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
      </div>
    )
  }

  if (!row) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <MapPin className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">No encontrado</h2>
        <p className="mt-2 text-sm text-slate-500">{message || 'El registro no existe o ha sido eliminado.'}</p>
        <Link to="/puntos" className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
          Volver a la lista
        </Link>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/puntos" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Detalle de Punto</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Información geográfica y estado de la parada.</p>
          </div>
        </div>
        <Link to={`/puntos/${row.id}/edit`} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-rose-600 hover:to-pink-700">
          <Pencil className="h-4 w-4" /> Editar
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4 border-b border-slate-100 px-6 py-8 text-center dark:border-slate-800">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-inner">
            <MapPinned className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">{row.descripcion || 'Sin descripción'}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">ID del Punto: {row.id_punto ?? row.id}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${row.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
            <span className={`h-2 w-2 rounded-full ${row.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            {row.is_active ? 'Punto Activo' : 'Punto Inactivo'}
          </span>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <InfoField icon={<Navigation className="h-4 w-4" />} label="Coordenadas Geográficas" value={
              row.latitud != null && row.longitud != null ? (
                <span className="font-mono text-sm">{row.latitud}, {row.longitud}</span>
              ) : (
                <span className="italic text-slate-400">Sin coordenadas registradas</span>
              )
            } />
          </div>
          
          <InfoField icon={<Info className="h-4 w-4" />} label="Tipo de Parada" value={row.stop || 'Normal'} />
          <InfoField icon={<MapPin className="h-4 w-4" />} label="ID de Base de Datos" value={row.id} />
        </div>
      </div>
    </section>
  )
}
