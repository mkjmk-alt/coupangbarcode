import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function CameraScan({ onScan }) {
  const [error, setError] = useState(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode('reader', {
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true
      },
      formatsToSupport: [
        0, // QR_CODE
        1, // AZTEC
        3, // CODE_39
        4, // CODE_128
        6, // DATA_MATRIX
        7, // EAN_8
        8, // EAN_13
        11, // UPC_A
        12, // UPC_E
      ]
    });
    qrCodeRef.current = html5QrCode;

    const config = {
      fps: 15, // Increased FPS for smoother scanning
      qrbox: { width: 300, height: 150 }, // Wider box for 1D barcodes
      aspectRatio: 1.0,
      videoConstraints: {
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
        facingMode: "environment",
        focusMode: "continuous"
      }
    };

    html5QrCode
      .start(
        { facingMode: 'environment' },
        config,
        (decodedText, decodedResult) => {
          onScan(decodedText, decodedResult);
        },
        (errorMessage) => {
          // ignore minor errors
        }
      )
      .catch((err) => {
        console.error('Failed to start camera', err);
        setError(err);
      });

    return () => {
      if (qrCodeRef.current) {
        qrCodeRef.current.stop().catch((err) => console.error('Failed to stop camera', err));
      }
    };
  }, [onScan]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div id="reader" className="w-full max-w-md overflow-hidden rounded-lg"></div>
      {error && <p className="mt-2 text-sm text-red-500">Camera error: {error.message}</p>}
      <p className="mt-4 text-sm text-slate-400">Point your camera at a barcode or QR code</p>
      <style>{`
        #reader__scan_region { background: white; }
        #reader__dashboard_section_csr span,
        #reader__dashboard_section_swaplink { display: none !important; }
      `}</style>
    </div>
  );
}
