export default function Loading() {
  return (
    <div className="flex min-h-[95vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"
          role="status"
          aria-label="Loading"
        />
        <p className="text-sm text-gray-600">...</p>
      </div>
    </div>
  );
}
