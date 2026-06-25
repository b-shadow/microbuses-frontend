import { useEffect, useMemo, useState } from 'react'
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { listRoutes, listStops, NearbyLine, RouteRow, searchNearbyLines, StopRow } from '../services/module.service'

const SANTA_CRUZ: LatLngExpression = [-17.7833, -63.1821]

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function ClickCapture({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng)
    },
  })
  return null
}

export function MapEditorPage() {
  const [routes, setRoutes] = useState<RouteRow[]>([])
  const [stops, setStops] = useState<StopRow[]>([])
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null)
  const [nearby, setNearby] = useState<NearbyLine[]>([])

  useEffect(() => {
    listRoutes().then((r) => r.success && setRoutes(r.data))
    listStops().then((r) => r.success && setStops(r.data))
  }, [])

  useEffect(() => {
    if (!selected) return
    searchNearbyLines(selected.lat, selected.lng, 300).then((r) => {
      if (r.success) setNearby(r.data)
    })
  }, [selected])

  const markerPos = useMemo<LatLngExpression | null>(() => (selected ? [selected.lat, selected.lng] : null), [selected])

  return (
    <section className='space-y-3'>
      <div>
        <h1 className='text-xl font-semibold'>Editor de Mapa</h1>
        <p className='text-sm text-slate-500 dark:text-slate-300'>Haz click en el mapa para inspeccionar lineas cercanas en 300m.</p>
      </div>
      <div className='grid gap-3 md:grid-cols-3'>
        <div className='rounded border p-3 text-sm'>
          <p><strong>Recorridos cargados:</strong> {routes.length}</p>
          <p><strong>Paradas cargadas:</strong> {stops.length}</p>
          {selected ? <p><strong>Punto:</strong> {selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}</p> : <p>Selecciona un punto</p>}
          <div className='mt-2 space-y-1'>
            {nearby.length === 0 ? (
              <p>No hay lineas cercanas.</p>
            ) : (
              nearby.map((linea) => (
                <p key={linea.id}>
                  <span style={{ color: linea.color_linea ?? '#000000' }}>■</span>{' '}
                  {linea.nombre_linea ?? linea.id}
                </p>
              ))
            )}
          </div>
        </div>
        <div className='md:col-span-2'>
          <MapContainer center={SANTA_CRUZ} zoom={13} className='h-[520px] w-full rounded border'>
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='&copy; OpenStreetMap contributors' />
            <ClickCapture onPick={(lat, lng) => setSelected({ lat, lng })} />
            {markerPos ? <Marker position={markerPos}><Popup>Punto seleccionado</Popup></Marker> : null}
            {markerPos ? <Circle center={markerPos} radius={300} pathOptions={{ color: '#0284c7' }} /> : null}
            {markerPos ? <Polyline positions={[SANTA_CRUZ, markerPos]} pathOptions={{ color: '#38bdf8', dashArray: '4 4' }} /> : null}
          </MapContainer>
        </div>
      </div>
    </section>
  )
}
