import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'

const features = [
  {
    icon: '🎙️',
    title: 'Compañero de escena IA',
    description:
      'Ensaya tus líneas en diálogo real con una IA que da voz a tus compañeros de escena — con paciencia, siempre a punto.',
  },
  {
    icon: '🎯',
    title: 'Feedback preciso',
    description:
      'Ve exactamente qué líneas se te atragantan. Consigue tu propio "Estado de audición" con lo que te falta para dominar el texto.',
  },
  {
    icon: '🎭',
    title: 'Tu compañero de ensayo, siempre contigo',
    description:
      'Llévate a tu compañero de ensayo donde vayas — del salón a la cocina, sin perder el hilo.',
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
            Para actores en activo
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-ink-900 leading-[1.1] mb-5">
            Que cada<br />
            <span className="italic text-gold-500">línea</span> sea tuya.
          </h1>
          <p className="max-w-lg mx-auto text-ink-400 text-lg leading-relaxed mb-10">
            Sube tu guion, elige tu personaje y ensaya con una IA que te da feedback en tiempo real sobre exactamente lo que te falta para clavarlo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth" className="btn-primary text-base px-8 py-4">
              Empieza gratis
            </Link>
            <Link to="/auth" className="btn-secondary text-base px-8 py-4">
              Iniciar sesion
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
                  "¡Oh, qué noble mente ha caído aquí!"
                </p>
              </div>
              <div className="flex gap-3">
                <span className="shrink-0 w-20 text-xs font-semibold text-gold-500 pt-1">TÚ</span>
                <div className="flex-1">
                  <div className="rounded-lg bg-gold-400/10 border border-gold-400/20 px-3 py-2 text-sm text-ink-900">
                    "El ojo, la lengua y la espada del cortesano, el soldado, el sabio…"
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
                  "El espejo de la moda…"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 md:py-20 max-w-5xl mx-auto">
        <h2 className="section-heading text-center mb-12">Todo lo que necesitas para clavarlo</h2>
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
          <h2 className="font-serif text-3xl font-bold text-ink-900 mb-4">¿Listo para tu mejor audicion?</h2>
          <p className="text-ink-400 mb-8 leading-relaxed">
            Gratis para empezar. Sin tarjeta de credito. Solo sube tu guion y empieza.
          </p>
          <Link to="/auth" className="btn-primary text-base px-10 py-4">
            Empieza ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-parchment-200 px-6 py-6 text-center text-xs text-ink-400">
        © {new Date().getFullYear()} Hamlet · Hecho para actores, por gente que lo entiende
      </footer>
    </div>
  )
}
