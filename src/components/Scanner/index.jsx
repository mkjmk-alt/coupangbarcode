import { useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import CameraScan from './CameraScan';
import ImageScan from './ImageScan';
import ResultDisplay from './ResultDisplay';

export default function Scanner() {
    const [mode, setMode] = useState('camera'); // 'camera' | 'image'
    const [scanResult, setScanResult] = useState(null);

    const handleScan = (decodedText, decodedResult) => {
        setScanResult({
            text: decodedText,
            format: decodedResult?.result?.format?.formatName || 'Unknown',
            timestamp: new Date().toISOString()
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="card p-1">
                <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setMode('camera')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${mode === 'camera'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        <Camera size={18} />
                        <span>Camera</span>
                    </button>
                    <button
                        onClick={() => setMode('image')}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${mode === 'image'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                    >
                        <ImageIcon size={18} />
                        <span>Image File</span>
                    </button>
                </div>
            </div>

            <div className="card min-h-[400px] flex flex-col items-center justify-center bg-slate-900 text-white overflow-hidden relative">
                {mode === 'camera' ? (
                    <CameraScan onScan={handleScan} />
                ) : (
                    <ImageScan onScan={handleScan} />
                )}
            </div>

            {scanResult && (
                <ResultDisplay result={scanResult} />
            )}
        </div>
    );
}
