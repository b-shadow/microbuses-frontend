import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createDriver } from '../services/module.service'

export function DriversCreatePage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ci, setCi] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [licenseCategory, setLicenseCategory] = useState('B')
  const [message, setMessage] = useState('')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await createDriver({ email, password, ci, full_name: fullName, phone, license_category: licenseCategory })
    setMessage(res.message)
    if (res.success) navigate('/drivers')
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Nuevo conductor</h1>
      <form className='mt-3 grid max-w-2xl gap-2' onSubmit={onSubmit}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Contraseña' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='CI' value={ci} onChange={(e) => setCi(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Nombre completo' value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Teléfono' value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' placeholder='Licencia' value={licenseCategory} onChange={(e) => setLicenseCategory(e.target.value)} required />
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Guardar</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
    </section>
  )
}
