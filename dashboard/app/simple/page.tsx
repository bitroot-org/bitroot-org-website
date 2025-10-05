export default function SimplePage() {
  return (
    <div style={{ padding: '40px', backgroundColor: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: 'black', fontSize: '32px', marginBottom: '20px' }}>
        ✅ Simple Page Works
      </h1>
      <p style={{ color: 'black', fontSize: '18px' }}>
        If you can see this, Next.js routing and rendering is working fine.
      </p>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <p style={{ color: 'black' }}>Try navigating to:</p>
        <ul>
          <li><a href="/dashboard" style={{ color: 'blue' }}>/dashboard</a></li>
          <li><a href="/debug" style={{ color: 'blue' }}>/debug</a></li>
          <li><a href="/test-dashboard" style={{ color: 'blue' }}>/test-dashboard</a></li>
        </ul>
      </div>
    </div>
  );
}