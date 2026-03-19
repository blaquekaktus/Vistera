export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar skeleton */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950 hidden lg:block" />

      <main className="lg:ml-64 flex-1 p-6 animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-7 w-48 bg-slate-200 rounded-lg mb-2" />
            <div className="h-4 w-32 bg-slate-100 rounded" />
          </div>
          <div className="h-10 w-36 bg-slate-200 rounded-xl" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100">
              <div className="h-4 w-20 bg-slate-100 rounded mb-3" />
              <div className="h-7 w-12 bg-slate-200 rounded" />
            </div>
          ))}
        </div>

        {/* Listings */}
        <div className="h-5 w-28 bg-slate-200 rounded mb-4" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4">
              <div className="w-24 h-16 bg-slate-100 rounded-xl flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-1/2 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
