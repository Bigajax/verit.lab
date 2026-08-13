// Sublinhado de pincel que aparece no hover dos links do nav.
// Usar dentro de um elemento com `group relative`.
export default function RabiscoHover() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 14"
      fill="none"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-1.5 h-1.5 w-full text-rosa opacity-0 transition-opacity duration-150 group-hover:opacity-100"
    >
      <path
        d="M4 9 C 60 3, 150 12, 296 5"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
