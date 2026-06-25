import { PropsWithChildren, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '../../shared/stores/auth-context'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/drivers', label: 'Conductores' },
  { to: '/admins', label: 'Administradores' },
  { to: '/buses', label: 'Microbuses' },
  { to: '/bus-assignments', label: 'Asignaciones' },
  { to: '/lineas', label: 'Lineas' },
  { to: '/variants', label: 'Variantes' },
  { to: '/linea-ruta', label: 'Linea ruta' },
  { to: '/lineas-puntos', label: 'Lineas puntos' },
  { to: '/puntos', label: 'Puntos' },
  { to: '/map-editor', label: 'Editor Mapa' },
  { to: '/imports', label: 'Importaciones' },
  { to: '/active-trips', label: 'Viajes' },
  { to: '/active-buses', label: 'Buses activos' },
  { to: '/tracking', label: 'Tracking' },
  { to: '/lineas-cercanas', label: 'Lineas cercanas' },
  { to: '/offline-packages', label: 'Offline' },
  { to: '/audit', label: 'Auditoria' },
  { to: '/settings', label: 'Configuracion' },
]

const THEME_KEY = 'sig_admin_theme'
type ThemeMode = 'light' | 'dark'

export function AdminLayout({ children }: PropsWithChildren) {
  const { logout, role } = useAuth()
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem(THEME_KEY) as ThemeMode) || 'light')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50'>
      <header className='sticky top-0 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900'>
        <div className='mx-auto flex max-w-7xl items-center justify-between'>
          <strong>Microbuses SIG</strong>
          <div className='flex items-center gap-2'>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className='rounded-md border border-slate-300 px-3 py-1 text-sm dark:border-slate-700'>
              {theme === 'dark' ? 'Claro' : 'Oscuro'}
            </button>
            <span className='rounded bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800'>{role ?? 'ADMIN'}</span>
            <button onClick={logout} className='rounded-md border border-slate-300 px-3 py-1 text-sm dark:border-slate-700'>Salir</button>
          </div>
        </div>
      </header>
      <div className='mx-auto grid max-w-7xl grid-cols-12 gap-4 p-4'>
        <aside className='col-span-12 rounded-lg border border-slate-200 bg-white p-3 md:col-span-3 dark:border-slate-800 dark:bg-slate-900'>
          <nav className='space-y-2 text-sm'>
            {links.map((x) => (
              <NavLink
                key={x.to}
                to={x.to}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 ${isActive ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }
              >
                {x.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className='col-span-12 rounded-lg border border-slate-200 bg-white p-4 md:col-span-9 dark:border-slate-800 dark:bg-slate-900'>{children}</main>
      </div>
    </div>
  )
}
