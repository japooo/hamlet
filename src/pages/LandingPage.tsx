import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'

const features = [
  {
    icon: '🎙️',
    title: 'AI Scene Partner',
    description:
      'Practice your lines in real dialogue with an AI that voices your scene partners — patiently, on cue, every time.',
  },
  {
    icon: '🎯',
    title: 'Targeted Feedback',
    description:
      "See exactly which lines trip you up. Get a personalized \"Audition State\" showing what's left to make the text yours.",
  },
  {
    icon: '📱',
    title: 'Mobile-First PWA',
    description:
      'Install it like an app. Practice anywhere — on the subway, backstage, or at the café before your call time.',
  },
]

export default function LandingPage() {
  return (
    <div className="page-container">
      <NavBar variant="landing" />

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Decorative blob */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-parchment-100 to-transparent"
        />

        <div className="animate-fade-up">
          <span className="inline-block rounded-full bg-gold-400/10 border border-gold-400/30 px-4 py-1 text-xs font-medium text-gold-600 tracking-wide uppercase mb-6">
            For working actors
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-ink-900 leading-[1.1] mb-5">
            Make every<br />
            <span className="italic text-gold-500">line</span> yours.
          </h1>
          <p className="max-w-lg mx-auto text-ink-400 text-lg leading-relaxed mb-10">
            Upload your sides, choose your character, and rehearse with an AI scene partner that gives you real-time feedback on exactly what's left to lock in.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth" className="btn-primary text-base px-8 py-4">
              Start preparing free
            </Link>
            <Link to="/auth" className="btn-secondary text-base px-8 py-4">
              Log in
            </Link>
          </div>
        </div>

        {/* Abstract visual */}
        <div className="mt-16 w-full max-w-xl animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="card shadow-lifted relative overflow-hidden">
            <div className="absolute top-4 left-4 flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400 opacity-60" />
              <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-60" />
              <div className="w-3 h-3 rounded-full bg-green-400 opacity-60" />
            </div>

            <div className="pt-6 space-y-3">
              <div className="flex gap-3">
                <span className="shrink-0 w-20 text-xs text-ink-400 font-medium pt-1">OPHELIA</span>
                <p className="text-sm text-ink-600 leading-relaxed italic">
                  "O, what a noble mind is here o'erthrown!"
                </p>
              </div>
              <div className="flex gap-3">
                <span className="shrink-0 w-20 text-xs font-semibold text-gold-500 pt-1">YOU</span>
                <div className="flex-1">
                  <div className="rounded-lg bg-gold-400/10 border border-gold-400/20 px-3 py-2 text-sm text-ink-900">
                    "The courtier's, soldier's, scholar's, eye, tongue, sword…"
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-1.5 flex-1 rounded-full bg-parchment-200">
                      <div className="h-1.5 w-3/4 rounded-full bg-gold-400 transition-all" />
                    </div>
                    <span className="text-xs text-ink-400">75%</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="shrink-0 w-20 text-xs text-ink-400 font-medium pt-1">OPHELIA</span>
                <p className="text-sm text-ink-600 leading-relaxed italic animate-pulse-gentle">
                  "The glass of fashion…"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 md:py-20 max-w-5xl mx-auto">
        <h2 className="section-heading text-center mb-12">Everything you need to nail it</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card hover:shadow-lifted transition-shadow duration-200">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-serif text-lg font-semibold text-ink-900 mb-2">{f.title}</h3>
              <p className="text-sm text-ink-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center card shadow-lifted">
          <h2 className="font-serif text-3xl font-bold text-ink-900 mb-4">Ready for your best audition?</h2>
          <p className="text-ink-400 mb-8 leading-relaxed">
            Free to start. No credit card required. Just upload your sides and begin.
          </p>
          <Link to="/auth" className="btn-primary text-base px-10 py-4">
            Get started now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-parchment-200 px-6 py-6 text-center text-xs text-ink-400">
        © {new Date().getFullYear()} Audition Prep · Made for actors, by people who care
      </footer>
    </div>
  )
}
