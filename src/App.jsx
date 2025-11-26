import { useState } from 'react';
import { Scan, QrCode, Printer } from 'lucide-react';
import Scanner from './components/Scanner';
import Generator from './components/Generator';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('scan');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Scan size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900" style={{ fontSize: '1.25rem' }}>Barcode Pro</h1>
          </div>

          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('scan')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'scan'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-2">
                <Scan size={16} />
                <span>Scan</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'generate'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-2">
                <QrCode size={16} />
                <span>Generate</span>
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 animate-fade-in">
        {activeTab === 'scan' ? (
          <Scanner />
        ) : (
          <Generator />
        )}
      </main>
    </div>
  );
}

export default App;
