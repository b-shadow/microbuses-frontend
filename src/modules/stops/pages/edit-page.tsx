import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, X, MapPin, Loader2, Save } from 'lucide-react'

import { getStop, updateStop } from '../services/module.service'

export function StopsEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  
  const [descripcion, setDescripcion] = useState('')
  const [latitud, setLatitud] = useState('')
  const [longitud, setLongitud] = useState('')
  const [stopType, setStopType] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    const load = async () => {
      setInitLoading(true)
      const res = await getStop(id)
      if (res.success && res.data) {
        setDescripcion(res.data.descripcion || '')
        setLatitud(res.data.latitud != null ? String(res.data.latitud) : '')
        setLongitud(res.data.longitud != null ? String(res.data.longitud) : '')
        setStopType(res.data.stop || '')
      } else {
        setErrorMsg(res.message || 'Error al cargar el punto o punto no encontrado.')
      }
      setInitLoading(false)
    }
    void load()
  }, [id])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!descripcion || !latitud || !longitud) {
      showToast('Por favor completa todos los campos obligatorios', 'error')
      return
    }
    
    setLoading(true)
    const res = await updateStop(id, {
      descripcion,
      latitud: Number(latitud),
      longitud: Number(longitud),
      stop: stopType
    })
    setLoading(false)
    
    if (res.success) {
      navigate('/puntos')
    } else {
      showToast(res.message || 'Error al actualizar el punto', 'error')
    }
  }

  if (initLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
      </div>
    )
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <XCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Algo salió mal</h2>
        <p className="mt-2 text-sm text-slate-500">{errorMsg}</p>
        <Link to="/puntos" className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
          Volver a la lista
        </Link>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      {toast && (
        <div className={`fixed right-4 top-4 z-[60] flex items-center gap-2 rounded-xl border px-4 py-3 shadow-lg ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/80 dark:text-red-300'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/10"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/puntos" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Editar Punto</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Modifica los detalles de esta parada o punto geográfico.</p>
        </div>
      </div>

      {/* Form */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            <Save className="h-4 w-4 text-rose-500" />
            Actualización de Datos
          </h2>
        </div>
        
        <form onSubmit={onSubmit} className="p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Descripción del Punto *</label>
              <input 
                type="text"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-rose-600 dark:focus:ring-rose-900/40" 
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)} 
                placeholder="Ej: Parada 4to Anillo Av. Banzer" 
                required 
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Latitud *</label>
              <input 
                type="number"
                step="any"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-rose-600 dark:focus:ring-rose-900/40" 
                value={latitud} 
                onChange={(e) => setLatitud(e.target.value)} 
                placeholder="-17.7833" 
                required 
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Longitud *</label>
              <input 
                type="number"
                step="any"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-rose-600 dark:focus:ring-rose-900/40" 
                value={longitud} 
                onChange={(e) => setLongitud(e.target.value)} 
                placeholder="-63.1821" 
                required 
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Tipo de Punto</label>
              <input 
                type="text"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-rose-600 dark:focus:ring-rose-900/40" 
                value={stopType} 
                onChange={(e) => setStopType(e.target.value)} 
                placeholder="Ej: N" 
              />
              <p className="mt-1.5 text-xs text-slate-500">Clasificador opcional (N para normal, P para parada principal, etc).</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row dark:border-slate-800">
            <Link to="/puntos" className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
              Cancelar
            </Link>
            <button disabled={loading} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-rose-600 hover:to-pink-700 hover:shadow-md disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
