import { useEffect, useRef, useState } from 'react';
import bwipjs from 'bwip-js';
import { Download, AlertCircle } from 'lucide-react';
import SheetPreview from './SheetPreview';

export default function Preview({ config }) {
    const canvasRef = useRef(null);
    const [error, setError] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (!config.text) return;

        try {
            // Clean text if requested
            let textToEncode = config.text;
            if (config.removeSpecial) {
                textToEncode = textToEncode.replace(/[\s\n\t\r]/g, '');
            }

            if (!textToEncode) {
                setError('No content to encode');
                return;
            }

            // Render to canvas
            const canvas = canvasRef.current;
            bwipjs.toCanvas(canvas, {
                bcid: config.type,       // Barcode type
                text: textToEncode,      // Text to encode
                scale: config.scale,     // 3x scaling factor
                height: config.height,   // Bar height, in millimeters
                includetext: config.includeText, // Show human-readable text
                textxalign: 'center',    // Always good to center text
            });

            setError(null);
            setImageUrl(canvas.toDataURL('image/png'));

        } catch (e) {
            setError(e.message);
            setImageUrl(null);
        }
    }, [config]);

    const handleDownload = () => {
        if (imageUrl) {
            const link = document.createElement('a');
            link.download = `barcode-${config.text}.png`;
            link.href = imageUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Single Barcode Preview */}
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-lg shadow-sm min-h-[200px]">
                {error ? (
                    <div className="flex items-center gap-2 text-red-500">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                ) : (
                    <>
                        <canvas ref={canvasRef} className="max-w-full" />
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleDownload}
                                className="btn btn-primary"
                                disabled={!imageUrl}
                            >
                                <Download size={18} />
                                Download PNG
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Sheet Preview (Conditional) */}
            {config.showSheetOptions && (
                <div className="animate-fade-in">
                    <h3 className="text-lg font-bold mb-4">A4 Sheet Preview</h3>
                    <SheetPreview config={config} singleBarcodeUrl={imageUrl} />
                </div>
            )}
        </div>
    );
}
