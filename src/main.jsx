import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Meradel App Crash Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F6EDD9] text-[#2C1E14] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#FDF8EE] border-4 border-[#2C1E14] shadow-[6px_6px_0px_0px_#2C1E14] p-6 space-y-4">
            <h1 className="text-xl font-extrabold text-[#B86B7D]">Oops! Terjadi Gangguan Tampilan</h1>
            <p className="text-xs text-[#6E5039]">
              {this.state.error?.message || 'Terjadi kesalahan saat memuat tampilan Meradel.'}
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-4 bg-[#6B8E78] text-white border-2 border-[#2C1E14] font-bold text-xs uppercase tracking-wider"
              >
                Muat Ulang Halaman
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="w-full py-2 px-3 bg-[#EFE2C6] text-[#4A3525] border-2 border-[#4A3525] font-bold text-[11px]"
              >
                Bersihkan Cache Sesi & Masuk Ulang
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
