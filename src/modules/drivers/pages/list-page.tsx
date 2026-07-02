import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Users, UserPlus, Search, X, Loader2, AlertCircle, CheckCircle2, XCircle, Clock,
  MoreVertical, ChevronDown, Phone, CreditCard, Shield, Trash2, Eye, Pencil,
  Calendar, Filter,
} from 'lucide-react'

import { approveDriver, deleteDriver, DriverRow, listDrivers, rejectDriver } from '../services/module.service'

/* helpers */

function formatDate(iso: string | null): string {
  if (!iso) return '\u2014'
  return new Date(iso).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('')
}

const approvalConfig: Record<DriverRow['approval_status'], { label: string; cls: string; icon: React.ReactNode }> = {
  PENDING: {
    label: 'Pendiente',
    cls: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
    icon: <Clock className="h-3 w-3" />,
  },
  APPROVED: {
    label: 'Aprobado',
    cls: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  REJECTED: {
    label: 'Rechazado',
    cls: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300',
    icon: <XCircle className="h-3 w-3" />,
  },
}

function ApprovalBadge({ status }: { status: DriverRow['approval_status'] }) {
  const c = approvalConfig[status]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${c.cls}`}>
      {c.icon}{c.label}
    </span>
  )
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-2 w-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      <span className={`text-xs font-medium ${active ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
        {active ? 'Activo' : 'Inactivo'}
      </span>
    </span>
  )
}

/* Confirm dialog */
function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel, variant = 'danger', loading = false }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string; confirmLabel: string; variant?: 'danger' | 'success'; loading?: boolean
}) {
  if (!open) return null
  const btnCls = variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">{title}</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</button>
          <button onClick={onConfirm} disabled={loading} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${btnCls}`}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}{confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/* Action dropdown */
function ActionDropdown({ driver, onApprove, onReject, onDelete }: {
  driver: DriverRow; onApprove: () => void; onReject: () => void; onDelete: () => void
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
            <button onClick={() => { navigate(`/drivers/${driver.id}`); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
              <Eye className="h-3.5 w-3.5" /> Ver detalle
            </button>
            <button onClick={() => { navigate(`/drivers/${driver.id}/edit`); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
              <Pencil className="h-3.5 w-3.5" /> Editar
            </button>
            {driver.approval_status !== 'APPROVED' && (
              <button onClick={() => { onApprove(); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40">
                <CheckCircle2 className="h-3.5 w-3.5" /> Aprobar
              </button>
            )}
            {driver.approval_status !== 'REJECTED' && (
              <button onClick={() => { onReject(); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40">
                <XCircle className="h-3.5 w-3.5" /> Rechazar
              </button>
            )}
            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
            <button onClick={() => { onDelete(); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40">
              <Trash2 className="h-3.5 w-3.5" /> Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/* main page */

export function DriversPage() {
  const [rows, setRows] = useState<DriverRow[]>([])
  const [statusFilter, setStatusFilter] = useState<'ALL' | DriverRow['approval_status']>('ALL')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject' | 'delete'; driver: DriverRow } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const load = async () => {
    setLoading(true)
    const res = await listDrivers(statusFilter === 'ALL' ? undefined : statusFilter)
    if (res.success) setRows(res.data)
    else showToast(res.message || 'No se pudo cargar conductores', 'error')
    setLoading(false)
  }

  useEffect(() => { void load() }, [statusFilter])

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((d) => d.full_name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q) || d.ci.includes(q))
  }, [rows, search])

  const pendingCount = rows.filter((d) => d.approval_status === 'PENDING').length
  const approvedCount = rows.filter((d) => d.approval_status === 'APPROVED').length
  const rejectedCount = rows.filter((d) => d.approval_status === 'REJECTED').length

  const executeAction = async () => {
    if (!confirmAction) return
    setActionLoading(true)
    const { type, driver } = confirmAction
    let res
    if (type === 'approve') res = await approveDriver(driver.id)
    else if (type === 'reject') res = await rejectDriver(driver.id)
    else res = await deleteDriver(driver.id)
    setActionLoading(false)
    showToast(res.message || 'Operacion realizada', res.success ? 'success' : 'error')
    setConfirmAction(null)
    if (res.success) await load()
  }

  const confirmLabels = {
    approve: { title: 'Aprobar conductor', desc: `Aprobar a "${confirmAction?.driver.full_name}"?`, btn: 'Aprobar', variant: 'success' as const },
    reject: { title: 'Rechazar conductor', desc: `Rechazar a "${confirmAction?.driver.full_name}"?`, btn: 'Rechazar', variant: 'danger' as const },
    delete: { title: 'Eliminar conductor', desc: `Eliminar a "${confirmAction?.driver.full_name}"? Esta accion no se puede deshacer.`, btn: 'Eliminar', variant: 'danger' as const },
  }
  const cl = confirmAction ? confirmLabels[confirmAction.type] : null

  return (
    <section className="space-y-6">
      {/* Toast */}
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Conductores</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Gestion de cuentas de conductores del sistema.</p>
        </div>
        <Link to="/drivers/create" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-violet-600 hover:to-violet-700 hover:shadow-md active:scale-[0.98]">
          <UserPlus className="h-4 w-4" /> Nuevo conductor
        </Link>
      </div>

      {/* Stat badges */}
      <div className="flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Users className="h-4 w-4 text-slate-500" /><span className="text-sm text-slate-600 dark:text-slate-400">Total</span><span className="text-sm font-bold text-slate-900 dark:text-slate-100">{rows.length}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 dark:border-amber-800 dark:bg-amber-950/30">
          <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" /><span className="text-sm text-amber-700 dark:text-amber-300">Pendientes</span><span className="text-sm font-bold text-amber-800 dark:text-amber-200">{pendingCount}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 dark:border-emerald-800 dark:bg-emerald-950/30">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /><span className="text-sm text-emerald-700 dark:text-emerald-300">Aprobados</span><span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">{approvedCount}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 dark:border-red-800 dark:bg-red-950/30">
          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" /><span className="text-sm text-red-700 dark:text-red-300">Rechazados</span><span className="text-sm font-bold text-red-800 dark:text-red-200">{rejectedCount}</span>
        </div>
      </div>

      {/* Search & filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Buscar por nombre, email o CI..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-slate-400 transition-colors focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-sky-600 dark:focus:ring-sky-900/40" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"><X className="h-3.5 w-3.5" /></button>}
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            <option value="ALL">Todos los estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="APPROVED">Aprobados</option>
            <option value="REJECTED">Rechazados</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {loading && <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-violet-500" /><span className="ml-2 text-sm text-slate-500">Cargando conductores...</span></div>}

      {/* Table */}
      {!loading && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Conductor</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">CI</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Telefono</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Licencia</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Aprobacion</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Estado</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRows.map((d) => (
                  <tr key={d.id} className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${!d.is_active ? 'opacity-60' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-sm font-bold text-white">
                          {getInitials(d.full_name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{d.full_name}</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{d.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                        <CreditCard className="h-3.5 w-3.5 text-slate-400" /> {d.ci}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                        <Phone className="h-3.5 w-3.5 text-slate-400" /> {d.phone}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <Shield className="h-3 w-3" /> {d.license_category}
                      </span>
                    </td>
                    <td className="px-5 py-4"><ApprovalBadge status={d.approval_status} /></td>
                    <td className="px-5 py-4"><StatusDot active={d.is_active} /></td>
                    <td className="px-5 py-4 text-right">
                      <ActionDropdown
                        driver={d}
                        onApprove={() => setConfirmAction({ type: 'approve', driver: d })}
                        onReject={() => setConfirmAction({ type: 'reject', driver: d })}
                        onDelete={() => setConfirmAction({ type: 'delete', driver: d })}
                      />
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">No se encontraron conductores.</p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/30">
            <span className="text-xs text-slate-500 dark:text-slate-400">{filteredRows.length} de {rows.length} conductor{rows.length !== 1 ? 'es' : ''}</span>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmAction && cl && (
        <ConfirmDialog
          open={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={executeAction}
          loading={actionLoading}
          title={cl.title}
          description={cl.desc}
          confirmLabel={cl.btn}
          variant={cl.variant}
        />
      )}
    </section>
  )
}
