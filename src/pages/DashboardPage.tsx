import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import ProgressBar from '../components/ProgressBar'
import { useAuthStore } from '../store/authStore'
import { useAuditionStore, type AuditionPreparation } from '../store/auditionStore'

const MOCK_PREPARATIONS: AuditionPreparation[] = [
  {
    id: '1',
    title: 'Hamlet – Act III Scene 1',
    selectedCharacter: 'Hamlet',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-07T18:30:00Z',
    lastPracticed: '2026-03-07T18:30:00Z',
    accuracy: 78,
    totalSegments: 12,
    masteredSegments: 9,
  },
  {
    id: '2',
    title: 'A Streetcar Named Desire – Scene 3',
    selectedCharacter: 'Blanche',
    createdAt: '2026-02-20T09:00:00Z',
    updatedAt: '2026-03-05T14:15:00Z',
    lastPracticed: '2026-03-05T14:15:00Z',
    accuracy: 55,
    totalSegments: 8,
    masteredSegments: 4,
  },
]

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(ms / 60000)
  if (mins < 60) return `hace ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  return `hace ${Math.floor(hrs / 24)}d`
}

function PreparationCard({ prep }: { prep: AuditionPreparation }) {
  const mastered = prep.masteredSegments ?? 0
  const total = prep.totalSegments ?? 1

  return (
    <div className="card hover:shadow-lifted transition-all duration-200 animate-fade-up flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-semibold text-ink-900 truncate">{prep.title}</h3>
          <p className="text-xs text-ink-400 mt-0.5">
            {prep.selectedCharacter} · ultimo ensayo {prep.lastPracticed ? timeAgo(prep.lastPracticed) : 'nunca'}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-gold-400/10 border border-gold-400/20 px-2.5 py-0.5 text-xs font-medium text-gold-600">
          {prep.accuracy ?? 0}%
        </span>
      </div>

      <ProgressBar
        value={mastered}
        max={total}
        label={`${mastered} / ${total} lineas dominadas`}
        color="gold"
        size="sm"
      />

      <div className="flex gap-2 mt-1">
        <Link to={`/app/auditions/${prep.id}/practice`} className="btn-primary flex-1 text-center text-sm py-2">
          Practicar
        </Link>
        <Link to={`/app/auditions/${prep.id}/state`} className="btn-secondary flex-1 text-center text-sm py-2">
          Estado de audicion
        </Link>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { preparations, setPreparations } = useAuditionStore()

  useEffect(() => {
    // TODO: fetch from Codex
    if (preparations.length === 0) setPreparations(MOCK_PREPARATIONS)
  }, [preparations.length, setPreparations])

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="page-container">
      <NavBar variant="app" />

      <main className="max-w-4xl mx-auto px-4 pb-16 pt-4 md:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-ink-900">
              Hello, {firstName} 👋
            </h1>
            <p className="text-sm text-ink-400 mt-1">Aqui tienes tus preparaciones.</p>
          </div>
          <Link to="/app/auditions/new" className="btn-primary shrink-0">
            + Nueva prep
          </Link>
        </div>

        {preparations.length === 0 ? (
          /* Empty state */
          <div className="card text-center py-16 shadow-soft">
            <div className="text-5xl mb-4">🎭</div>
            <h2 className="font-serif text-xl font-semibold text-ink-900 mb-2">Aun no tienes preparaciones</h2>
            <p className="text-sm text-ink-400 mb-6 max-w-xs mx-auto">
              Sube tu guion y empieza a ensayar con tu companero de escena IA.
            </p>
            <Link to="/app/auditions/new" className="btn-primary">
              Crea tu primera preparacion
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {preparations.map((prep) => (
              <PreparationCard key={prep.id} prep={prep} />
            ))}

            {/* New prep card */}
            <Link
              to="/app/auditions/new"
              className="card border-dashed border-2 border-parchment-200 bg-transparent shadow-none hover:border-gold-400 hover:bg-parchment-50 transition-all duration-200 flex flex-col items-center justify-center gap-3 min-h-40 text-ink-400 hover:text-gold-500"
            >
              <span className="text-3xl">+</span>
              <span className="text-sm font-medium">Nueva preparacion</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
