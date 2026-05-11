export default function LearnLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12" aria-busy="true" aria-label="Loading lessons">
      <div className="skeleton h-8 w-32 rounded-lg mb-2" />
      <div className="skeleton h-3 w-52 rounded mb-10" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton h-44 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
