export default function PropertyDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50 pt-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="h-4 w-48 bg-slate-200 rounded mb-6" />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Main image */}
            <div className="aspect-[16/9] bg-slate-200 rounded-2xl" />

            {/* Thumbnails */}
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-24 h-16 bg-slate-200 rounded-xl flex-shrink-0" />
              ))}
            </div>

            {/* Info card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="h-7 w-2/3 bg-slate-200 rounded mb-4" />
              <div className="h-5 w-1/3 bg-slate-100 rounded mb-6" />
              <div className="grid grid-cols-4 gap-4 py-4 border-y border-slate-100">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="h-5 w-8 bg-slate-200 rounded mx-auto mb-1" />
                    <div className="h-3 w-16 bg-slate-100 rounded mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agent card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 h-fit">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-slate-200" />
              <div>
                <div className="h-4 w-28 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="h-10 bg-slate-200 rounded-xl mb-3" />
            <div className="h-10 bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
