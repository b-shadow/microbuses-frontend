import { ComponentType, FormEvent, useState } from 'react'
import {
  Bus,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Activity,
  Settings,
} from 'lucide-react'

import { useAuth } from '../../../shared/stores/auth-context'

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const result = await login(email, password)
    if (!result.ok) setError(result.message)
    setLoading(false)
  }

  return (
    <div className='min-h-screen bg-slate-100'>
      <div className='grid min-h-screen grid-cols-1 lg:grid-cols-2'>
        <section
          className='relative hidden overflow-hidden lg:flex'
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(230,238,250,.95), rgba(225,233,247,.72)), url('/assets/images/img-login-admin.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-t from-slate-900/25 to-transparent' />
          <div className='relative z-10 flex h-full w-full flex-col justify-between p-14'>
            <div className='max-w-xl'>
              <h1 className='text-6xl font-black leading-tight text-slate-900'>
                Sistema de Control
                <br />
                <span className='text-sky-600'>de Microbuses</span>
              </h1>
              <p className='mt-8 text-3xl leading-snug text-slate-700'>
                Plataforma administrativa para la gestion y control eficiente de tu flota.
              </p>
            </div>
            <div className='space-y-6 pb-4'>
              <FeatureItem icon={ShieldCheck} title='Seguridad' text='Acceso seguro y controlado' />
              <FeatureItem icon={Activity} title='Gestion en tiempo real' text='Monitorea tu flota al instante' />
              <FeatureItem icon={Settings} title='Administracion eficiente' text='Herramientas disenadas para operar mejor' />
            </div>
          </div>
        </section>

        <section className='flex items-center justify-center px-4 py-12 sm:px-8'>
          <div className='w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10'>
            <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sky-100'>
              <Bus className='h-10 w-10 text-sky-600' />
            </div>
            <h2 className='text-center text-5xl font-extrabold text-slate-900'>Acceso Administrador</h2>
            <p className='mt-2 text-center text-2xl text-slate-600'>Inicia sesion para continuar</p>

            <form className='mt-8 space-y-4' onSubmit={onSubmit}>
              <div className='relative'>
                <Mail className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500' />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-4 pl-12 pr-4 text-xl text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
                  placeholder='Email'
                  autoComplete='username'
                />
              </div>

              <div className='relative'>
                <Lock className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500' />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-4 pl-12 pr-12 text-xl text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
                  placeholder='Contrasena'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((prev) => !prev)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-500 transition hover:bg-slate-200/70 hover:text-slate-700'
                  aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                >
                  {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                </button>
              </div>

              {error ? <p className='text-base text-red-600'>{error}</p> : null}
              <button
                disabled={loading}
                className='mt-2 w-full rounded-xl bg-sky-600 px-4 py-4 text-2xl font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>

            <p className='mt-8 text-center text-base text-slate-500'>
              (c) {new Date().getFullYear()} Sistema de Control de Microbuses
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

function FeatureItem({
  icon: Icon,
  title,
  text,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  text: string
}) {
  return (
    <div className='flex items-start gap-4'>
      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100'>
        <Icon className='h-6 w-6 text-sky-700' />
      </div>
      <div>
        <p className='text-3xl font-bold text-slate-800'>{title}</p>
        <p className='text-2xl text-slate-700'>{text}</p>
      </div>
    </div>
  )
}