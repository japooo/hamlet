import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { useAuditionStore } from '../store/auditionStore'

interface StateSummary {
  generatedAt: string
  bullets: string[]
  errorBreakdown: { label: string; count: number; color: string }[]
  weakLines: string[]
}

const MOCK_SUMMARY: StateSummary = {
  generatedAt: new Date().toISOString(),
  bullets: [
    'Siempre te comes las ultimas dos palabras de los monologos largos — prueba a repetirlos solo a mitad de velocidad.',
    'La tasa de parafraseo es mayor en los versos 3-5 del Acto III Escena 1; trabaja esos momentos por separado.',
    '"Ser o no ser" fue preciso el 100% de las veces. Esa linea ya es tuya.',
    'Las senales emocionales en la seccion "Vete a un convento" suenan apresuradas — prueba a hacer pausas antes de cada orden.',
    'Mejoras en las muletillas: solo 2 "eeh" esta sesion frente a 7 la ultima vez.',
  ],
  errorBreakdown: [
    { label: 'Palabras omitidas', count: 14, color: 'bg-red-400' },
    { label: 'Parafraseo', count: 9, color: 'bg-orange-400' },
    { label: 'Ritmo / timing', count: 6, color: 'bg-yellow-400' },
    { label: 'Muletillas', count: 2, color: 'bg-blue-400' },
    { label: 'Palabras de mas', count: 1, color: 'bg-purple-400' },
  ],
  weakLines: [
    "El ojo, la lengua y la espada del cortesano, el soldado, el sabio\u2026",
    "Y yo, la más abatida y miserable de las damas\u2026",
  ],
}

function timeLabel(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function ErrorBar({ label, count, color, max }: { label: string; count: number; color: string; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-xs text-ink-600">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-parchment-200">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.round((count / max) * 100)}%` }}
        />
      </div>
      <span className="w-6 text-right text-xs text-ink-400">{count}</span>
    </div>
  )
}

export default function AuditionStatePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { preparations } = useAuditionStore()
  const prep = preparations.find((p) => p.id === id)
  const [summary, setSummary] = useState<StateSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch from Codex / generate via backend
    const timer = setTimeout(() => {
      setSummary(MOCK_SUMMARY)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [id])

  const maxErrorCount = summary
    ? Math.max(...summary.errorBreakdown.map((e) => e.count))
    : 1

  return (
    <div className="page-container">
      <NavBar variant="app" />

      <main className="max-w-2xl mx-auto px-4 pb-16 pt-2 md:px-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate(-1)}
              className="btn-ghost p-2 mt-0.5 shrink-0 text-2xl leading-none"
              aria-label="Volver"
            >
              ←
            </button>
            <div>
              <h1 className="font-serif text-3xl font-bold text-ink-900 mb-0.5">Estado de audicion</h1>
              <p className="text-sm text-ink-400 truncate">{prep?.title ?? 'Preparation'}</p>
            </div>
          </div>
          <Link to={`/app/auditions/${id}/practice`} className="btn-primary shrink-0">
            Practicar
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4 text-ink-400">
            <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm">Generando tu estado de audicion...</p>
          </div>
        ) : summary ? (
          <div className="space-y-5 animate-fade-up">
            <p className="text-xs text-ink-400">
              Generado {timeLabel(summary.generatedAt)} · Basado en tu ultima sesion
            </p>

            {/* What's left */}
            <section className="card shadow-card">
              <h2 className="font-serif text-xl font-semibold text-ink-900 mb-4">
                Lo que te falta para hacer el texto tuyo
              </h2>
              <ul className="space-y-3">
                {summary.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-3 text-sm text-ink-600 leading-relaxed">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gold-400/20 text-gold-600 flex items-center justify-center text-xs font-semibold">
                      {i + 1}
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </section>

            {/* Error patterns */}
            <section className="card shadow-card">
              <h2 className="font-serif text-xl font-semibold text-ink-900 mb-4">Patrones de error</h2>
              <div className="space-y-3">
                {summary.errorBreakdown.map((e) => (
                  <ErrorBar key={e.label} {...e} max={maxErrorCount} />
                ))}
              </div>
            </section>

            {/* Weak lines */}
            {summary.weakLines.length > 0 && (
              <section className="card shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl font-semibold text-ink-900">Trabaja estas lineas</h2>
                  <Link
                    to={`/app/auditions/${id}/practice`}
                    className="btn-ghost text-xs"
                  >
                    Ir a practicar →
                  </Link>
                </div>
                <div className="space-y-2">
                  {summary.weakLines.map((line, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-ink-700 italic"
                    >
                      "{line}"
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        ) : (
          <div className="card text-center py-16">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="font-serif text-xl font-semibold text-ink-900 mb-2">Sin datos todavia</h2>
            <p className="text-sm text-ink-400 mb-6">
              Completa una sesion de practica para generar tu estado de audicion.
            </p>
            <Link to={`/app/auditions/${id}/practice`} className="btn-primary">
              Empezar a practicar
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
