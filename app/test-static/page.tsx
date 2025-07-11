export default function TestStatic() {
  return (
    <div>
      <h1>Static Test Page</h1>
      <p>This page has no client-side JavaScript</p>
      <p>Current time rendered on server: {new Date().toISOString()}</p>
    </div>
  )
} 