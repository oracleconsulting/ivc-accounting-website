'use client';

export default function TestPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Test Page Works!</h1>
      <p>Post ID: {params.id}</p>
    </div>
  );
} 