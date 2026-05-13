import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWindowSize } from '@hooks/useWindowSize'

export default function DataTable({ data = [], columns = [], onEdit, onDelete, onRowClick, isLoading = false, loading = false, rowsPerPage = 10 }) {
  const { width } = useWindowSize()
  const [page, setPage] = useState(1)
  const [sortField, setSortField] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [search, setSearch] = useState('')

  const itemsPerPage = rowsPerPage || 10
  const isLoadingState = isLoading || loading

  const filtered = data.filter(row =>
    columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(search.toLowerCase()))
  )

  let sorted = [...filtered]
  if (sortField) {
    sorted.sort((a, b) => {
      const aVal = a[sortField] ?? ''
      const bVal = b[sortField] ?? ''
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }

  const totalPages = Math.ceil(sorted.length / itemsPerPage)
  const paged = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
    setPage(1)
  }

  if (isLoadingState) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Búsqueda */}
      {data.length > 5 && (
        <input
          type="search"
          placeholder="Buscar..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="input-base max-w-xs"
        />
      )}

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-text-muted text-xs">
          {search ? `Sin resultados para "${search}"` : 'Sin datos registrados.'}
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Mobile: Grid, Desktop: Table */}
          {width < 768 ? (
            <div className="space-y-3 p-4">
              {paged.map((row, i) => (
                <motion.div
                  key={row.id ?? i}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`border border-border rounded p-3 space-y-2 ${onRowClick ? 'cursor-pointer' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                >
                  {columns.map(col => (
                    <div key={col.key} className="flex justify-between items-start gap-2">
                      <span className="text-2xs font-semibold text-text-muted">{col.label}:</span>
                      <span className="text-xs text-text-secondary">
                        {col.render ? col.render(row) : (row[col.key] ?? '—')}
                      </span>
                    </div>
                  ))}
                  {(onEdit || onDelete) && (
                    <div className="flex gap-2 pt-2">
                      {onEdit && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(row) }}
                          className="flex-1 px-2.5 py-1.5 rounded text-2xs font-semibold bg-accent-blue/10 text-accent-blue border border-accent-blue/20 hover:bg-accent-blue/20 transition-colors"
                        >
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(row) }}
                          className="flex-1 px-2.5 py-1.5 rounded text-2xs font-semibold bg-accent-red/10 text-accent-red border border-accent-red/20 hover:bg-accent-red/20 transition-colors"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {columns.map(col => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 text-left text-text-muted font-medium select-none ${col.sortable ? 'cursor-pointer hover:text-text-primary transition-colors' : ''}`}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        {col.sortable && (
                          <span className={`text-2xs ${sortField === col.key ? 'text-accent-green' : 'text-text-muted opacity-40'}`}>
                            {sortField === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                  {(onEdit || onDelete) && (
                    <th className="px-4 py-3 text-right text-text-muted font-medium">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map((row, i) => (
                  <motion.tr
                    key={row.id ?? i}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`hover:bg-bg-tertiary/40 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                  >
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3 text-text-secondary">
                        {col.render ? col.render(row) : (row[col.key] ?? '—')}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onEdit && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onEdit(row) }}
                              className="px-2.5 py-1 rounded text-2xs font-semibold bg-accent-blue/10 text-accent-blue border border-accent-blue/20 hover:bg-accent-blue/20 transition-colors"
                            >
                              Editar
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onDelete(row) }}
                              className="px-2.5 py-1 rounded text-2xs font-semibold bg-accent-red/10 text-accent-red border border-accent-red/20 hover:bg-accent-red/20 transition-colors"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-border flex items-center justify-between">
              <span className="text-2xs text-text-muted">
                {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, sorted.length)} de {sorted.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary px-2.5 py-1 text-2xs disabled:opacity-40"
                >
                  ←
                </button>
                <span className="text-2xs text-text-muted px-2">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary px-2.5 py-1 text-2xs disabled:opacity-40"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
