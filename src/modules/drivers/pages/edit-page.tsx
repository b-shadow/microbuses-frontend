import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getDriver, updateDriver } from '../services/module.service'

export function DriversEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [licenseCategory, setLicenseCategory] = useState('B')
  const [active, setActive] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await getDriver(id)
      if (!res.success) {
        setMessage(res.message)
        return
      }
      setFullName(res.data.full_name)
      setPhone(res.data.phone)
      setLicenseCategory(res.data.license_category)
      setActive(res.data.is_active)
    }
    void load()
  }, [id])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await updateDriver(id, {
      full_name: fullName,
      phone,
      license_category: licenseCategory,
      is_active: active,
    })
    setMessage(res.message)
    if (res.success) navigate('/drivers')
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Editar conductor</h1>
      <form className='mt-3 grid max-w-xl gap-2' onSubmit={onSubmit}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Nombre completo' value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Teléfono' value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Licencia' value={licenseCategory} onChange={(e) => setLicenseCategory(e.target.value)} required />
        <label className='text-sm'><input type='checkbox' className='mr-2' checked={active} onChange={(e) => setActive(e.target.checked)} />Activo</label>
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Actualizar</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
    </section>
  )
}
