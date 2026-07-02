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
    <div className='min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100'>
      <div className='flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8'>
        <div className='w-full max-w-6xl'>
          <div className='grid grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid-cols-2'>
            
            {/* Panel Izquierdo - Información */}
            <div className='relative bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 p-8 lg:p-12'>
              <div className='absolute inset-0 bg-teal-950 opacity-20'></div>
              
              <div className='relative z-10 flex h-full flex-col'>
                <div className='mb-8'>
                  <div className='mb-6 flex items-center gap-3'>
                    <img src='/favicon.png' alt='RUTEO Logo' className='h-14 w-14 rounded-xl border-2 border-cyan-400 shadow-md object-cover' />
                    <h1 className='text-3xl font-bold text-cyan-300 tracking-wider font-display'>RUTEO</h1>
                  </div>
                  <h2 className='mb-4 text-4xl font-extrabold leading-tight text-white lg:text-5xl font-display'>
                    Sistema de Información Geográfica
                  </h2>
                  <p className='text-lg leading-relaxed text-teal-100'>
                    Para consultar, gestionar y calcular rutas de microbuses en Santa Cruz de la Sierra.
                  </p>
                </div>

                <div className='mt-auto space-y-4'>
                  <FeatureCard 
                    icon={ShieldCheck} 
                    title='Consultar Rutas' 
                    description='Acceso a información de rutas y recorridos'
                  />
                  <FeatureCard 
                    icon={Activity} 
                    title='Gestión de Microbuses' 
                    description='Administración completa de flotas y líneas'
                  />
                  <FeatureCard 
                    icon={Settings} 
                    title='Cálculo de Rutas' 
                    description='Sistema inteligente de planificación de trayectos'
                  />
                </div>
              </div>
            </div>

            {/* Panel Derecho - Formulario de Login */}
            <div className='flex items-center justify-center p-8 lg:p-12'>
              <div className='w-full max-w-md'>
                <div className='mb-8 text-center'>
                  <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 shadow-lg'>
                    <Lock className='h-8 w-8 text-white' />
                  </div>
                  <h3 className='mb-2 text-3xl font-bold text-gray-900 font-display'>Iniciar Sesión</h3>
                  <p className='text-sm text-gray-600'>
                    Ingresa tus credenciales para acceder al sistema
                  </p>
                </div>

                <form className='space-y-6' onSubmit={onSubmit}>
                  {/* Campo Email */}
                  <div>
                    <label htmlFor='email' className='mb-2 block text-sm font-medium text-gray-900'>
                      Correo Electrónico
                    </label>
                    <div className='relative'>
                      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5'>
                        <Mail className='h-5 w-5 text-gray-400' />
                      </div>
                      <input
                        type='email'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-11 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                        placeholder='nombre@ejemplo.com'
                        required
                        autoComplete='username'
                      />
                    </div>
                  </div>

                  {/* Campo Contraseña */}
                  <div>
                    <label htmlFor='password' className='mb-2 block text-sm font-medium text-gray-900'>
                      Contraseña
                    </label>
                    <div className='relative'>
                      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5'>
                        <Lock className='h-5 w-5 text-gray-400' />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-11 pr-11 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                        placeholder='••••••••'
                        required
                        autoComplete='current-password'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword((prev) => !prev)}
                        className='absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition hover:text-gray-600'
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                      </button>
                    </div>
                  </div>

                  {/* Checkbox Recordarme */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-start'>
                      <div className='flex h-5 items-center'>
                        <input
                          id='remember'
                          type='checkbox'
                          className='h-4 w-4 rounded border-gray-300 bg-gray-50 text-cyan-600 focus:ring-2 focus:ring-cyan-500'
                        />
                      </div>
                      <label htmlFor='remember' className='ml-2 text-sm text-gray-600'>
                        Recordarme
                      </label>
                    </div>
                    <a href='#' className='text-sm font-medium text-cyan-600 hover:underline'>
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  {/* Mensaje de Error */}
                  {error && (
                    <div className='rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-800'>
                      <div className='flex items-center gap-2'>
                        <svg className='h-5 w-5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                        </svg>
                        <span>{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Botón de Envío */}
                  <button
                    type='submit'
                    disabled={loading}
                    className='w-full rounded-lg bg-gradient-to-r from-cyan-500 to-teal-600 px-5 py-3 text-center text-sm font-medium text-white shadow-lg transition hover:from-cyan-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:from-cyan-500 disabled:hover:to-teal-600'
                  >
                    {loading ? (
                      <span className='flex items-center justify-center gap-2'>
                        <svg className='h-5 w-5 animate-spin' viewBox='0 0 24 24' fill='none'>
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                        </svg>
                        Ingresando...
                      </span>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </button>
                </form>

                <div className='mt-8 text-center text-xs text-gray-500'>
                  © {new Date().getFullYear()} Sistema de Información Geográfica - Santa Cruz de la Sierra
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className='flex items-start gap-4 rounded-xl bg-white bg-opacity-10 p-4 transition hover:bg-opacity-15'>
      <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white bg-opacity-20'>
        <Icon className='h-5 w-5 text-white' />
      </div>
      <div>
        <h3 className='mb-1 font-semibold text-white font-display'>{title}</h3>
        <p className='text-sm text-teal-100'>{description}</p>
      </div>
    </div>
  )
}