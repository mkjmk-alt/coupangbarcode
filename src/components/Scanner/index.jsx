import { useState, useRef } from 'react';
import { Camera, Upload, Scan as ScanIcon } from 'lucide-react';
import CameraScan from './CameraScan';
import ImageScan from './ImageScan';
import ResultDisplay from './ResultDisplay';

export default function Scanner() {
    const [mode, setMode] = useState(null); // null | 'camera' | 'image'
    const [scanResult, setScanResult] = useState(null);
    const imageScanKey = useRef(0);

    const handleScan = (decodedText, decodedResult) => {
        setScanResult({
            text: decodedText,
            format: decodedResult?.result?.format?.formatName || 'Unknown',
            timestamp: new Date().toISOString()
        });
    };

    const handleBack = () => {
        setMode(null);
        setScanResult(null);
    };

    const switchToMode = (newMode) => {
        if (newMode === 'image') {
            imageScanKey.current += 1; // Increment key to force remount
        }
        setMode(newMode);
    };

    // Initial state: Show two big buttons
    if (mode === null) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Camera Scan Button */}
                    <button
                        onClick={() => switchToMode('camera')}
                        className="card hover:shadow-lg transition-all duration-200 p-8 flex flex-col items-center justify-center gap-4 min-h-[280px] bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-400"
                    >
                        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                            <Camera size={40} className="text-white" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-blue-900 mb-2">카메라 스캔</h3>
                            <p className="text-sm text-blue-700">
                                카메라로 바코드/QR 코드를<br />실시간으로 스캔합니다
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                            <ScanIcon size={18} />
                            <span>스캔 시작</span>
                        </div>
                    </button>

                    {/* File Upload Button */}
                    <button
                        onClick={() => switchToMode('image')}
                        className="card hover:shadow-lg transition-all duration-200 p-8 flex flex-col items-center justify-center gap-4 min-h-[280px] bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-400"
                    >
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                            <Upload size={40} className="text-white" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-green-900 mb-2">사진 업로드</h3>
                            <p className="text-sm text-green-700">
                                저장된 이미지 파일에서<br />바코드/QR 코드를 읽습니다
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                            <Upload size={18} />
                            <span>파일 선택</span>
                        </div>
                    </button>
                </div>

                {/* Info Section */}
                <div className="card mt-6 bg-slate-50">
                    <h4 className="font-semibold text-slate-900 mb-2">지원하는 코드 형식</h4>
                    <p className="text-sm text-slate-600">
                        1D 바코드: CODE128, EAN-13, EAN-8, CODE39, UPC 등<br />
                        2D 코드: QR Code, DataMatrix 등
                    </p>
                </div>
            </div>
        );
    }

    // Scanner mode selected
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={handleBack}
                    className="btn btn-secondary"
                >
                    ← 돌아가기
                </button>
                <span className="text-sm text-slate-500">
                    {mode === 'camera' ? '카메라 스캔 모드' : '이미지 업로드 모드'}
                </span>
            </div>

            <div className="card min-h-[400px] flex flex-col items-center justify-center bg-slate-900 text-white overflow-hidden relative">
                {mode === 'camera' ? (
                    <CameraScan onScan={handleScan} />
                ) : (
                    <ImageScan key={imageScanKey.current} onScan={handleScan} />
                )}
            </div>

            {/* Switch Mode Button - Only show in camera mode */}
            {mode === 'camera' && (
                <div className="flex justify-center">
                    <button
                        onClick={() => switchToMode('image')}
                        className="btn btn-secondary flex items-center gap-2"
                    >
                        <Upload size={18} />
                        <span>Scan an Image File</span>
                    </button>
                </div>
            )}

            {scanResult && (
                <ResultDisplay result={scanResult} />
            )}
        </div>
    );
}
