// app/products/loading.tsx

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      
      {/* Table Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/12"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}