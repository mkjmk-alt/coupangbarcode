import { useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Upload } from 'lucide-react';

export default function ImageScan({ onScan }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;

        setIsScanning(true);
        const html5QrCode = new Html5Qrcode("image-reader");

        try {
            const decodedText = await html5QrCode.scanFile(file, true);
            onScan(decodedText, { result: { format: { formatName: 'File Scan' } } });
        } catch (err) {
            console.error(err);
            alert('No barcode found in image.');
        } finally {
            setIsScanning(false);
            html5QrCode.clear();
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
            <div
                className={`w-full max-w-md aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all
          ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-400 hover:bg-slate-800'}
        `}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <div id="image-reader" className="hidden"></div>
                <Upload size={48} className="text-slate-400 mb-4" />
                <p className="text-lg font-medium text-slate-200">
                    {isScanning ? 'Scanning...' : 'Click or Drag Image Here'}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                    Supports JPG, PNG, BMP
                </p>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFile(e.target.files[0])}
                />
            </div>
        </div>
    );
}
