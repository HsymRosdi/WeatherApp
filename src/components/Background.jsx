export default function Background({ theme }) {
  return (
    <div className="bg-root" aria-hidden="true">
      <div className="bg-base" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="noise-overlay" />
    </div>
  )
}