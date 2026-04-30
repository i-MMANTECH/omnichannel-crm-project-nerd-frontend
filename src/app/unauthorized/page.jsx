"use client";

export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div>
        <h1 className="text-xl font-semibold mb-4">You do not have permission to access this page.</h1>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-[#3EBF0F] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#349c08]"
        >
          Go back to homepage
        </button>
      </div>
    </div>
  );
}
