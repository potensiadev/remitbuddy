import { useEffect } from 'react'
import { runSupabaseDiagnostics } from '@/debug/supabase-test'

const Debug = () => {
  useEffect(() => {
    void runSupabaseDiagnostics()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-2xl w-full bg-white shadow-sm rounded-xl p-10 text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Supabase Diagnostics</h1>
        <p className="text-gray-700">
          Diagnostics are running. Open your browser DevTools console to view detailed results and API responses.
        </p>
      </div>
    </div>
  )
}

export default Debug
