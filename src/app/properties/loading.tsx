export default function PropertiesLoading() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters bar */}
        <div className="h-14 bg-white rounded-2xl border border-slate-100 mb-8" />

        {/* Results count */}
        <div className="h-4 w-32 bg-slate-200 rounded mb-6" />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="aspect-[4/3] bg-slate-100" />
              <div className="p-4">
                <div className="h-4 w-3/4 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-1/2 bg-slate-100 rounded mb-4" />
                <div className="h-6 w-1/3 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
