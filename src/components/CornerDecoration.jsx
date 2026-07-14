import './CornerDecoration.css'

const LEFT_SQUARES = [
  { x: 10, y: 10, s: 20, c: 'var(--gradient-orange)' },
  { x: 36, y: 10, s: 14, c: 'var(--gradient-coral)' },
  { x: 10, y: 36, s: 14, c: 'var(--gradient-coral)' },
  { x: 58, y: 28, s: 11, c: 'var(--gradient-magenta)' },
  { x: 30, y: 58, s: 11, c: 'var(--gradient-magenta)' },
  { x: 78, y: 12, s: 8, c: 'var(--gradient-magenta)' },
  { x: 12, y: 78, s: 8, c: 'var(--gradient-magenta)' },
  { x: 60, y: 60, s: 8, c: 'var(--gradient-violet)' },
]

const RIGHT_SQUARES = [
  { x: 12, y: 14, s: 14, c: 'var(--gradient-violet)' },
  { x: 34, y: 10, s: 17, c: 'var(--gradient-violet)' },
  { x: 62, y: 16, s: 11, c: 'var(--gradient-magenta)' },
  { x: 88, y: 10, s: 14, c: 'var(--gradient-blue)' },
  { x: 10, y: 48, s: 11, c: 'var(--gradient-magenta)' },
  { x: 42, y: 48, s: 8, c: 'var(--gradient-blue)' },
  { x: 84, y: 48, s: 11, c: 'var(--gradient-blue)' },
  { x: 110, y: 28, s: 8, c: 'var(--gradient-blue)' },
]

function Squares({ squares }) {
  return (
    <>
      {squares.map((square, index) => (
        <rect
          key={index}
          x={square.x}
          y={square.y}
          width={square.s}
          height={square.s}
          rx={2}
          fill={square.c}
        />
      ))}
    </>
  )
}

export function CornerDecoration({ children }) {
  return (
    <div className="corner-decoration">
      <svg
        className="corner-decoration__left"
        viewBox="0 0 100 90"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <Squares squares={LEFT_SQUARES} />
      </svg>
      {children}
      <svg
        className="corner-decoration__right"
        viewBox="0 0 130 90"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <Squares squares={RIGHT_SQUARES} />
      </svg>
    </div>
  )
}
