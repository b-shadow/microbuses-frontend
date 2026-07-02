import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getDriver, updateDriver } from '../services/module.service'

export function DriversEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [licenseCategory, setLicenseCategory] = useState('B')
  const [active, setActive] = useState(true)
  const [birthDate, setBirthDate] = useState('')
  const [sex, setSex] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await getDriver(id)
      if (!res.success) {
        setMessage(res.message)
        setLoadingData(false)
        return
      }
      setFullName(res.data.full_name)
      setPhone(res.data.phone)
      setLicenseCategory(res.data.license_category)
      setActive(res.data.is_active)
      setLoadingData(false)
    }
    void load()
  }, [id])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await updateDriver(id, {
      full_name: fullName,
      phone,
      license_category: licenseCategory,
      is_active: active,
      birth_date: birthDate || undefined,
      sex: sex || undefined,
    })
    setMessage(res.message)
    if (res.success) navigate('/drivers')
    setLoading(false)
  }

  if (loadingData) return <p>Cargando...</p>

  return (
    <section>
      <div className='flex items-center gap-3'>
        <Link className='rounded border px-2 py-1 text-sm dark:border-slate-700' to='/drivers'>
          {'<-'} Volver
        </Link>
        <h1 className='text-xl font-semibold'>Editar conductor</h1>
      </div>

      <form className='mt-4 grid max-w-2xl gap-4' onSubmit={onSubmit}>
        <div>
          <label className='mb-1 block text-sm font-medium'>Nombre completo *</label>
          <input
            className='w-full rounded border px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800'
            placeholder='Nombre completo'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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

        <div>
          <label className='flex items-center gap-2 text-sm'>
            <input type='checkbox' className='rounded' checked={active} onChange={(e) => setActive(e.target.checked)} />
            Conductor activo
          </label>
        </div>

        <div className='flex gap-2'>
          <button
            className='rounded bg-sky-600 px-4 py-1.5 text-white hover:bg-sky-700 disabled:opacity-50'
            type='submit'
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
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
