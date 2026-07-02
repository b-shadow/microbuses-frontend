import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { createDriver } from '../services/module.service'

export function DriversCreatePage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ci, setCi] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [licenseCategory, setLicenseCategory] = useState('B')
  const [birthDate, setBirthDate] = useState('')
  const [sex, setSex] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await createDriver({
      email,
      password,
      ci,
      full_name: fullName,
      phone,
      license_category: licenseCategory,
      birth_date: birthDate || undefined,
      sex: sex || undefined,
    })
    setMessage(res.message)
    if (res.success) navigate('/drivers')
    setLoading(false)
  }

  return (
    <section>
      <div className='flex items-center gap-3'>
        <Link className='rounded border px-2 py-1 text-sm dark:border-slate-700' to='/drivers'>
          {'<-'} Volver
        </Link>
        <h1 className='text-xl font-semibold'>Nuevo conductor</h1>
      </div>

      <form className='mt-4 grid max-w-2xl gap-4' onSubmit={onSubmit}>
        <div>
          <label className='mb-1 block text-sm font-medium'>Email *</label>
          <input
            className='w-full rounded border px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800'
            type='email'
            placeholder='conductor@ejemplo.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium'>Password *</label>
          <input
            className='w-full rounded border px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800'
            type='password'
            placeholder='Minimo 8 caracteres'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div>
            <label className='mb-1 block text-sm font-medium'>CI (Cedula de identidad) *</label>
            <input
              className='w-full rounded border px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800'
              placeholder='12345678'
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              required
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium'>Nombre completo *</label>
            <input
              className='w-full rounded border px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800'
              placeholder='Juan Perez'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div>
            <label className='mb-1 block text-sm font-medium'>Telefono *</label>
            <input
              className='w-full rounded border px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800'
              placeholder='70000000'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium'>Categoria de licencia *</label>
            <select
              className='w-full rounded border px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800'
              value={licenseCategory}
              onChange={(e) => setLicenseCategory(e.target.value)}
              required
            >
              <option value='A'>A</option>
              <option value='B'>B</option>
              <option value='C'>C</option>
              <option value='P'>P (Profesional)</option>
              <option value='T'>T (Transporte)</option>
            </select>
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div>
            <label className='mb-1 block text-sm font-medium'>Fecha de nacimiento</label>
            <input
              className='w-full rounded border px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800'
              type='date'
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium'>Sexo</label>
            <select
              className='w-full rounded border px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800'
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <option value=''>-- Seleccionar --</option>
              <option value='M'>Masculino</option>
              <option value='F'>Femenino</option>
            </select>
          </div>
        </div>

        <div className='flex gap-2'>
          <button
            className='rounded bg-sky-600 px-4 py-1.5 text-white hover:bg-sky-700 disabled:opacity-50'
            type='submit'
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <Link className='rounded border px-4 py-1.5 dark:border-slate-700' to='/drivers'>
            Cancelar
          </Link>
        </div>
      </form>

      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}
    </section>
  )
}
