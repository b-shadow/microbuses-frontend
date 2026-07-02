import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Bus,
  MapPin,
  Route,
  UserCheck,
  UserX,
  Clock,
  Navigation,
  TrendingUp,
  Activity,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Zap,
  Map,
  Settings,
  Shield,
} from 'lucide-react'

import { DashboardData, getAdminDashboard } from '../services/module.service'

/* ──────────────────────── helpers ──────────────────────── */

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    PENDING: {
      label: 'Pendiente',
      cls: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      icon: <Clock className="h-3 w-3" />,
    },
    APPROVED: {
      label: 'Aprobado',
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    REJECTED: {
      label: 'Rechazado',
      cls: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800',
      icon: <XCircle className="h-3 w-3" />,
    },
  }
  const s = map[status] ?? { label: status, cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', icon: null }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${s.cls}`}>
      {s.icon}{s.label}
    </span>
  )
}

/* ──────────────────────── sub-components ──────────────────────── */

type StatCardProps = {
  title: string
  value: number
  icon: React.ReactNode
  accent: string
  bgGrad: string
  onClick?: () => void
}

function StatCard({ title, value, icon, accent, bgGrad, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-start gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300
        border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5
        dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700`}
    >
      {/* decorative gradient blob */}
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20 ${bgGrad}`} />

      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        {icon}
      </div>
      <div className="relative z-10 flex flex-col">
        <span className="text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">{title}</span>
        <span className="mt-1 text-2xl font-bold tabular-nums leading-none text-slate-900 dark:text-slate-50">{value.toLocaleString()}</span>
      </div>
    </button>
  )
}

type QuickActionProps = {
  label: string
  icon: React.ReactNode
  to: string
  color: string
}

function QuickAction({ label, icon, to, color }: QuickActionProps) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className={`group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
        dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700`}
    >
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  )
}

/* ──────────────────────── ring chart (tiny) ──────────────────────── */

type RingSegment = { value: number; color: string; label: string }

function MiniRing({ segments, size = 80 }: { segments: RingSegment[]; size?: number }) {
  const total = segments.reduce((a, s) => a + s.value, 0)
  if (total === 0) return <div className="flex items-center justify-center" style={{ width: size, height: size }}><span className="text-xs text-slate-400">Sin datos</span></div>

  const r = (size - 12) / 2
  const c = size / 2
  const circumference = 2 * Math.PI * r
  let offset = 0

  return (
    <svg width={size} height={size} className="shrink-0">
      {segments.map((seg, i) => {
        const pct = seg.value / total
        const dashLength = pct * circumference
        const dashOffset = -offset
        offset += dashLength
        return (
          <circle
            key={i}
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={10}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-700"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          />
        )
      })}
      <text x={c} y={c} textAnchor="middle" dominantBaseline="central" className="fill-slate-900 text-sm font-bold dark:fill-slate-50">
        {total}
      </text>
    </svg>
  )
}

