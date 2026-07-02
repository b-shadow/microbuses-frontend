import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { 
  ArrowLeft, Pencil, Loader2, MapPin, Navigation, Map, Timer, Ruler, MapPinned
} from 'lucide-react'

import { listRoutePoints } from '../services/module.service'

type RoutePoint = {
  id: string | number
  id_linea_punto?: number
  route_id?: string
  id_linea_ruta?: number
  id_punto?: number
  id_punto_dest?: number
  sequence?: number
  orden?: number
  lat?: number | null
  lng?: number | null
  distancia?: number | null
  tiempo?: number | null
}

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

export function RoutePointsDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<RoutePoint | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await listRoutePoints()
      setLoading(false)
      if (!res.success) {
        setMessage(res.message)
        return
      }
      const item = res.data.find((x) => String(x.id) === id)
      if (item) {
        setRow(item)
      } else {
        setMessage('Punto no encontrado')
      }
    }
    void load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (!row) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <MapPin className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">No encontrado</h2>
        <p className="mt-2 text-sm text-slate-500">{message || 'El registro no existe o ha sido eliminado.'}</p>
        <Link to="/lineas-puntos" className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
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
          <Link to="/lineas-puntos" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Detalle de Punto</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Información del segmento del recorrido</p>
          </div>
        </div>
        <Link to={`/lineas-puntos/${row.id}/edit`} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-cyan-600 hover:to-cyan-700">
          <Pencil className="h-4 w-4" /> Editar
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4 border-b border-slate-100 px-6 py-8 text-center dark:border-slate-800">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-inner">
            <MapPin className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Segmento #{row.id_punto ?? '-'} → #{row.id_punto_dest ?? '-'}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">ID del Registro: {row.id_linea_punto ?? row.id}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Navigation className="h-3.5 w-3.5" /> Orden en secuencia: {row.orden ?? row.sequence}
          </span>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2">
          <InfoField icon={<Map className="h-4 w-4" />} label="Ruta Asociada" value={`ID: ${row.id_linea_ruta ?? row.route_id}`} />
          <InfoField icon={<Navigation className="h-4 w-4" />} label="Orden" value={row.orden ?? row.sequence} />
          
          <InfoField icon={<MapPinned className="h-4 w-4" />} label="Punto Origen" value={`ID: ${row.id_punto ?? '-'}`} />
          <InfoField icon={<MapPinned className="h-4 w-4" />} label="Punto Destino" value={`ID: ${row.id_punto_dest ?? '-'}`} />

          <InfoField icon={<Ruler className="h-4 w-4" />} label="Distancia" value={row.distancia ? `${row.distancia} km` : 'No especificada'} />
          <InfoField icon={<Timer className="h-4 w-4" />} label="Tiempo Estimado" value={row.tiempo ? `${row.tiempo} hrs` : 'No especificado'} />
          
          <div className="sm:col-span-2">
            <InfoField icon={<MapPin className="h-4 w-4" />} label="Coordenadas Geográficas (Origen)" value={
              row.lat && row.lng ? (
                <span className="font-mono text-sm">{row.lat}, {row.lng}</span>
              ) : (
                <span className="italic text-slate-400">Sin coordenadas registradas</span>
              )
            } />
          </div>
        </div>
      </div>
    </section>
  )
}
