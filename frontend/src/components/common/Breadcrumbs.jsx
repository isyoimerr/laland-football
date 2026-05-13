import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ items = [] }) {
  return (
    <div className="flex items-center gap-2 text-2xs text-text-muted">
      <Link to="/" className="hover:text-accent-teal transition">
        Inicio
      </Link>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <ChevronRight size={14} />
          {item.href ? (
            <Link to={item.href} className="hover:text-accent-teal transition">
              {item.label}
            </Link>
          ) : (
            <span className="text-text-primary font-semibold">{item.label}</span>
          )}
        </div>
      ))}
    </div>
  )
}
