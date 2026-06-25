import { FormEvent, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { updateRoutePoint } from '../services/module.service'

export function RoutePointsEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [orden, setOrden] = useState('1')
  const [idPunto, setIdPunto] = useState('')
  const [idPuntoDest, setIdPuntoDest] = useState('')
  const [distancia, setDistancia] = useState('')
  const [tiempo, setTiempo] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const res = await updateRoutePoint(id, {
      orden: orden ? Number(orden) : undefined,
      id_punto: idPunto ? Number(idPunto) : undefined,
      id_punto_dest: idPuntoDest ? Number(idPuntoDest) : undefined,
      distancia: distancia ? Number(distancia) : undefined,
      tiempo: tiempo ? Number(tiempo) : undefined,
    })
    setMessage(res.message)
    if (res.success) navigate('/lineas-puntos')
  }

  return (
    <section>
      <h1 className='text-xl font-semibold'>Editar punto de linea ruta</h1>
      <form className='mt-3 grid max-w-xl gap-2' onSubmit={onSubmit}>
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={orden} onChange={(e) => setOrden(e.target.value)} placeholder='Orden' />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={idPunto} onChange={(e) => setIdPunto(e.target.value)} placeholder='Id punto' />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={idPuntoDest} onChange={(e) => setIdPuntoDest(e.target.value)} placeholder='Id punto destino' />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={distancia} onChange={(e) => setDistancia(e.target.value)} placeholder='Distancia' />
        <input className='rounded border px-2 py-1 dark:border-slate-700 dark:bg-slate-800' value={tiempo} onChange={(e) => setTiempo(e.target.value)} placeholder='Tiempo' />
        <button className='rounded bg-sky-600 px-3 py-1 text-white'>Actualizar</button>
      </form>
      {message ? <p className='mt-2 text-sm'>{message}</p> : null}
    </section>
  )
}
