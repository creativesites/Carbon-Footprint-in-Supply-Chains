export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
            CFIP
          </h1>
          <h2 className="text-2xl font-semibold mb-8 text-gray-700">
            Carbon Footprint Intelligence Platform
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            AI-powered platform that predicts emissions before they occur and provides real-time optimization suggestions for sustainable supply chain management.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 border border-gray-200 rounded-lg hover:border-green-500 transition-colors">
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="font-semibold mb-2">Predictive Analytics</h3>
              <p className="text-sm text-gray-600">
                Forecast emissions 24-72 hours before they occur
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:border-green-500 transition-colors">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-semibold mb-2">Real-time Optimization</h3>
              <p className="text-sm text-gray-600">
                AI suggests routes and modes to reduce emissions
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg hover:border-green-500 transition-colors">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold mb-2">Goal Tracking</h3>
              <p className="text-sm text-gray-600">
                Monitor progress toward sustainability targets
              </p>
            </div>
          </div>

          <div className="mt-12 flex gap-4 justify-center">
            <a
              href="/calculate"
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              🔢 Start Calculating
            </a>
            <a
              href="/dashboard"
              className="px-8 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold"
            >
              📊 View Dashboard
            </a>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>✅ Platform Ready | Next.js + TypeScript + Prisma + SQLite</p>
          </div>
        </div>
      </div>
    </main>
  );
}
