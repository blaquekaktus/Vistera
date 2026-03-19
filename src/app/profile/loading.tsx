export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 animate-pulse">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="h-4 w-36 bg-slate-200 rounded mb-6" />
        <div className="h-7 w-32 bg-slate-200 rounded mb-6" />

        {/* Avatar card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-slate-200" />
            <div>
              <div className="h-5 w-40 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-20 bg-slate-100 rounded" />
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
          <div className="h-5 w-40 bg-slate-200 rounded mb-5" />
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
                <div className="h-12 bg-slate-100 rounded-xl" />
              </div>
            ))}
            <div className="h-12 bg-slate-200 rounded-xl mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
