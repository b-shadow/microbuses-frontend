import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Route, Plus, Search, X, Loader2, CheckCircle2, XCircle,
  MoreVertical, Eye, Pencil, Trash2, Activity, Map as MapIcon, Timer, Ruler
} from 'lucide-react'

import { deactivateRoute, listLinesLite, listRoutes } from '../services/module.service'

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
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}Desactivar
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionDropdown({ item, onDeleteClick }: {
  item: RouteRow; onDeleteClick: () => void
}) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-40 mt-1 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <button onClick={() => { navigate(`/linea-ruta/${item.id_linea_ruta ?? item.id}`); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
              <Eye className="h-3.5 w-3.5" /> Ver detalle
            </button>
            <button onClick={() => { navigate(`/linea-ruta/${item.id_linea_ruta ?? item.id}/edit`); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
              <Pencil className="h-3.5 w-3.5" /> Editar
            </button>
            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
            <button onClick={() => { onDeleteClick(); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40">
              <Trash2 className="h-3.5 w-3.5" /> Desactivar
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function RoutesPage() {
  const [rows, setRows] = useState<RouteRow[]>([])
  const [lines, setLines] = useState<LineRow[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<RouteRow | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 4000)
  }

  const load = async () => {
    setLoading(true)
    const [rRes, lRes] = await Promise.all([listRoutes(), listLinesLite()])
    if (rRes.success) setRows(rRes.data)
    else showToast(rRes.message || 'Error al cargar recorridos', 'error')
    
    if (lRes.success) setLines(lRes.data)
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  const lineMap = useMemo(() => new Map(lines.map((l) => [String(l.id_linea ?? l.id), l])), [lines])

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((d) => {
      const line = lineMap.get(String(d.id_linea))
      const matchDesc = (d.descripcion || '').toLowerCase().includes(q)
      const matchLine = line?.nombre_linea?.toLowerCase().includes(q)
      return matchDesc || matchLine
    })
  }, [rows, search, lineMap])

  const activeCount = rows.filter((d) => d.is_active).length

  const executeDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const res = await deactivateRoute(String(deleteTarget.id_linea_ruta ?? deleteTarget.id))
    setDeleteLoading(false)
    if (res.success) {
      showToast('Recorrido desactivado', 'success')
      setDeleteTarget(null)
      await load()
    } else {
      showToast(res.message || 'Error al desactivar', 'error')
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Trazados de Ruta (Ida/Vuelta)</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Gestion de recorridos de ida o retorno para las lineas operativas.</p>
        </div>
        <Link to="/linea-ruta/create" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-cyan-600 hover:to-cyan-700 hover:shadow-md active:scale-[0.98]">
          <Plus className="h-4 w-4" /> Nuevo recorrido
        </Link>
      </div>

      {/* Stats & Search */}
      <div className="flex flex-wrap gap-3">
        <div className="inline-flex flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Buscar por descripcion o linea..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-cyan-600 dark:focus:ring-cyan-900/40" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"><X className="h-3.5 w-3.5" /></button>}
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Route className="h-4 w-4 text-slate-500" /><span className="text-sm text-slate-600 dark:text-slate-400">Total</span><span className="text-sm font-bold text-slate-900 dark:text-slate-100">{rows.length}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 dark:border-emerald-800 dark:bg-emerald-950/30">
          <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /><span className="text-sm text-emerald-700 dark:text-emerald-300">Activos</span><span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">{activeCount}</span>
        </div>
      </div>

      {loading && <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-cyan-500" /><span className="ml-2 text-sm text-slate-500">Cargando recorridos...</span></div>}

      {/* Table */}
      {!loading && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recorrido</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Linea Base</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tipo</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Metricas</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Estado</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRows.map((d) => {
                  const line = lineMap.get(String(d.id_linea))
                  return (
                    <tr key={String(d.id_linea_ruta ?? d.id)} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-700 dark:from-cyan-900/50 dark:to-cyan-800/50 dark:text-cyan-300">
                            <Route className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">{d.descripcion || 'Sin descripcion'}</p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">ID: {d.id_linea_ruta ?? d.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: line?.color_linea || '#cbd5e1' }} />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{line?.nombre_linea ?? line?.name ?? line?.code ?? `ID: ${d.id_linea}`}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-bold ${String(d.id_ruta) === '1' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'}`}>
                          {String(d.id_ruta) === '1' ? '1 - Salida' : String(d.id_ruta) === '2' ? '2 - Retorno' : `Ruta ${d.id_ruta}`}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5" /> {d.distancia ? `${d.distancia} km` : '-'}</span>
                          <span className="flex items-center gap-1.5"><Timer className="h-3.5 w-3.5" /> {d.tiempo ? `${d.tiempo} hrs` : '-'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${d.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                          {d.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {d.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <ActionDropdown item={d} onDeleteClick={() => setDeleteTarget(d)} />
                      </td>
                    </tr>
                  )
                })}
                {filteredRows.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">No se encontraron recorridos.</p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/30">
            <span className="text-xs text-slate-500 dark:text-slate-400">{filteredRows.length} de {rows.length} recorridos</span>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={executeDelete} loading={deleteLoading} title="Desactivar Recorrido" description={`Estas seguro que deseas desactivar el recorrido "${deleteTarget?.descripcion}"?`} />
    </section>
  )
}
