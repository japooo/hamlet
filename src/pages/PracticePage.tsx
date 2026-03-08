import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NavBar from '../components/NavBar'
import ProgressBar from '../components/ProgressBar'
import { useAuditionStore, type ScriptSegment } from '../store/auditionStore'

type SessionState = 'idle' | 'partner_speaking' | 'user_turn' | 'evaluating' | 'complete'

const MOCK_SEGMENTS: ScriptSegment[] = [
  { id: 's1', preparationId: '1', characterName: 'Ophelia', text: "O, what a noble mind is here o'erthrown!", orderIndex: 0, sceneLabel: 'Scene 1' },
  { id: 's2', preparationId: '1', characterName: 'Hamlet', text: "The courtier's, soldier's, scholar's, eye, tongue, sword,\nTh' expectancy and rose of the fair state,\nThe glass of fashion and the mould of form,\nTh' observed of all observers\u2014quite, quite down!", orderIndex: 1, sceneLabel: 'Scene 1' },
  { id: 's3', preparationId: '1', characterName: 'Ophelia', text: "And I, of ladies most deject and wretched,\nThat sucked the honey of his music vows,\nNow see that noble and most sovereign reason\nLike sweet bells jangled, out of tune and harsh;", orderIndex: 2, sceneLabel: 'Scene 1' },
  { id: 's4', preparationId: '1', characterName: 'Hamlet', text: "To be, or not to be, that is the question:\nWhether 'tis nobler in the mind to suffer\nThe slings and arrows of outrageous fortune,\nOr to take arms against a sea of troubles\nAnd by opposing end them.", orderIndex: 3, sceneLabel: 'Scene 1' },
  { id: 's5', preparationId: '1', characterName: 'Ophelia', text: "Good my lord, how does your honour for this many a day?", orderIndex: 4, sceneLabel: 'Scene 1' },
  { id: 's6', preparationId: '1', characterName: 'Hamlet', text: "I humbly thank you; well, well, well.", orderIndex: 5, sceneLabel: 'Scene 1' },
]

function ScoreChip({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-700 bg-green-50 border-green-200' : score >= 50 ? 'text-gold-600 bg-gold-400/10 border-gold-400/20' : 'text-red-600 bg-red-50 border-red-100'
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {score}%
    </span>
  )
}

