import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function CameraScan({ onScan }) {
  const [error, setError] = useState(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode('reader');
    qrCodeRef.current = html5QrCode;
    html5QrCode
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText, decodedResult) => {
          onScan(decodedText, decodedResult);
        },
        (errorMessage) => {
          // ignore minor errors
          console.warn(errorMessage);
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
