import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bus, Plus, Search, X, Loader2, AlertCircle, CheckCircle2, XCircle,
  MoreVertical, ChevronDown, Map as MapIcon, Hash, Activity, Pencil, Eye, LayoutGrid, Wrench, Settings
} from 'lucide-react'

import { changeBusLine, listBuses, listLines } from '../services/module.service'

type BusRow = { id: string; plate: string; model: string; seats_count: number; internal_number: string; line_id: string | number; status: string }
type LineRow = { id: string | number; id_linea?: number; nombre_linea?: string; code?: string; name?: string; color_linea?: string; color?: string }

const statusConfig: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  ACTIVE: {
    label: 'Activo',
    cls: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  INACTIVE: {
    label: 'Inactivo',
    cls: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
    icon: <XCircle className="h-3 w-3" />,
  },
  MAINTENANCE: {
    label: 'Mantenimiento',
    cls: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
    icon: <Wrench className="h-3 w-3" />,
  },
}

function StatusBadge({ status }: { status: string }) {
  const c = statusConfig[status.toUpperCase()] || {
    label: status,
    cls: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
    icon: <Activity className="h-3 w-3" />
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${c.cls}`}>
      {c.icon}{c.label}
    </span>
  )
}

function ActionDropdown({ bus, onChangeLineClick }: {
  bus: BusRow; onChangeLineClick: () => void
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
            <button onClick={() => { navigate(`/buses/${bus.id}`); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
              <Eye className="h-3.5 w-3.5" /> Ver detalle
            </button>
            <button onClick={() => { navigate(`/buses/${bus.id}/edit`); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
              <Pencil className="h-3.5 w-3.5" /> Editar
            </button>
            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
            <button onClick={() => { onChangeLineClick(); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/40">
              <MapIcon className="h-3.5 w-3.5" /> Cambiar de linea
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function ChangeLineDialog({ open, onClose, bus, lines, onConfirm, loading }: {
  open: boolean; onClose: () => void; bus: BusRow | null; lines: LineRow[]; onConfirm: (busId: string, lineId: string) => void; loading: boolean
}) {
  const [selected, setSelected] = useState('')
  useEffect(() => { if (bus) setSelected(String(bus.line_id)) }, [bus])
  if (!open || !bus) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Cambiar linea</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Selecciona la nueva linea para el microbus <strong className="text-slate-700 dark:text-slate-300">{bus.plate}</strong>.</p>
        <div className="mt-4">
          <select value={selected} onChange={(e) => setSelected(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-10 text-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {lines.map((line) => (
              <option key={String(line.id)} value={String(line.id_linea ?? line.id)}>{line.nombre_linea ?? line.name ?? line.code ?? line.id}</option>
            ))}
          </select>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</button>
          <button onClick={() => onConfirm(bus.id, selected)} disabled={loading || !selected} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export function BusesPage() {
  const [rows, setRows] = useState<BusRow[]>([])
  const [lines, setLines] = useState<LineRow[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [changeLineTarget, setChangeLineTarget] = useState<BusRow | null>(null)
  const [changeLoading, setChangeLoading] = useState(false)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 4000)
  }

  const load = async () => {
    setLoading(true)
    const [busesRes, linesRes] = await Promise.all([listBuses(), listLines()])
    if (busesRes.success) setRows(busesRes.data)
    else showToast(busesRes.message || 'No se pudo cargar', 'error')
    if (linesRes.success) setLines(linesRes.data)
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  const lineNameById = useMemo(() => {
    const map = new Map<string, string>()
    lines.forEach((line) => map.set(String(line.id_linea ?? line.id), `${line.nombre_linea ?? line.name ?? line.code ?? line.id}`))
    return map
  }, [lines])

  const filteredRows = useMemo(() => {
    let res = rows
    if (statusFilter !== 'ALL') res = res.filter((d) => d.status.toUpperCase() === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      res = res.filter((d) => d.plate.toLowerCase().includes(q) || d.internal_number.toLowerCase().includes(q))
    }
    return res
  }, [rows, search, statusFilter])

  const activeCount = rows.filter((d) => d.status.toUpperCase() === 'ACTIVE').length
  const maintenanceCount = rows.filter((d) => d.status.toUpperCase() === 'MAINTENANCE').length

  const executeChangeLine = async (busId: string, lineId: string) => {
    setChangeLoading(true)
    const res = await changeBusLine(busId, lineId)
    setChangeLoading(false)
    if (res.success) {
      showToast('Linea actualizada', 'success')
      setChangeLineTarget(null)
      await load()
    } else {
      showToast(res.message || 'Error al cambiar', 'error')
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Microbuses</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Gestion de la flota de microbuses y lineas.</p>
        </div>
        <Link to="/buses/create" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-teal-600 hover:to-teal-700 hover:shadow-md active:scale-[0.98]">
          <Plus className="h-4 w-4" /> Nuevo microbus
        </Link>
      </div>

      {/* Stat badges */}
      <div className="flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Bus className="h-4 w-4 text-slate-500" /><span className="text-sm text-slate-600 dark:text-slate-400">Total</span><span className="text-sm font-bold text-slate-900 dark:text-slate-100">{rows.length}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 dark:border-emerald-800 dark:bg-emerald-950/30">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /><span className="text-sm text-emerald-700 dark:text-emerald-300">Activos</span><span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">{activeCount}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 dark:border-amber-800 dark:bg-amber-950/30">
          <Wrench className="h-4 w-4 text-amber-600 dark:text-amber-400" /><span className="text-sm text-amber-700 dark:text-amber-300">Mantenimiento</span><span className="text-sm font-bold text-amber-800 dark:text-amber-200">{maintenanceCount}</span>
        </div>
      </div>

      {/* Search & filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Buscar por placa o nro interno..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 transition-colors focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-teal-600 dark:focus:ring-teal-900/40" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"><X className="h-3.5 w-3.5" /></button>}
        </div>
        <div className="relative">
          <Settings className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-700 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <option value="ALL">Todos los estados</option>
            <option value="ACTIVE">Activos</option>
            <option value="INACTIVE">Inactivos</option>
            <option value="MAINTENANCE">En Mantenimiento</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {loading && <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-teal-500" /><span className="ml-2 text-sm text-slate-500">Cargando microbuses...</span></div>}

      {/* Table */}
      {!loading && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Microbus</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Asientos</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Linea Asignada</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Estado</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRows.map((d) => (
                  <tr key={d.id} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-sm font-bold text-white shadow-inner">
                          {d.internal_number}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">{d.plate}</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{d.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                        <LayoutGrid className="h-3.5 w-3.5 text-slate-400" /> {d.seats_count}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <MapIcon className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" /> {lineNameById.get(String(d.line_id)) || d.line_id || 'Sin linea'}
                      </span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={d.status} /></td>
                    <td className="px-5 py-4 text-right">
                      <ActionDropdown bus={d} onChangeLineClick={() => setChangeLineTarget(d)} />
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">No se encontraron microbuses.</p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/30">
            <span className="text-xs text-slate-500 dark:text-slate-400">{filteredRows.length} de {rows.length} microbuses</span>
          </div>
        </div>
      )}

      {/* Dialog */}
      <ChangeLineDialog open={!!changeLineTarget} onClose={() => setChangeLineTarget(null)} bus={changeLineTarget} lines={lines} onConfirm={executeChangeLine} loading={changeLoading} />
    </section>
  )
}