export default function PracticePage() {
  const { id } = useParams<{ id: string }>()
  const { preparations, segments, setSegments } = useAuditionStore()
  const prep = preparations.find((p) => p.id === id)
  const userCharacter = prep?.selectedCharacter ?? 'Hamlet'

  const [sessionState, setSessionState] = useState<SessionState>('idle')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [attempts, setAttempts] = useState<Record<string, number>>({})
  const [scores, setScores] = useState<Record<string, number>>({})
  const [isRecording, setIsRecording] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeSegments = segments.length > 0 ? segments : MOCK_SEGMENTS
  const currentSeg = activeSegments[currentIndex]
  const masteredCount = Object.values(scores).filter((s) => s >= 80).length
  const accuracy =
    Object.values(scores).length > 0
      ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length)
      : 0

  useEffect(() => {
    if (segments.length === 0) setSegments(MOCK_SEGMENTS)
  }, [segments.length, setSegments])

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  function advanceOrComplete() {
    if (currentIndex < activeSegments.length - 1) {
      setCurrentIndex((i) => i + 1)
      setSessionState('idle')
      // If next segment is partner's line, auto-play it
      const next = activeSegments[currentIndex + 1]
      if (next?.characterName !== userCharacter) {
        timerRef.current = setTimeout(() => simulatePartnerLine(currentIndex + 1), 500)
      } else {
        setSessionState('user_turn')
      }
    } else {
      setSessionState('complete')
    }
  }

  function simulatePartnerLine(idx: number) {
    setSessionState('partner_speaking')
    const seg = activeSegments[idx]
    const duration = Math.max(1200, seg.text.length * 35)
    timerRef.current = setTimeout(() => {
      setCurrentIndex(idx)
      setSessionState('user_turn')
    }, duration)
  }

  function handleStartSession() {
    setCurrentIndex(0)
    setAttempts({})
    setScores({})
    const firstSeg = activeSegments[0]
    if (firstSeg?.characterName !== userCharacter) {
      simulatePartnerLine(0)
    } else {
      setSessionState('user_turn')
    }
  }

  function handleStartRecording() {
    setIsRecording(true)
    // TODO: Request mic and stream to backend
  }

  function handleStopRecording() {
    setIsRecording(false)
    setSessionState('evaluating')
    // Simulate STT + scoring
    timerRef.current = setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 40) + 60
      const segId = currentSeg.id
      setScores((s) => ({ ...s, [segId]: mockScore }))
      setAttempts((a) => ({ ...a, [segId]: (a[segId] ?? 0) + 1 }))
      timerRef.current = setTimeout(advanceOrComplete, 800)
    }, 1200)
  }

  useEffect(() => () => clearTimer(), [])

  return (
    <div className="page-container flex flex-col min-h-screen">
      <NavBar variant="app" />

      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 pb-24 md:pb-8 md:px-6 pt-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <div className="min-w-0">
            <h1 className="font-serif text-xl font-semibold text-ink-900 truncate">
              {prep?.title ?? 'Practice'}
            </h1>
            <p className="text-xs text-ink-400 mt-0.5">Playing as {userCharacter}</p>
          </div>
          <Link
            to={`/app/auditions/${id}/state`}
            className="btn-ghost text-xs shrink-0"
          >
            Audition state →
          </Link>
        </div>

        {/* Progress */}
        <ProgressBar
          value={masteredCount}
          max={activeSegments.filter((s) => s.characterName === userCharacter).length}
          label={`Lines mastered`}
          color="gold"
          size="sm"
        />
        {accuracy > 0 && (
          <p className="text-xs text-ink-400 mt-2">Session accuracy: {accuracy}%</p>
        )}

        {/* Script view */}
        <div className="mt-6 flex-1 space-y-3 overflow-y-auto">
          {activeSegments.map((seg, i) => {
            const isUser = seg.characterName === userCharacter
            const isCurrent = i === currentIndex && sessionState !== 'idle' && sessionState !== 'complete'
            const isPast = i < currentIndex
            const isFuture = i > currentIndex

            return (
              <div
                key={seg.id}
                className={`flex gap-3 transition-all duration-200 ${isFuture ? 'opacity-30' : ''}`}
              >
                <div className="shrink-0 pt-1 w-24">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      isUser ? 'text-gold-500' : 'text-ink-400'
                    }`}
                  >
                    {seg.characterName}
                  </span>
                </div>
                <div className={`flex-1 min-w-0 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isCurrent && isUser
                    ? 'bg-gold-400/10 border-2 border-gold-400 shadow-soft'
                    : isCurrent && !isUser
                    ? 'bg-ink-900/5 border border-ink-900/10'
                    : isPast
                    ? 'bg-transparent'
                    : 'bg-white border border-parchment-200'
                }`}>
                  <p className={`text-sm leading-relaxed whitespace-pre-line ${
                    isUser ? 'text-ink-900' : 'text-ink-600 italic'
                  } ${!isCurrent && !isPast ? 'blur-[2px] select-none' : ''}`}>
                    {seg.text}
                  </p>
                  {isPast && isUser && scores[seg.id] && (
                    <div className="flex items-center gap-2 mt-2">
                      <ScoreChip score={scores[seg.id]} />
                      <span className="text-xs text-ink-400">
                        {attempts[seg.id]} attempt{attempts[seg.id] !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  {isCurrent && !isUser && sessionState === 'partner_speaking' && (
                    <div className="flex items-center gap-1.5 mt-2">
                      {[0, 1, 2].map((d) => (
                        <div
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-ink-400 animate-bounce"
                          style={{ animationDelay: `${d * 0.15}s` }}
                        />
                      ))}
                      <span className="text-xs text-ink-400 ml-1">Speaking…</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {sessionState === 'complete' && (
            <div className="card text-center py-8 mt-4 animate-fade-up">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-serif text-xl font-semibold text-ink-900 mb-2">Scene complete!</h3>
              <p className="text-sm text-ink-400 mb-6">Session accuracy: <strong>{accuracy}%</strong></p>
              <div className="flex justify-center gap-3">
                <button onClick={handleStartSession} className="btn-primary">
                  Run it again
                </button>
                <Link to={`/app/auditions/${id}/state`} className="btn-secondary">
                  View audition state
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Practice controls – fixed bottom on mobile */}
        <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto bg-parchment-50 border-t border-parchment-200 md:border-none px-4 py-4 md:mt-6 md:py-0 md:px-0">
          {sessionState === 'idle' && (
            <button onClick={handleStartSession} className="btn-primary w-full py-4 text-base">
              ▶ Start practice session
            </button>
          )}

          {sessionState === 'partner_speaking' && (
            <div className="flex items-center justify-center gap-3 text-sm text-ink-400 py-2">
              <div className="w-2 h-2 rounded-full bg-ink-400 animate-pulse" />
              Partner is speaking…
            </div>
          )}

          {sessionState === 'user_turn' && (
            <button
              onPointerDown={handleStartRecording}
              onPointerUp={handleStopRecording}
              className={`w-full py-4 text-base rounded-xl font-medium transition-all duration-150 ${
                isRecording
                  ? 'bg-red-500 text-white scale-95 shadow-lifted'
                  : 'bg-gold-400 text-white hover:bg-gold-500 shadow-soft'
              }`}
            >
              {isRecording ? '🔴 Recording… (release to stop)' : '🎤 Hold to speak your line'}
            </button>
          )}

          {sessionState === 'evaluating' && (
            <div className="flex items-center justify-center gap-3 text-sm text-ink-400 py-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Evaluating your line…
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
