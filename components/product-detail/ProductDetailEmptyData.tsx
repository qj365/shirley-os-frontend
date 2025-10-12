'use client';
import React from 'react';

export default function ProductDetailEmptyData() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-8">
      <div className="mb-4 text-xl">Product not found</div>
      <button
        onClick={() => window.history.back()}
        className="rounded-full bg-black px-6 py-3 text-white hover:bg-gray-800"
      >
        Go Back
      </button>
    </div>
  );
}
