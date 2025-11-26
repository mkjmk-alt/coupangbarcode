import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

export default function CameraScan({ onScan }) {
    const scannerRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Initialize scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText, decodedResult) => {
                onScan(decodedText, decodedResult);
            },
            (errorMessage) => {
                // parse error, ignore mostly
            }
        );

        scannerRef.current = scanner;

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode scanner. ", error);
                });
            }
        };
    }, [onScan]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div id="reader" className="w-full max-w-md overflow-hidden rounded-lg"></div>
            <p className="mt-4 text-sm text-slate-400">
                Point your camera at a barcode or QR code
            </p>
            <style>{`
        #reader__scan_region {
          background: white;
        }
        #reader__dashboard_section_csr span, 
        #reader__dashboard_section_swaplink {
          display: none !important;
        }
      `}</style>
        </div>
    );
}
