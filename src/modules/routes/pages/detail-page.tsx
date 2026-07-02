import { useEffect, useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Pencil, Loader2, Route, Map as MapIcon, AlignLeft, Activity, Split, Ruler, Timer, MapPin
} from 'lucide-react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { getRoute, listLinesLite, getMapLines } from '../services/module.service'

type RouteRow = {
  id: string | number
  id_linea_ruta?: number
  id_linea?: number
  id_ruta?: number
  descripcion?: string
  distancia?: number | null
  tiempo?: number | null
  is_active: boolean
}
type LineRow = { id: string | number; id_linea?: number; nombre_linea?: string; color_linea?: string; code?: string; name?: string }

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

function MapBoundsFitter({ geojsonData }: { geojsonData: any }) {
  const map = useMap()
  useEffect(() => {
    if (!geojsonData || !geojsonData.coordinates || geojsonData.coordinates.length === 0) return
    const lats = geojsonData.coordinates.map((c: any) => c[1])
    const lngs = geojsonData.coordinates.map((c: any) => c[0])
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    map.fitBounds([
      [minLat, minLng],
      [maxLat, maxLng]
    ], { padding: [20, 20] })
  }, [map, geojsonData])
  return null
}

export function RoutesDetailPage() {
  const { id = '' } = useParams()
  const [row, setRow] = useState<RouteRow | null>(null)
  const [lines, setLines] = useState<LineRow[]>([])
  const [mapGeoJson, setMapGeoJson] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [rRes, lRes, mRes] = await Promise.all([getRoute(id), listLinesLite(), getMapLines()])
      if (rRes.success) setRow(rRes.data)
      else setError(rRes.message || 'Error al cargar')
      
      if (lRes.success) setLines(lRes.data)
      
      if (mRes.success) {
        const matchingRoute = mRes.data.find(m => String(m.id_linea_ruta) === id)
        if (matchingRoute && matchingRoute.geometry_geojson) {
          setMapGeoJson(matchingRoute.geometry_geojson)
        }
      }
      
      setLoading(false)
    }
    void load()
  }, [id])

  const lineObj = useMemo(() => {
    if (!row) return null
    return lines.find(l => String(l.id_linea ?? l.id) === String(row.id_linea))
  }, [row, lines])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-cyan-500" /></div>
  if (!row) return <p className="py-8 text-center text-sm text-slate-500">{error || 'Recorrido no encontrado.'}</p>

  const mapColor = lineObj?.color_linea || '#06b6d4'

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/linea-ruta" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Detalle de Recorrido</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Map View */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col h-[500px] lg:h-auto">
          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-inner">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Visualizacion del Trazado</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Ruta geografica registrada</p>
            </div>
          </div>
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 relative z-0">
            {mapGeoJson ? (
              <MapContainer center={[-17.3895, -66.1568]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <GeoJSON 
                  data={mapGeoJson} 
                  style={{
                    color: mapColor,
                    weight: 5,
                    opacity: 0.8,
                    lineJoin: 'round'
                  }} 
                />
                <MapBoundsFitter geojsonData={mapGeoJson} />
              </MapContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-slate-400">
                <MapIcon className="mb-2 h-10 w-10 opacity-50" />
                <p className="text-sm font-medium">No hay coordenadas registradas para esta ruta.</p>
              </div>
            )}
          </div>
        </div>

        {/* Profile card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 h-fit">
          <div className="flex flex-col items-center gap-4 border-b border-slate-100 px-6 py-6 text-center dark:border-slate-800">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-inner">
              <Route className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">{row.descripcion || 'Sin descripcion'}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">ID: {row.id_linea_ruta ?? row.id}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${row.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              <Activity className="h-3.5 w-3.5" /> {row.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          <div className="grid gap-3 p-6">
            <InfoField icon={<MapIcon className="h-4 w-4" />} label="Linea Base" value={
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: lineObj?.color_linea || '#cbd5e1' }} />
                <span>{lineObj?.nombre_linea ?? lineObj?.name ?? lineObj?.code ?? row.id_linea}</span>
              </div>
            } />
            <InfoField icon={<Split className="h-4 w-4" />} label="Tipo (Ruta)" value={
              <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-bold ${String(row.id_ruta) === '1' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'}`}>
                {String(row.id_ruta) === '1' ? '1 - Ida / Salida' : String(row.id_ruta) === '2' ? '2 - Vuelta / Retorno' : `Ruta ${row.id_ruta}`}
              </span>
            } />
            <InfoField icon={<AlignLeft className="h-4 w-4" />} label="Descripcion" value={row.descripcion || '-'} />
            
            <div className="grid grid-cols-2 gap-3">
              <InfoField icon={<Ruler className="h-4 w-4" />} label="Distancia" value={row.distancia ? `${row.distancia} km` : '-'} />
              <InfoField icon={<Timer className="h-4 w-4" />} label="Tiempo Est." value={row.tiempo ? `${row.tiempo} hrs` : '-'} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            <Link to={`/linea-ruta/${row.id_linea_ruta ?? row.id}/edit`} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-cyan-600 hover:to-cyan-700">
              <Pencil className="h-4 w-4" /> Editar recorrido
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
