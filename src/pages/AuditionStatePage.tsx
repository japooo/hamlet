import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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
    'You consistently drop the last two words of long monologues — try running them solo at half speed.',
    'Paraphrase rate is highest in Act III Scene 1 lines 3–5; revisit those beats individually.',
    '"To be, or not to be" was accurate 100% of the time. That line is yours.',
    'Emotional cues in the "Get thee to a nunnery" section feel rushed — try intentional pauses before each command.',
    'Missing filler avoidance improving: only 2 "um" instances this session vs 7 last time.',
  ],
  errorBreakdown: [
    { label: 'Missing words', count: 14, color: 'bg-red-400' },
    { label: 'Paraphrase', count: 9, color: 'bg-orange-400' },
    { label: 'Rush / timing', count: 6, color: 'bg-yellow-400' },
    { label: 'Pause filler', count: 2, color: 'bg-blue-400' },
    { label: 'Extra words', count: 1, color: 'bg-purple-400' },
  ],
  weakLines: [
    "The courtier's, soldier's, scholar's, eye, tongue, sword\u2026",
    "And I, of ladies most deject and wretched\u2026",
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
          <div>
            <h1 className="font-serif text-3xl font-bold text-ink-900 mb-0.5">Audition state</h1>
            <p className="text-sm text-ink-400 truncate">{prep?.title ?? 'Preparation'}</p>
          </div>
          <Link to={`/app/auditions/${id}/practice`} className="btn-primary shrink-0">
            Practice
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4 text-ink-400">
            <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm">Generating your audition state…</p>
          </div>
        ) : summary ? (
          <div className="space-y-5 animate-fade-up">
            <p className="text-xs text-ink-400">
              Generated {timeLabel(summary.generatedAt)} · Based on your most recent session
            </p>

            {/* What's left */}
            <section className="card shadow-card">
              <h2 className="font-serif text-xl font-semibold text-ink-900 mb-4">
                What's left to make the text yours
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
              <h2 className="font-serif text-xl font-semibold text-ink-900 mb-4">Error patterns</h2>
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
                  <h2 className="font-serif text-xl font-semibold text-ink-900">Drill these lines</h2>
                  <Link
                    to={`/app/auditions/${id}/practice`}
                    className="btn-ghost text-xs"
                  >
                    Go to practice →
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

            {/* Refresh */}
            <button
              onClick={() => { setLoading(true); setTimeout(() => { setSummary({ ...MOCK_SUMMARY, generatedAt: new Date().toISOString() }); setLoading(false) }, 1000) }}
              className="btn-secondary w-full"
            >
              Regenerate summary
            </button>
          </div>
        ) : (
          <div className="card text-center py-16">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="font-serif text-xl font-semibold text-ink-900 mb-2">No data yet</h2>
            <p className="text-sm text-ink-400 mb-6">
              Complete a practice session to generate your audition state.
            </p>
            <Link to={`/app/auditions/${id}/practice`} className="btn-primary">
              Start practicing
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
