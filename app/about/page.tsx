export default function About() {
  return (
    <div className="min-h-screen bg-paper p-6 safe-bottom">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-2xl font-bold text-forest mb-6">About</h1>
        <p className="text-lg text-ink mb-4">
          The Nigeria of My Dream is a Gen Z NDC community project. It is a one-week social campaign that asks Nigerians to complete the sentence: “The Nigeria of my dream is a place where ______.”
        </p>
        <p className="text-lg text-ink mb-4">
          There is no login, no candidate names, no party slogans. Just your dream, turned into a card you can share.
        </p>
        <h2 className="font-display text-xl font-bold text-forest mt-6 mb-2">How to take part</h2>
        <ol className="list-disc list-inside text-lg text-ink mb-4 space-y-2">
          <li>Visit the site and finish the sentence.</li>
          <li>Optionally add your name and a photo.</li>
          <li>Pick a card style and download or share it.</li>
          <li>Choose whether to add your line to the public wall.</li>
        </ol>
        <h2 className="font-display text-xl font-bold text-forest mt-6 mb-2">What happens to your line</h2>
        <p className="text-lg text-ink mb-4">
          If you opt in, your line goes to a moderation queue. Approved lines appear on the wall. Your photo never leaves your device.
        </p>
        <p className="mt-6 text-sm text-gray-500">
          A Gen Z NDC community project
        </p>
      </div>
    </div>
  );
}