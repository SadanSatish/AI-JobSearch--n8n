import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

const queryClient = new QueryClient();

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 space-y-6 text-center border border-gray-100">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Phase 1 Infrastructure</h1>
          <p className="mt-3 text-gray-500 text-sm">Frontend architecture initialized successfully. Business logic pending Phase 2.</p>
        </div>
        <div className="pt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-sm font-medium text-gray-600 flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Vite Setup</span>
            <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-md">Ready</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-sm font-medium text-gray-600 flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Tailwind v4</span>
            <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-md">Ready</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-sm font-medium text-gray-600 flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> Routing & Query</span>
            <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-md">Ready</span>
          </div>
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
