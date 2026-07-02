import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, User, Phone, Shield, Calendar, Users2, Loader2, CheckCircle2, XCircle, X, ChevronDown, ToggleLeft, ToggleRight,
} from 'lucide-react'

import { getDriver, updateDriver } from '../services/module.service'

const inputCls = 'w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-violet-600 dark:focus:ring-violet-900/40'
const labelCls = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'

export function DriversEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [licenseCategory, setLicenseCategory] = useState('B')
  const [active, setActive] = useState(true)
  const [birthDate, setBirthDate] = useState('')
  const [sex, setSex] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    const load = async () => {
      const res = await getDriver(id)
      if (res.success) {
        setFullName(res.data.full_name); setPhone(res.data.phone); setLicenseCategory(res.data.license_category); setActive(res.data.is_active)
      } else showToast(res.message || 'Error al cargar', 'error')
      setLoadingData(false)
    }
    void load()
  }, [id])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await updateDriver(id, { full_name: fullName, phone, license_category: licenseCategory, is_active: active, birth_date: birthDate || undefined, sex: sex || undefined })
    setLoading(false)
    if (res.success) navigate('/drivers')
    else showToast(res.message || 'Error al actualizar', 'error')
  }

  if (loadingData) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-violet-500" /></div>

  return (
    <section className="space-y-6">
      {toast && (
        <div className={`fixed right-4 top-4 z-[60] flex items-center gap-2 rounded-xl border px-4 py-3 shadow-lg ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/80 dark:text-red-300'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 rounded p-0.5 hover:bg-black/5"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Link to="/drivers" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Editar conductor</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Actualizar la informacion del conductor.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <label className={labelCls}>Nombre completo *</label>
          <div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} /></div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Telefono *</label>
            <div className="relative"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} /></div>
          </div>
          <div>
            <label className={labelCls}>Categoria de licencia *</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select value={licenseCategory} onChange={(e) => setLicenseCategory(e.target.value)} required className={`${inputCls} appearance-none pr-10`}>
                <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="P">P (Profesional)</option><option value="T">T (Transporte)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Fecha de nacimiento</label>
            <div className="relative"><Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={inputCls} /></div>
          </div>
          <div>
            <label className={labelCls}>Sexo</label>
            <div className="relative">
              <Users2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select value={sex} onChange={(e) => setSex(e.target.value)} className={`${inputCls} appearance-none pr-10`}>
                <option value="">-- Seleccionar --</option><option value="M">Masculino</option><option value="F">Femenino</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Active toggle */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
          <button type="button" onClick={() => setActive(!active)} className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              {active ? <ToggleRight className="h-6 w-6 text-emerald-500" /> : <ToggleLeft className="h-6 w-6 text-slate-400" />}
              <div className="text-left">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Conductor activo</p>
                <p className="text-xs text-slate-500">El conductor {active ? 'puede' : 'no puede'} acceder al sistema.</p>
              </div>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
              {active ? 'Activo' : 'Inactivo'}
            </span>
          </button>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
          <Link to="/drivers" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</Link>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-violet-600 hover:to-violet-700 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Actualizar conductor
          </button>
        </div>
      </form>
    </section>
  )
}
