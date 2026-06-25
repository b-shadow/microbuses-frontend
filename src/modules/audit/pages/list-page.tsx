import { useEffect, useState } from 'react'

import { AuditRow, listAuditLogs } from '../services/module.service'

export function AuditPage() {
  const [rows, setRows] = useState<AuditRow[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    listAuditLogs().then((r) => {
      if (r.success) {
        setRows(r.data)
        setMessage('')
      } else {
        setMessage(r.message)
      }
    })
  }, [])

  return (
    <section>
      <h1 className='text-xl font-semibold'>Auditoria</h1>
      {message ? <p className='mt-2 text-sm text-sky-600 dark:text-sky-300'>{message}</p> : null}
      <div className='mt-4 overflow-auto'>
        <table className='min-w-full text-sm'>
          <thead><tr className='text-left'><th>Fecha</th><th>Actor</th><th>Accion</th><th>Entidad</th></tr></thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id} className='border-t'>
                <td>{new Date(x.created_at).toLocaleString()}</td>
                <td>{x.actor_type}</td>
                <td>{x.action}</td>
                <td>{x.entity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}