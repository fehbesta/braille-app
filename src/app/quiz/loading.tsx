export default function QuizLoading() {
  return (
    <div className="max-w-xl mx-auto px-4 py-10" aria-busy="true" aria-label="Loading quiz">
      <div className="skeleton h-1.5 w-full rounded-full mb-10" />
      <div className="flex flex-col items-center gap-7">
        <div className="skeleton w-24 h-24 rounded-xl" />
        <div className="grid grid-cols-2 gap-3 w-full">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="skeleton h-[72px] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
