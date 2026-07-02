import { FormEvent, useMemo, useState } from 'react'
import {
  Shield,
  ShieldCheck,
  UserPlus,
  Search,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Mail,
  User,
  Lock,
  ChevronDown,
  Crown,
  UserCog,
  Power,
  PowerOff,
  Pencil,
  Calendar,
} from 'lucide-react'

import { useModuleActions } from '../hooks/use-module-actions'
import { useModuleList } from '../hooks/use-module-list'
import { AdminRow } from '../services/module.service'

/* helpers */

function formatDate(iso?: string | null): string {
  if (!iso) return '\u2014'
  const d = new Date(iso)
  return d.toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatTime(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('')
}

/* sub-components */

function RoleBadge({ role }: { role: string }) {
  const isSA = role === 'SUPER_ADMIN'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
        isSA
          ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
          : 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300'
      }`}
    >
      {isSA ? <Crown className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
      {isSA ? 'Super Admin' : 'Admin'}
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

function ModalOverlay({ open, onClose, children, title, icon }: {
  open: boolean; onClose: () => void; children: React.ReactNode; title: string; icon: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white">{icon}</div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{title}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel, variant = 'danger', loading = false }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string; confirmLabel: string; variant?: 'danger' | 'success'; loading?: boolean
}) {
  if (!open) return null
  const btnCls = variant === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">{title}</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</button>
          <button onClick={onConfirm} disabled={loading} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${btnCls}`}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionDropdown({ admin, onEdit, onToggleActive }: {
  admin: AdminRow; onEdit: (a: AdminRow) => void; onToggleActive: (a: AdminRow) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-40 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <button onClick={() => { onEdit(admin); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
              <Pencil className="h-3.5 w-3.5" /> Editar
            </button>
            <button onClick={() => { onToggleActive(admin); setOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
              {admin.is_active ? <PowerOff className="h-3.5 w-3.5 text-red-500" /> : <Power className="h-3.5 w-3.5 text-emerald-500" />}
              {admin.is_active ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

/* input field helper */
const inputCls = 'w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-sky-600 dark:focus:ring-sky-900/40'

/* main page */

export function AdminsPage() {
  const { rows, loading, error, reload } = useModuleList()
  const { create, toggleActive, update } = useModuleActions(reload)

  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState<AdminRow | null>(null)
  const [toggleTarget, setToggleTarget] = useState<AdminRow | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'SUPER_ADMIN'>('ADMIN')
  const [createLoading, setCreateLoading] = useState(false)

  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState<'ADMIN' | 'SUPER_ADMIN'>('ADMIN')
  const [editLoading, setEditLoading] = useState(false)

  const [toggleLoading, setToggleLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<'ALL' | 'ADMIN' | 'SUPER_ADMIN'>('ALL')

  const filteredRows = useMemo(() => {
    let list = [...rows].sort((a, b) => (a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1))
    if (filterRole !== 'ALL') list = list.filter((a) => a.role === filterRole)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((a) => a.full_name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q))
    }
    return list
  }, [rows, filterRole, search])

  const totalAdmins = rows.filter((a) => a.role === 'ADMIN').length
  const totalSuperAdmins = rows.filter((a) => a.role === 'SUPER_ADMIN').length
  const activeCount = rows.filter((a) => a.is_active).length

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const resetCreateForm = () => { setEmail(''); setPassword(''); setFullName(''); setRole('ADMIN') }

  const onCreate = async (e: FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)
    const res = await create({ email, password, full_name: fullName, role })
    setCreateLoading(false)
    if (res.success) { showToast(res.message || 'Administrador creado', 'success'); resetCreateForm(); setShowCreate(false) }
    else showToast(res.message || 'Error al crear', 'error')
  }

  const openEdit = (admin: AdminRow) => { setEditTarget(admin); setEditName(admin.full_name); setEditRole(admin.role) }

  const submitEdit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editTarget) return
    setEditLoading(true)
    const res = await update(editTarget.id, { full_name: editName, role: editRole })
    setEditLoading(false)
    if (res.success) { showToast(res.message || 'Actualizado', 'success'); setEditTarget(null) }
    else showToast(res.message || 'Error al actualizar', 'error')
  }

  const confirmToggle = async () => {
    if (!toggleTarget) return
    setToggleLoading(true)
    const res = await toggleActive(toggleTarget.id, toggleTarget.is_active)
    setToggleLoading(false)
    showToast(res.message || (toggleTarget.is_active ? 'Desactivado' : 'Activado'), res.success ? 'success' : 'error')
    setToggleTarget(null)
  }

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Administradores</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Gestion de cuentas ADMIN y SUPER_ADMIN del sistema.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-sky-600 hover:to-sky-700 hover:shadow-md active:scale-[0.98]">
          <UserPlus className="h-4 w-4" /> Nuevo administrador
        </button>
      </div>

      {/* Stat badges */}
      <div className="flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <UserCog className="h-4 w-4 text-slate-500" /><span className="text-sm text-slate-600 dark:text-slate-400">Total</span><span className="text-sm font-bold text-slate-900 dark:text-slate-100">{rows.length}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 dark:border-sky-800 dark:bg-sky-950/30">
          <Shield className="h-4 w-4 text-sky-600 dark:text-sky-400" /><span className="text-sm text-sky-700 dark:text-sky-300">Admins</span><span className="text-sm font-bold text-sky-800 dark:text-sky-200">{totalAdmins}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 dark:border-amber-800 dark:bg-amber-950/30">
          <Crown className="h-4 w-4 text-amber-600 dark:text-amber-400" /><span className="text-sm text-amber-700 dark:text-amber-300">Super Admins</span><span className="text-sm font-bold text-amber-800 dark:text-amber-200">{totalSuperAdmins}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 dark:border-emerald-800 dark:bg-emerald-950/30">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /><span className="text-sm text-emerald-700 dark:text-emerald-300">Activos</span><span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">{activeCount}</span>
        </div>
      </div>

      {/* Search & filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Buscar por nombre o email..." value={search} onChange={(e) => setSearch(e.target.value)} className={inputCls} />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"><X className="h-3.5 w-3.5" /></button>}
        </div>
        <div className="relative">
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value as 'ALL' | 'ADMIN' | 'SUPER_ADMIN')} className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 transition-colors focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus:border-sky-600 dark:focus:ring-sky-900/40">
            <option value="ALL">Todos los roles</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {error && <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"><AlertCircle className="h-4 w-4 shrink-0" /> {error}</div>}
      {loading && <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-sky-500" /><span className="ml-2 text-sm text-slate-500">Cargando administradores...</span></div>}

      {/* Table */}
      {!loading && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Administrador</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rol</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Estado</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Registrado</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRows.map((admin) => (
                  <tr key={admin.id} className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${!admin.is_active ? 'opacity-60' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${admin.role === 'SUPER_ADMIN' ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-sky-500 to-sky-600'}`}>
                          {getInitials(admin.full_name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{admin.full_name}</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><RoleBadge role={admin.role} /></td>
                    <td className="px-5 py-4"><StatusDot active={admin.is_active} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(admin.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right"><ActionDropdown admin={admin} onEdit={openEdit} onToggleActive={(a) => setToggleTarget(a)} /></td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">{search || filterRole !== 'ALL' ? 'No se encontraron administradores con esos filtros.' : 'No hay administradores registrados.'}</p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/30">
            <span className="text-xs text-slate-500 dark:text-slate-400">{filteredRows.length} de {rows.length} administrador{rows.length !== 1 ? 'es' : ''}</span>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <ModalOverlay open={showCreate} onClose={() => { setShowCreate(false); resetCreateForm() }} title="Nuevo administrador" icon={<UserPlus className="h-5 w-5" />}>
        <form onSubmit={onCreate} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Nombre completo</label>
            <div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Juan Perez" className={inputCls} /></div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</label>
            <div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ejemplo.com" className={inputCls} /></div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Contrasena</label>
            <div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimo 8 caracteres" className={inputCls} /></div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Rol</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select value={role} onChange={(e) => setRole(e.target.value as 'ADMIN' | 'SUPER_ADMIN')} className={`${inputCls} appearance-none pr-10`}>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { setShowCreate(false); resetCreateForm() }} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</button>
            <button type="submit" disabled={createLoading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-sky-600 hover:to-sky-700 disabled:opacity-50">
              {createLoading && <Loader2 className="h-4 w-4 animate-spin" />} Crear administrador
            </button>
          </div>
        </form>
      </ModalOverlay>

      {/* Edit Modal */}
      <ModalOverlay open={!!editTarget} onClose={() => setEditTarget(null)} title="Editar administrador" icon={<Pencil className="h-5 w-5" />}>
        <form onSubmit={submitEdit} className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${editTarget?.role === 'SUPER_ADMIN' ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-sky-500 to-sky-600'}`}>
              {editTarget ? getInitials(editTarget.full_name) : ''}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{editTarget?.email}</p>
              <p className="text-xs text-slate-500">Registrado: {formatDate(editTarget?.created_at)}</p>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Nombre completo</label>
            <div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} className={inputCls} /></div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Rol</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select value={editRole} onChange={(e) => setEditRole(e.target.value as 'ADMIN' | 'SUPER_ADMIN')} className={`${inputCls} appearance-none pr-10`}>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setEditTarget(null)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</button>
            <button type="submit" disabled={editLoading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-sky-600 hover:to-sky-700 disabled:opacity-50">
              {editLoading && <Loader2 className="h-4 w-4 animate-spin" />} Guardar cambios
            </button>
          </div>
        </form>
      </ModalOverlay>

      {/* Toggle Confirm */}
      <ConfirmDialog
        open={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={confirmToggle}
        loading={toggleLoading}
        title={toggleTarget?.is_active ? 'Desactivar administrador' : 'Activar administrador'}
        description={toggleTarget?.is_active ? `Estas seguro de desactivar a "${toggleTarget?.full_name}"? No podra acceder al sistema.` : `Deseas activar nuevamente a "${toggleTarget?.full_name}"?`}
        confirmLabel={toggleTarget?.is_active ? 'Desactivar' : 'Activar'}
        variant={toggleTarget?.is_active ? 'danger' : 'success'}
      />
    </section>
  )
}
