import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Route, Plus, Search, X, Loader2, CheckCircle2, XCircle,
  MoreVertical, Eye, Pencil, Trash2, MapPinned
} from 'lucide-react'

import { createStop, deactivateStop, listRoutesLite, listStops, updateStop, type RouteLite, type StopRow } from '../services/module.service'

function ConfirmDialog({ open, onClose, onConfirm, title, description, loading = false, isDeactivating = false }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string; loading?: boolean; isDeactivating?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">{title}</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</button>
          <button onClick={onConfirm} disabled={loading} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${isDeactivating ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isDeactivating ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionDropdown({ item, onToggleStatusClick }: {
  item: StopRow; onToggleStatusClick: () => void
}) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <div className="relative flex justify-end">
      <button onClick={() => setOpen(!open)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-40 mt-1 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-900 text-left">
            <button onClick={() => { navigate(`/puntos/${item.id}`); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
              <Eye className="h-3.5 w-3.5" /> Ver detalle
            </button>
            <button onClick={() => { navigate(`/puntos/${item.id}/edit`); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
              <Pencil className="h-3.5 w-3.5" /> Editar
            </button>
            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
            {item.is_active ? (
              <button onClick={() => { onToggleStatusClick(); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40">
                <Trash2 className="h-3.5 w-3.5" /> Desactivar
              </button>
            ) : (
              <button onClick={() => { onToggleStatusClick(); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40">
                <CheckCircle2 className="h-3.5 w-3.5" /> Activar
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export function StopsPage() {
  const [rows, setRows] = useState<StopRow[]>([])
  const [routes, setRoutes] = useState<RouteLite[]>([])
  const [loading, setLoading] = useState(false)
  
  const [descripcion, setDescripcion] = useState('')
  const [latitud, setLatitud] = useState('-17.7833')
  const [longitud, setLongitud] = useState('-63.1821')
  const [stopType, setStopType] = useState('N')
  const [routeId, setRouteId] = useState('')
  
  const [onlyActive, setOnlyActive] = useState(true)
  const [search, setSearch] = useState('')

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [toggleTarget, setToggleTarget] = useState<StopRow | null>(null)
  const [toggleLoading, setToggleLoading] = useState(false)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 4000)
  }

  const load = async () => {
    setLoading(true)
    const [stopsRes, routesRes] = await Promise.all([listStops(), listRoutesLite()])
    if (stopsRes.success) setRows(stopsRes.data)
    else showToast(stopsRes.message || 'Error al cargar puntos', 'error')
    
    if (routesRes.success) {
      setRoutes(routesRes.data)
      if (!routeId && routesRes.data.length) setRouteId(String(routesRes.data[0].id_linea_ruta ?? routesRes.data[0].id))
    }
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  const filtered = useMemo(() => {
    let result = rows.filter((s) => (onlyActive ? s.is_active : true))
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(r => 
        (r.descripcion || '').toLowerCase().includes(q) || 
        String(r.id_punto).includes(q)
      )
    }
    return result
  }, [rows, onlyActive, search])

  const create = async (e: FormEvent) => {
    e.preventDefault()
    if (!descripcion || !latitud || !longitud) {
      showToast('Por favor completa los campos requeridos', 'error')
      return
    }
    const res = await createStop({ 
      descripcion, 
      latitud: Number(latitud), 
      longitud: Number(longitud), 
      stop: stopType 
    })
    
    if (res.success) {
      showToast('Punto creado correctamente', 'success')
      setDescripcion('')
      await load()
    } else {
      showToast(res.message || 'Error al crear el punto', 'error')
    }
  }

  const executeToggle = async () => {
    if (!toggleTarget) return
    setToggleLoading(true)
    
    if (toggleTarget.is_active) {
      const res = await deactivateStop(String(toggleTarget.id))
      setToggleLoading(false)
      if (res.success) {
        showToast('Punto desactivado', 'success')
        setToggleTarget(null)
        await load()
      } else {
        showToast(res.message || 'Error al desactivar', 'error')
      }
    } else {
      const res = await updateStop(String(toggleTarget.id), { is_active: true })
      setToggleLoading(false)
      if (res.success) {
        showToast('Punto reactivado', 'success')
        setToggleTarget(null)
        await load()
      } else {
        showToast(res.message || 'Error al reactivar', 'error')
      }
    }
  }

  return (
    <section className="space-y-6">
      {toast && (
        <div className={`fixed right-4 top-4 z-[60] flex items-center gap-2 rounded-xl border px-4 py-3 shadow-lg ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/80 dark:text-red-300'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/10"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Puntos Geográficos</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Gestión de paradas y coordenadas de la plataforma.</p>
        </div>
        <Link to="/puntos/create" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-rose-600 hover:to-pink-700 hover:shadow-md active:scale-[0.98]">
          <Plus className="h-4 w-4" /> Nuevo punto
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-1 flex-col sm:flex-row min-w-[300px] items-center gap-3">
          <div className="relative w-full sm:flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Buscar por descripción o ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-rose-600 dark:focus:ring-rose-900/40" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"><X className="h-3.5 w-3.5" /></button>}
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <input type="checkbox" className="rounded text-rose-500 focus:ring-rose-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600" checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)} />
            Solo activos
          </label>
        </div>
      </div>

      {/* Quick Add Form */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/30">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Adición Rápida
          </h3>
        </div>
        <form className="grid gap-4 p-5 sm:grid-cols-6 lg:grid-cols-12" onSubmit={create}>
          <div className="sm:col-span-6 lg:col-span-3">
            <label className="mb-1 block text-xs font-medium text-slate-500">Descripción *</label>
            <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-rose-600 dark:focus:ring-rose-900/40" placeholder="Ej: Av. Principal y 4to Anillo" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
          </div>
          <div className="sm:col-span-3 lg:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">Latitud *</label>
            <input type="number" step="any" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-rose-600 dark:focus:ring-rose-900/40" placeholder="-17.7833" value={latitud} onChange={(e) => setLatitud(e.target.value)} required />
          </div>
          <div className="sm:col-span-3 lg:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">Longitud *</label>
            <input type="number" step="any" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-rose-600 dark:focus:ring-rose-900/40" placeholder="-63.1821" value={longitud} onChange={(e) => setLongitud(e.target.value)} required />
          </div>
          <div className="sm:col-span-3 lg:col-span-1">
            <label className="mb-1 block text-xs font-medium text-slate-500">Tipo</label>
            <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-rose-600 dark:focus:ring-rose-900/40" placeholder="N" value={stopType} onChange={(e) => setStopType(e.target.value)} />
          </div>
          <div className="sm:col-span-3 lg:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">Ruta (Opcional)</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-rose-600 dark:focus:ring-rose-900/40" value={routeId} onChange={(e) => setRouteId(e.target.value)}>
                <option value="">Sin ruta</option>
                {routes.map((r) => <option key={String(r.id)} value={String(r.id_linea_ruta ?? r.id)}>{r.id_linea_ruta ?? r.id} - {r.descripcion ?? 'Ruta'}</option>)}
              </select>
            </div>
          </div>
          <div className="sm:col-span-6 lg:col-span-2 flex items-end">
            <button className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors">
              Crear Punto
            </button>
          </div>
        </form>
      </div>

      {loading && <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-rose-500" /><span className="ml-2 text-sm text-slate-500">Cargando puntos...</span></div>}

      {/* Table */}
      {!loading && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Punto</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ruta Asignada</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Estado</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {visible.map((x) => (
                  <tr key={String(x.id)} className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${!x.is_active ? 'opacity-60' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-100 to-rose-200 text-rose-700 dark:from-rose-900/50 dark:to-rose-800/50 dark:text-rose-300">
                          <MapPinned className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">{x.descripcion || 'Sin descripción'}</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">ID: {x.id_punto ?? x.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <Route className="h-3.5 w-3.5" />
                        {routeId ? `Ruta ${routeId}` : 'Sin ruta'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${x.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                        {x.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {x.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ActionDropdown 
                        item={x} 
                        onToggleStatusClick={() => setToggleTarget(x)} 
                      />
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <MapPin className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        No se encontraron puntos con los filtros actuales.
                      </p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/30">
            <span className="text-xs text-slate-500 dark:text-slate-400">{visible.length} puntos visibles</span>
          </div>
        </div>
      )}

      <ConfirmDialog 
        open={!!toggleTarget} 
        onClose={() => setToggleTarget(null)} 
        onConfirm={executeToggle} 
        loading={toggleLoading} 
        isDeactivating={toggleTarget?.is_active}
        title={toggleTarget?.is_active ? "Desactivar Punto" : "Reactivar Punto"} 
        description={toggleTarget?.is_active 
          ? "¿Estás seguro que deseas desactivar este punto? Ya no estará visible para los conductores u operaciones del sistema."
          : "¿Deseas volver a activar este punto para que vuelva a estar operativo?"} 
      />
    </section>
  )
}
