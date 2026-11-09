export default function Privacy() {
  return (
    <div className="min-h-screen bg-paper p-6 safe-bottom">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-2xl font-bold text-forest mb-6">Privacy (Draft)</h1>
        <p className="text-sm text-orange-600 mb-6">
          Draft: to be reviewed before launch.
        </p>
        <h2 className="font-display text-xl font-bold text-forest mb-2">What we collect</h2>
        <ul className="list-disc list-inside text-lg text-ink mb-4 space-y-2">
          <li>The line you write (if you opt in to the wall).</li>
          <li>Your optional first name (max 20 characters).</li>
          <li>Anonymous event counts (page views, cards created, shares).</li>
        </ul>
        <h2 className="font-display text-xl font-bold text-forest mb-2">What we do not collect</h2>
        <ul className="list-disc list-inside text-lg text-ink mb-4 space-y-2">
          <li>No accounts, no email, no phone number.</li>
          <li>No photos — your photo never leaves your browser.</li>
          <li>No raw IP addresses — we store a hashed device identifier only.</li>
        </ul>
        <h2 className="font-display text-xl font-bold text-forest mb-2">Removal</h2>
        <p className="text-lg text-ink mb-4">
          Lines on the wall can be removed on request. Use the Takedown page to submit a request.
        </p>
        <p className="mt-6 text-sm text-gray-500">
          A Gen Z NDC community project
        </p>
      </div>
    </div>
  );
}