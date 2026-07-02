import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Pencil, CheckCircle2, XCircle, Trash2, Loader2, X, Clock,
  Mail, User, CreditCard, Phone, Shield, Calendar, Activity,
} from 'lucide-react'

import { approveDriver, deleteDriver, DriverRow, getDriver, rejectDriver } from '../services/module.service'

function formatDate(iso: string | null): string {
  if (!iso) return '\u2014'
  return new Date(iso).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('')
}

const approvalConfig: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Pendiente', cls: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300', icon: <Clock className="h-3.5 w-3.5" /> },
  APPROVED: { label: 'Aprobado', cls: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  REJECTED: { label: 'Rechazado', cls: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300', icon: <XCircle className="h-3.5 w-3.5" /> },
}

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

function InfoField({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
      </div>
    </div>
  )
}

export function DriversDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [row, setRow] = useState<DriverRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | 'delete' | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 4000)
  }

  const load = async () => {
    setLoading(true)
    const res = await getDriver(id)
    if (res.success) setRow(res.data)
    else showToast(res.message || 'No se pudo cargar', 'error')
    setLoading(false)
  }

  useEffect(() => { void load() }, [id])

  const executeAction = async () => {
    if (!confirmAction || !row) return
    setActionLoading(true)
    let res
    if (confirmAction === 'approve') res = await approveDriver(id)
    else if (confirmAction === 'reject') res = await rejectDriver(id)
    else res = await deleteDriver(id)
    setActionLoading(false)
    showToast(res.message || 'Operacion realizada', res.success ? 'success' : 'error')
    setConfirmAction(null)
    if (res.success) {
      if (confirmAction === 'delete') navigate('/drivers')
      else await load()
    }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-violet-500" /></div>
  if (!row) return <p className="py-8 text-center text-sm text-slate-500">Conductor no encontrado.</p>

  const ac = approvalConfig[row.approval_status] || approvalConfig.PENDING

  return (
    <section className="space-y-6">
      {toast && (
        <div className={`fixed right-4 top-4 z-[60] flex items-center gap-2 rounded-xl border px-4 py-3 shadow-lg ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/80 dark:text-red-300'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 rounded p-0.5 hover:bg-black/5"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/drivers" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Detalle del conductor</h1>
        </div>
      </div>

      {/* Profile card */}
      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 text-lg font-bold text-white">
            {getInitials(row.full_name)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{row.full_name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{row.email}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ac.cls}`}>
              {ac.icon}{ac.label}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${row.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span className="text-xs text-slate-500">{row.is_active ? 'Activo' : 'Inactivo'}</span>
            </span>
          </div>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2">
          <InfoField icon={<CreditCard className="h-4 w-4" />} label="Cedula de identidad" value={row.ci} />
          <InfoField icon={<Phone className="h-4 w-4" />} label="Telefono" value={row.phone} />
          <InfoField icon={<Shield className="h-4 w-4" />} label="Categoria de licencia" value={row.license_category} />
          <InfoField icon={<Calendar className="h-4 w-4" />} label="Fecha de registro" value={formatDate(row.created_at)} />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <Link to={`/drivers/${row.id}/edit`} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-violet-600 hover:to-violet-700">
            <Pencil className="h-3.5 w-3.5" /> Editar
          </Link>
          {row.approval_status !== 'APPROVED' && (
            <button onClick={() => setConfirmAction('approve')} className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/40">
              <CheckCircle2 className="h-3.5 w-3.5" /> Aprobar
            </button>
          )}
          {row.approval_status !== 'REJECTED' && (
            <button onClick={() => setConfirmAction('reject')} className="inline-flex items-center gap-2 rounded-xl border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/40">
              <XCircle className="h-3.5 w-3.5" /> Rechazar
            </button>
          )}
          <button onClick={() => setConfirmAction('delete')} className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/40">
            <Trash2 className="h-3.5 w-3.5" /> Eliminar
          </button>
        </div>
      </div>

      {/* Confirm */}
      {confirmAction && (
        <ConfirmDialog
          open={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={executeAction}
          loading={actionLoading}
          title={confirmAction === 'approve' ? 'Aprobar conductor' : confirmAction === 'reject' ? 'Rechazar conductor' : 'Eliminar conductor'}
          description={confirmAction === 'delete' ? `Eliminar a "${row.full_name}"? Esta accion no se puede deshacer.` : `${confirmAction === 'approve' ? 'Aprobar' : 'Rechazar'} a "${row.full_name}"?`}
          confirmLabel={confirmAction === 'approve' ? 'Aprobar' : confirmAction === 'reject' ? 'Rechazar' : 'Eliminar'}
          variant={confirmAction === 'approve' ? 'success' : 'danger'}
        />
      )}
    </section>
  )
}
