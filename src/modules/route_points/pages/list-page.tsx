import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Route, Plus, Search, X, Loader2, CheckCircle2, XCircle,
  MoreVertical, Eye, Pencil, Trash2, Save
} from 'lucide-react'

import { createRoutePoint, deleteRoutePoint, listRoutePoints, listRoutesLite, updateRoutePoint } from '../services/module.service'

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

type RouteLite = { id: string | number; id_linea_ruta?: number; description?: string; descripcion?: string }

function ConfirmDialog({ open, onClose, onConfirm, title, description, loading = false }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string; loading?: boolean
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
          <button onClick={onConfirm} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionDropdown({ item, onDeleteClick, onEditOrderClick, isEditingOrder, onSaveOrderClick }: {
  item: RoutePoint; onDeleteClick: () => void; onEditOrderClick: () => void; isEditingOrder: boolean; onSaveOrderClick: () => void
}) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <div className="relative flex justify-end">
      {isEditingOrder ? (
        <button onClick={onSaveOrderClick} className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-900/80">
          <Save className="h-4 w-4" />
        </button>
      ) : (
        <>
          <button onClick={() => setOpen(!open)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
            <MoreVertical className="h-4 w-4" />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full z-40 mt-1 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-900 text-left">
                <button onClick={() => { navigate(`/lineas-puntos/${item.id}`); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                  <Eye className="h-3.5 w-3.5" /> Ver detalle
                </button>
                <button onClick={() => { navigate(`/lineas-puntos/${item.id}/edit`); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </button>
                <button onClick={() => { onEditOrderClick(); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                  <Route className="h-3.5 w-3.5" /> Modificar orden
                </button>
                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                <button onClick={() => { onDeleteClick(); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40">
                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export function RoutePointsPage() {
  const [rows, setRows] = useState<RoutePoint[]>([])
  const [routes, setRoutes] = useState<RouteLite[]>([])
  const [loading, setLoading] = useState(false)
  const [routeId, setRouteId] = useState('')
  const [search, setSearch] = useState('')
  
  const [idPunto, setIdPunto] = useState('')
  const [idPuntoDest, setIdPuntoDest] = useState('')
  const [orden, setOrden] = useState('')
  const [distancia, setDistancia] = useState('')
  const [tiempo, setTiempo] = useState('')

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<RoutePoint | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [editId, setEditId] = useState<string | null>(null)
  const [editOrden, setEditOrden] = useState('1')

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 4000)
  }

  const load = async () => {
    setLoading(true)
    const [pointsRes, routesRes] = await Promise.all([listRoutePoints(), listRoutesLite()])
    if (pointsRes.success) setRows(pointsRes.data)
    else showToast(pointsRes.message || 'Error al cargar puntos', 'error')
    
    if (routesRes.success) {
      setRoutes(routesRes.data)
      if (!routeId && routesRes.data.length) setRouteId(String(routesRes.data[0].id_linea_ruta ?? routesRes.data[0].id))
    }
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  const filtered = useMemo(() => {
    let result = rows.filter((r) => !routeId || String(r.id_linea_ruta ?? r.route_id) === routeId)
    if (search.trim()) {
      result = result.filter(r => 
        String(r.id_punto).includes(search) || 
        String(r.id_punto_dest).includes(search)
      )
    }
    return result.sort((a, b) => (a.orden ?? a.sequence ?? 0) - (b.orden ?? b.sequence ?? 0))
  }, [rows, routeId, search])

  const create = async (e: FormEvent) => {
    e.preventDefault()
    if (!idPunto || !idPuntoDest || !orden) {
      showToast('Por favor completa los campos requeridos (Punto, Destino, Orden)', 'error')
      return
    }
    const res = await createRoutePoint({
      id_linea_ruta: Number(routeId),
      id_punto: Number(idPunto),
      id_punto_dest: Number(idPuntoDest),
      orden: Number(orden),
      distancia: distancia ? Number(distancia) : null,
      tiempo: tiempo ? Number(tiempo) : null,
    })
    
    if (res.success) {
      showToast('Punto agregado correctamente', 'success')
      setIdPunto('')
      setIdPuntoDest('')
      setOrden('')
      setDistancia('')
      setTiempo('')
      await load()
    } else {
      showToast(res.message || 'Error al agregar el punto', 'error')
    }
  }

  const saveEdit = async () => {
    if (!editId) return
    const res = await updateRoutePoint(editId, { orden: Number(editOrden) })
    
    if (res.success) {
      showToast('Orden modificado correctamente', 'success')
      setEditId(null)
      await load()
    } else {
      showToast(res.message || 'Error al modificar orden', 'error')
    }
  }

  const executeDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const res = await deleteRoutePoint(String(deleteTarget.id))
    setDeleteLoading(false)
    if (res.success) {
      showToast('Punto eliminado', 'success')
      setDeleteTarget(null)
      await load()
    } else {
      showToast(res.message || 'Error al eliminar', 'error')
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Líneas Puntos</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Secuencia de coordenadas y paradas para cada trazado.</p>
        </div>
        <Link to="/lineas-puntos/create" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-cyan-600 hover:to-cyan-700 hover:shadow-md active:scale-[0.98]">
          <Plus className="h-4 w-4" /> Nuevo punto completo
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-1 flex-col sm:flex-row min-w-[300px] items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Route className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-900/40" value={routeId} onChange={(e) => setRouteId(e.target.value)}>
              <option value="">Selecciona una ruta...</option>
              {routes.map((r) => <option key={String(r.id)} value={String(r.id_linea_ruta ?? r.id)}>{r.id_linea_ruta ?? r.id} - {r.descripcion ?? r.description ?? 'Ruta'}</option>)}
            </select>
          </div>
          
          <div className="relative w-full sm:flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Buscar por ID de punto..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-900/40" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"><X className="h-3.5 w-3.5" /></button>}
          </div>
        </div>
      </div>

      {/* Quick Add Form */}
      {routeId && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/30">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Plus className="h-4 w-4" /> Adición Rápida (Ruta {routeId})
            </h3>
          </div>
          <form className="grid gap-4 p-5 sm:grid-cols-6 lg:grid-cols-12" onSubmit={create}>
            <div className="sm:col-span-3 lg:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-500">ID Punto Origen *</label>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900" placeholder="Ej: 152" value={idPunto} onChange={(e) => setIdPunto(e.target.value)} required />
            </div>
            <div className="sm:col-span-3 lg:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-500">ID Punto Destino *</label>
              <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900" placeholder="Ej: 153" value={idPuntoDest} onChange={(e) => setIdPuntoDest(e.target.value)} required />
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-500">Orden *</label>
              <input type="number" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900" placeholder="Ej: 5" value={orden} onChange={(e) => setOrden(e.target.value)} required />
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-500">Dist. (km)</label>
              <input type="number" step="0.01" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900" placeholder="0.0" value={distancia} onChange={(e) => setDistancia(e.target.value)} />
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-500">Tiempo (hrs)</label>
              <input type="number" step="0.01" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900" placeholder="0.0" value={tiempo} onChange={(e) => setTiempo(e.target.value)} />
            </div>
            <div className="sm:col-span-6 lg:col-span-2 flex items-end">
              <button className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors">
                Agregar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-cyan-500" /><span className="ml-2 text-sm text-slate-500">Cargando puntos...</span></div>}

      {/* Table */}
      {!loading && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Puntos (Origen → Destino)</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Secuencia</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Coordenadas</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((x) => (
                  <tr key={String(x.id)} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 dark:from-indigo-900/50 dark:to-indigo-800/50 dark:text-indigo-300">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200">#{x.id_punto ?? '-'}</span>
                          <span className="text-slate-400">→</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">#{x.id_punto_dest ?? '-'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {editId === String(x.id) ? (
                        <input type="number" autoFocus className="w-16 rounded-md border border-cyan-400 bg-white px-2 py-1 text-center text-sm font-bold text-cyan-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:bg-slate-900 dark:text-cyan-100" value={editOrden} onChange={(e) => setEditOrden(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEdit()} />
                      ) : (
                        <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {x.orden ?? x.sequence}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {x.lat && x.lng ? (
                        <div className="flex flex-col text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          <span>Lat: {x.lat}</span>
                          <span>Lng: {x.lng}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] italic text-slate-400">Sin coordenadas registradas</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ActionDropdown 
                        item={x} 
                        onDeleteClick={() => setDeleteTarget(x)} 
                        onEditOrderClick={() => { setEditId(String(x.id)); setEditOrden(String(x.orden ?? x.sequence ?? 1)) }}
                        isEditingOrder={editId === String(x.id)}
                        onSaveOrderClick={saveEdit}
                      />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <MapPin className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {routeId ? 'No hay puntos registrados para esta ruta.' : 'Selecciona una ruta para ver sus puntos.'}
                      </p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/30">
            <span className="text-xs text-slate-500 dark:text-slate-400">{filtered.length} puntos en {routeId ? 'esta ruta' : 'total'}</span>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={executeDelete} loading={deleteLoading} title="Eliminar Punto de Ruta" description="¿Estás seguro que deseas eliminar este registro de la secuencia? Esto afectará el trazado de la ruta." />
    </section>
  )
}
