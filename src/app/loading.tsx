export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12" aria-busy="true" aria-label="Loading">
      <div className="skeleton h-8 w-40 rounded-lg mb-3" />
      <div className="skeleton h-3 w-56 rounded mb-10" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton h-40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
