import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  Link, useNavigate
} from 'react-router-dom'
import {
  Bus, User, Link as LinkIcon, Unlink, CheckCircle2, XCircle, AlertCircle, X, Search,
  Loader2, Activity, Calendar, ShieldCheck, Map as MapIcon
} from 'lucide-react'

import { createAssignment, listAssignments, listBusesLite, listDriversLite, removeAssignment } from '../services/module.service'

type AssignmentRow = { id: string; bus_id: string; driver_id: string; is_active: boolean; assigned_at?: string | null }
type BusRow = { id: string; plate: string; internal_number?: string }
type DriverRow = { id: string; full_name: string; approval_status: string }

function formatDate(iso?: string | null): string {
  if (!iso) return '\u2014'
  const d = new Date(iso)
  return d.toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('')
}

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
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}Remover
          </button>
        </div>
      </div>
    </div>
  )
}

export function BusAssignmentsPage() {
  const [rows, setRows] = useState<AssignmentRow[]>([])
  const [buses, setBuses] = useState<BusRow[]>([])
  const [drivers, setDrivers] = useState<DriverRow[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [busId, setBusId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [createLoading, setCreateLoading] = useState(false)

  const [confirmTarget, setConfirmTarget] = useState<AssignmentRow | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 4000)
  }

  const load = async () => {
    setLoading(true)
    const [a, b, d] = await Promise.all([listAssignments(), listBusesLite(), listDriversLite()])
    if (a.success) setRows(a.data)
    else showToast(a.message || 'Error al cargar', 'error')

    if (b.success) {
      setBuses(b.data)
      if (!busId && b.data.length) setBusId(b.data[0].id)
    }
    if (d.success) {
      setDrivers(d.data)
      if (!driverId && d.data.length) setDriverId(d.data[0].id)
    }
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  const busMap = useMemo(() => new Map(buses.map((b) => [b.id, b])), [buses])
  const driverMap = useMemo(() => new Map(drivers.map((d) => [d.id, d])), [drivers])

  const filteredRows = useMemo(() => {
    let res = rows
    if (search.trim()) {
      const q = search.toLowerCase()
      res = res.filter((r) => {
        const b = busMap.get(r.bus_id)
        const d = driverMap.get(r.driver_id)
        return b?.plate.toLowerCase().includes(q) || d?.full_name.toLowerCase().includes(q)
      })
    }
    return res
  }, [rows, search, busMap, driverMap])

  const activeCount = rows.filter((r) => r.is_active).length

  const onCreate = async (e: FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)
    const res = await createAssignment(busId, driverId)
    setCreateLoading(false)
    if (res.success) {
      showToast('Asignacion creada exitosamente', 'success')
      await load()
    } else {
      showToast(res.message || 'Error al asignar', 'error')
    }
  }

  const executeRemove = async () => {
    if (!confirmTarget) return
    setActionLoading(true)
    const res = await removeAssignment(confirmTarget.bus_id, confirmTarget.driver_id)
    setActionLoading(false)
    if (res.success) {
      showToast('Asignacion removida', 'success')
      setConfirmTarget(null)
      await load()
    } else {
      showToast(res.message || 'Error', 'error')
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Asignaciones</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Vincula conductores aprobados con microbuses disponibles.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Creation Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2 text-orange-600 dark:text-orange-500">
            <LinkIcon className="h-5 w-5" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Nueva asignacion</h2>
          </div>
          <form onSubmit={onCreate} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Microbus</label>
              <div className="relative">
                <Bus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select value={busId} onChange={(e) => setBusId(e.target.value)} required className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm transition-colors focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-orange-600 dark:focus:ring-orange-900/40">
                  {buses.map((b) => <option key={b.id} value={b.id}>{b.plate}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Conductor</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select value={driverId} onChange={(e) => setDriverId(e.target.value)} required className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm transition-colors focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-orange-600 dark:focus:ring-orange-900/40">
                  {drivers.map((d) => <option key={d.id} value={d.id}>{d.full_name}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={createLoading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50">
              {createLoading && <Loader2 className="h-4 w-4 animate-spin" />} Asignar Conductor
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Stats & Search */}
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Buscar por placa o conductor..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <Activity className="h-4 w-4 text-slate-500" /><span className="text-sm text-slate-600 dark:text-slate-400">Total</span><span className="text-sm font-bold text-slate-900 dark:text-slate-100">{rows.length}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 dark:border-emerald-800 dark:bg-emerald-950/30">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /><span className="text-sm text-emerald-700 dark:text-emerald-300">Activas</span><span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">{activeCount}</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Conductor</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Microbus</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Estado</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Asignado</th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center"><Loader2 className="inline h-6 w-6 animate-spin text-orange-500" /></td></tr>
                  )}
                  {!loading && filteredRows.map((r) => {
                    const bus = busMap.get(r.bus_id)
                    const driver = driverMap.get(r.driver_id)
                    const driverName = driver?.full_name || 'Desconocido'
                    const busPlate = bus?.plate || 'Desconocido'

                    return (
                      <tr key={r.id} className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${!r.is_active ? 'opacity-60' : ''}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {getInitials(driverName)}
                            </div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{driverName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                              <Bus className="h-4 w-4" />
                            </div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{busPlate}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${r.is_active ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                            {r.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {r.is_active ? 'Activa' : 'Inactiva'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <Calendar className="h-3 w-3" /> {formatDate(r.assigned_at)}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {r.is_active && (
                            <button onClick={() => setConfirmTarget(r)} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/40">
                              <Unlink className="h-3.5 w-3.5" /> Remover
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                  {!loading && filteredRows.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">No se encontraron asignaciones.</p>
                      </div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/30">
              <span className="text-xs text-slate-500 dark:text-slate-400">{filteredRows.length} de {rows.length} asignaciones</span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={executeRemove}
        loading={actionLoading}
        title="Remover Asignacion"
        description="Estas seguro de remover esta asignacion? El conductor ya no podra operar este microbus."
      />
    </section>
  )
}
