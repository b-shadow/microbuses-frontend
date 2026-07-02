import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, X, MapPin, Loader2, Route } from 'lucide-react'

import { createRoutePoint, listRoutesLite } from '../services/module.service'

type RouteLite = { id: string | number; id_linea_ruta?: number; descripcion?: string; description?: string }

export function RoutePointsCreatePage() {
  const navigate = useNavigate()
  const [routes, setRoutes] = useState<RouteLite[]>([])
  
  const [routeId, setRouteId] = useState('')
  const [idPunto, setIdPunto] = useState('')
  const [idPuntoDest, setIdPuntoDest] = useState('')
  const [orden, setOrden] = useState('1')
  const [distancia, setDistancia] = useState('')
  const [tiempo, setTiempo] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    const load = async () => {
      setInitLoading(true)
      const res = await listRoutesLite()
      if (res.success) {
        setRoutes(res.data)
        if (res.data[0]) setRouteId(String(res.data[0].id_linea_ruta ?? res.data[0].id))
      }
      setInitLoading(false)
    }
    void load()
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!idPunto || !idPuntoDest || !orden || !routeId) {
      showToast('Por favor completa los campos requeridos', 'error')
      return
    }
    setLoading(true)
    const res = await createRoutePoint({
      id_linea_ruta: Number(routeId),
      id_punto: Number(idPunto),
      id_punto_dest: Number(idPuntoDest),
      orden: Number(orden),
      distancia: distancia ? Number(distancia) : null,
      tiempo: tiempo ? Number(tiempo) : null,
    })
    setLoading(false)
    if (res.success) {
      navigate('/lineas-puntos')
    } else {
      showToast(res.message || 'Error al guardar el punto', 'error')
    }
  }

  if (initLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      {toast && (
        <div className={`fixed right-4 top-4 z-[60] flex items-center gap-2 rounded-xl border px-4 py-3 shadow-lg ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/80 dark:text-red-300'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/10"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/lineas-puntos" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Nuevo Punto de Ruta</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Añade un nuevo punto a la secuencia del trazado.</p>
        </div>
      </div>

      {/* Form */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            <MapPin className="h-4 w-4 text-cyan-500" />
            Información del Punto
          </h2>
        </div>
        
        <form onSubmit={onSubmit} className="p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Ruta Asignada *</label>
              <div className="relative">
                <Route className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select 
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-cyan-600 dark:focus:ring-cyan-900/40" 
                  value={routeId} 
                  onChange={(e) => setRouteId(e.target.value)}
                  required
                >
                  <option value="">Selecciona una ruta...</option>
                  {routes.map((r) => <option key={String(r.id)} value={String(r.id_linea_ruta ?? r.id)}>{r.id_linea_ruta ?? r.id} - {r.descripcion ?? r.description ?? 'Ruta'}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">ID Punto Origen *</label>
              <input 
                type="number"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-cyan-600 dark:focus:ring-cyan-900/40" 
                value={idPunto} 
                onChange={(e) => setIdPunto(e.target.value)} 
                placeholder="Ej: 152" 
                required 
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">ID Punto Destino *</label>
              <input 
                type="number"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-cyan-600 dark:focus:ring-cyan-900/40" 
                value={idPuntoDest} 
                onChange={(e) => setIdPuntoDest(e.target.value)} 
                placeholder="Ej: 153" 
                required 
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Orden en la Secuencia *</label>
              <input 
                type="number"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-cyan-600 dark:focus:ring-cyan-900/40" 
                value={orden} 
                onChange={(e) => setOrden(e.target.value)} 
                placeholder="Ej: 5" 
                required 
              />
              <p className="mt-1.5 text-xs text-slate-500">Determina el orden cronológico en el que los microbuses recorren este segmento.</p>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Distancia (km)</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-cyan-600 dark:focus:ring-cyan-900/40" 
                value={distancia} 
                onChange={(e) => setDistancia(e.target.value)} 
                placeholder="Opcional. Ej: 0.5" 
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Tiempo (hrs)</label>
              <input 
                type="number" 
                step="0.01"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-cyan-600 dark:focus:ring-cyan-900/40" 
                value={tiempo} 
                onChange={(e) => setTiempo(e.target.value)} 
                placeholder="Opcional. Ej: 0.05" 
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row dark:border-slate-800">
            <Link to="/lineas-puntos" className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
              Cancelar
            </Link>
            <button disabled={loading} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-cyan-600 hover:to-cyan-700 hover:shadow-md disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              Guardar Punto
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
