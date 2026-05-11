export default function ProgressLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12" aria-busy="true" aria-label="Loading progress">
      <div className="skeleton h-8 w-48 rounded-lg mb-10" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
      </div>
      <div className="skeleton h-28 rounded-xl mb-4" />
      <div className="skeleton h-28 rounded-xl" />
    </div>
  );
}
