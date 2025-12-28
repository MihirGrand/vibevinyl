export function VinylLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <circle cx="20" cy="20" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
      </svg>
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">VibeVinyl</h1>
      </div>
    </div>
  )
}
