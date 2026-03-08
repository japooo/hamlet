import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Toast from '../components/Toast'
import { useAuditionStore } from '../store/auditionStore'

type Step = 'details' | 'uploading' | 'selectCharacter' | 'creating'

const MOCK_CHARACTERS = ['Hamlet', 'Ophelia', 'Polonius', 'Horatio', 'Claudius', 'Gertrude']

export default function NewAuditionPage() {
  const [step, setStep] = useState<Step>('details')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [characters, setCharacters] = useState<string[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { addPreparation } = useAuditionStore()

  function handleFile(f: File) {
    if (f.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return
    }
    setFile(f)
    setError('')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  async function handleUpload() {
    if (!title.trim()) { setError('Please enter a preparation name.'); return }
    if (!file) { setError('Please upload a PDF.'); return }
    setError('')
    setStep('uploading')

    // Simulate upload + parsing progress
    for (let p = 0; p <= 100; p += 20) {
      await new Promise((r) => setTimeout(r, 200))
      setUploadProgress(p)
    }

    // TODO: Replace with real backend call to extract text + detect characters
    setCharacters(MOCK_CHARACTERS)
    setStep('selectCharacter')
  }

  async function handleCreate() {
    if (!selectedCharacter) { setError('Please select your character.'); return }
    setError('')
    setStep('creating')

    await new Promise((r) => setTimeout(r, 700))

    const newPrep = {
      id: crypto.randomUUID(),
      title: title.trim(),
      selectedCharacter,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accuracy: 0,
      totalSegments: 0,
      masteredSegments: 0,
    }
    addPreparation(newPrep)
    setToast('Preparation created!')
    setTimeout(() => navigate(`/app/auditions/${newPrep.id}/practice`), 500)
  }

  return (
    <div className="page-container">
      <NavBar variant="app" />

      <main className="max-w-lg mx-auto px-4 pb-16 pt-4 md:px-6">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-ink-900 mb-1">New preparation</h1>
          <p className="text-sm text-ink-400">Upload your sides and pick your character.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {(['details', 'selectCharacter'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  step === s || (step === 'uploading' && s === 'details') || (step === 'creating' && s === 'selectCharacter')
                    ? 'bg-ink-900 text-white'
                    : step === 'selectCharacter' && s === 'details'
                    ? 'bg-gold-400 text-white'
                    : 'bg-parchment-200 text-ink-400'
                }`}
              >
                {step === 'selectCharacter' && s === 'details' ? '✓' : i + 1}
              </div>
              <span className="text-xs text-ink-400 capitalize hidden sm:block">
                {s === 'details' ? 'Upload & name' : 'Select character'}
              </span>
              {i === 0 && <div className="w-8 h-px bg-parchment-200" />}
            </div>
          ))}
        </div>

        <div className="card shadow-card">
          {(step === 'details' || step === 'uploading') && (
            <div className="space-y-5">
              <div>
                <label className="label" htmlFor="prep-title">
                  Preparation name
                </label>
                <input
                  id="prep-title"
                  className="input"
                  placeholder="e.g. Hamlet – To be or not to be"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={step === 'uploading'}
                />
              </div>

              <div>
                <label className="label">Script PDF</label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150 ${
                    dragOver
                      ? 'border-gold-400 bg-gold-400/5'
                      : file
                      ? 'border-green-400 bg-green-50'
                      : 'border-parchment-200 hover:border-gold-400 hover:bg-parchment-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
                  />
                  {file ? (
                    <>
                      <div className="text-2xl mb-2">📄</div>
                      <p className="text-sm font-medium text-ink-900">{file.name}</p>
                      <p className="text-xs text-ink-400 mt-1">
                        {(file.size / 1024).toFixed(0)} KB · Click to replace
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl mb-3">📥</div>
                      <p className="text-sm font-medium text-ink-600">Drop your PDF here</p>
                      <p className="text-xs text-ink-400 mt-1">or click to browse</p>
                    </>
                  )}
                </div>
              </div>

              {step === 'uploading' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-ink-400">
                    <span>Extracting text & detecting characters…</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-parchment-200">
                    <div
                      className="h-2 rounded-full bg-gold-400 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                onClick={handleUpload}
                disabled={step === 'uploading'}
                className="btn-primary w-full py-3 disabled:opacity-60"
              >
                {step === 'uploading' ? 'Processing…' : 'Upload & parse script'}
              </button>
            </div>
          )}

          {(step === 'selectCharacter' || step === 'creating') && (
            <div className="space-y-5">
              <div>
                <h2 className="font-serif text-xl font-semibold text-ink-900 mb-1">
                  Select your character
                </h2>
                <p className="text-sm text-ink-400">
                  We detected {characters.length} characters in <span className="font-medium">{file?.name}</span>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {characters.map((char) => (
                  <button
                    key={char}
                    onClick={() => setSelectedCharacter(char)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium text-left transition-all duration-150 ${
                      selectedCharacter === char
                        ? 'border-gold-400 bg-gold-400/10 text-gold-600'
                        : 'border-parchment-200 bg-white text-ink-600 hover:border-gold-400/50 hover:bg-parchment-50'
                    }`}
                  >
                    {char}
                  </button>
                ))}
              </div>

              <div>
                <label className="label" htmlFor="custom-char">
                  Or enter character name manually
                </label>
                <input
                  id="custom-char"
                  className="input"
                  placeholder="Character name"
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('details')}
                  className="btn-secondary flex-1 py-3"
                >
                  Back
                </button>
                <button
                  onClick={handleCreate}
                  disabled={step === 'creating'}
                  className="btn-primary flex-1 py-3 disabled:opacity-60"
                >
                  {step === 'creating' ? 'Creating…' : 'Start practicing'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {toast && <Toast message={toast} type="success" onDismiss={() => setToast('')} />}
    </div>
  )
}
