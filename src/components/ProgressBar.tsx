interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  color?: 'gold' | 'green' | 'blue'
  size?: 'sm' | 'md'
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  color = 'gold',
  size = 'md',
}: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100)

  const barColors = {
    gold: 'bg-gold-400',
    green: 'bg-green-500',
    blue: 'bg-stage-blue',
  }

  const heights = { sm: 'h-1.5', md: 'h-2.5' }

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1.5 text-xs text-ink-400">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className={`w-full rounded-full bg-parchment-200 ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full ${barColors[color]} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