/* ──────────────────────── main page ──────────────────────── */

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getAdminDashboard()
      .then((res) => {
        if (res.success) setData(res.data)
        else setError(true)
      })
      .catch(() => setError(true))
  }, [])

  /* ── loading ── */
  if (!data && !error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Cargando dashboard…</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-sm text-red-500">Error al cargar el dashboard.</p>
      </div>
    )
  }

  const { counts, driver_status, bus_status, recent_drivers, recent_lines } = data

  const driverRingSegments: RingSegment[] = [
    { value: driver_status.approved, color: '#10b981', label: 'Aprobados' },
    { value: driver_status.pending, color: '#f59e0b', label: 'Pendientes' },
    { value: driver_status.rejected, color: '#ef4444', label: 'Rechazados' },
  ]

  const busRingSegments: RingSegment[] = [
    { value: bus_status.active, color: '#0ea5e9', label: 'Activos' },
    { value: bus_status.inactive, color: '#94a3b8', label: 'Inactivos' },
  ]

  return (
    <section className="space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Resumen general del sistema de microbuses</p>
      </div>

      {/* ── Stat cards grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Conductores"
          value={counts.drivers}
          icon={<Users className="h-5 w-5 text-white" />}
          accent="bg-gradient-to-br from-violet-500 to-violet-600"
          bgGrad="bg-violet-400"
          onClick={() => navigate('/drivers')}
        />
        <StatCard
          title="Microbuses"
          value={counts.buses}
          icon={<Bus className="h-5 w-5 text-white" />}
          accent="bg-gradient-to-br from-sky-500 to-sky-600"
          bgGrad="bg-sky-400"
          onClick={() => navigate('/buses')}
        />
        <StatCard
          title="Líneas"
          value={counts.lineas}
          icon={<Route className="h-5 w-5 text-white" />}
          accent="bg-gradient-to-br from-emerald-500 to-emerald-600"
          bgGrad="bg-emerald-400"
          onClick={() => navigate('/lineas')}
        />
        <StatCard
          title="Viajes activos"
          value={counts.active_trips}
          icon={<Activity className="h-5 w-5 text-white" />}
          accent="bg-gradient-to-br from-amber-500 to-orange-500"
          bgGrad="bg-amber-400"
          onClick={() => navigate('/active-trips')}
        />
      </div>

      {/* ── Secondary stats ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Rutas"
          value={counts.rutas}
          icon={<Navigation className="h-5 w-5 text-white" />}
          accent="bg-gradient-to-br from-cyan-500 to-teal-500"
          bgGrad="bg-cyan-400"
          onClick={() => navigate('/linea-ruta')}
        />
        <StatCard
          title="Puntos / Paradas"
          value={counts.stops}
          icon={<MapPin className="h-5 w-5 text-white" />}
          accent="bg-gradient-to-br from-rose-500 to-pink-500"
          bgGrad="bg-rose-400"
          onClick={() => navigate('/puntos')}
        />
        <StatCard
          title="Usuarios App"
          value={counts.users}
          icon={<UserCheck className="h-5 w-5 text-white" />}
          accent="bg-gradient-to-br from-indigo-500 to-indigo-600"
          bgGrad="bg-indigo-400"
        />
        <StatCard
          title="Asignaciones"
          value={counts.assignments}
          icon={<TrendingUp className="h-5 w-5 text-white" />}
          accent="bg-gradient-to-br from-fuchsia-500 to-fuchsia-600"
          bgGrad="bg-fuchsia-400"
          onClick={() => navigate('/bus-assignments')}
        />
      </div>

      {/* ── Breakdowns row ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Driver approval */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Estado de conductores</h2>
          <div className="mt-5 flex items-center gap-8">
            <MiniRing segments={driverRingSegments} size={96} />
            <ul className="flex-1 space-y-3">
              {driverRingSegments.map((seg) => (
                <li key={seg.label} className="flex items-center gap-2 text-sm">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="flex-1 text-slate-600 dark:text-slate-400">{seg.label}</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">{seg.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bus status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Estado de microbuses</h2>
          <div className="mt-5 flex items-center gap-8">
            <MiniRing segments={busRingSegments} size={96} />
            <ul className="flex-1 space-y-3">
              {busRingSegments.map((seg) => (
                <li key={seg.label} className="flex items-center gap-2 text-sm">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: seg.color }} />
                  <span className="flex-1 text-slate-600 dark:text-slate-400">{seg.label}</span>
                  <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">{seg.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Recent entities row ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent drivers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Conductores recientes</h2>
            <button onClick={() => navigate('/drivers')} className="text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">
              Ver todos →
            </button>
          </div>
          {recent_drivers.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No hay conductores registrados.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {recent_drivers.map((d) => (
                <div
                  key={d.id}
                  onClick={() => navigate(`/drivers/${d.id}`)}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-xs font-bold text-white">
                    {d.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{d.full_name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{d.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {statusBadge(d.approval_status)}
                    <span className="text-[11px] text-slate-400">{formatDate(d.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent lines */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Líneas recientes</h2>
            <button onClick={() => navigate('/lineas')} className="text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300">
              Ver todas →
            </button>
          </div>
          {recent_lines.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">No hay líneas registradas.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {recent_lines.map((l) => (
                <div
                  key={l.id}
                  onClick={() => navigate(`/lineas/${l.id}`)}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: l.color || '#94a3b8' }}
                  >
                    {l.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{l.nombre}</p>
                  </div>
                  <span className="text-[11px] text-slate-400">{formatDate(l.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Acciones rápidas</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            label="Nuevo conductor"
            icon={<Users className="h-4 w-4 text-white" />}
            to="/drivers/create"
            color="bg-gradient-to-br from-violet-500 to-violet-600"
          />
          <QuickAction
            label="Nuevo microbus"
            icon={<Bus className="h-4 w-4 text-white" />}
            to="/buses/create"
            color="bg-gradient-to-br from-sky-500 to-sky-600"
          />
          <QuickAction
            label="Nueva línea"
            icon={<Route className="h-4 w-4 text-white" />}
            to="/lineas/create"
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
          <QuickAction
            label="Editor de mapa"
            icon={<Map className="h-4 w-4 text-white" />}
            to="/map-editor"
            color="bg-gradient-to-br from-amber-500 to-orange-500"
          />
          <QuickAction
            label="Tracking en vivo"
            icon={<Zap className="h-4 w-4 text-white" />}
            to="/tracking"
            color="bg-gradient-to-br from-cyan-500 to-teal-500"
          />
          <QuickAction
            label="Auditoría"
            icon={<Shield className="h-4 w-4 text-white" />}
            to="/audit"
            color="bg-gradient-to-br from-rose-500 to-pink-500"
          />
          <QuickAction
            label="Importaciones"
            icon={<UserX className="h-4 w-4 text-white" />}
            to="/imports"
            color="bg-gradient-to-br from-indigo-500 to-indigo-600"
          />
          <QuickAction
            label="Configuración"
            icon={<Settings className="h-4 w-4 text-white" />}
            to="/settings"
            color="bg-gradient-to-br from-slate-500 to-slate-600"
          />
        </div>
      </div>
    </section>
  )
}
