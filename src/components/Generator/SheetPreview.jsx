import { useEffect, useRef, useState } from 'react';
import { Download, Printer } from 'lucide-react';

export default function SheetPreview({ config, singleBarcodeUrl }) {
    const canvasRef = useRef(null);
    const [sheetUrl, setSheetUrl] = useState(null);

    // A4 Dimensions at 300 DPI (approx) or just high res
    // A4 is 210mm x 297mm. 
    // Let's use the Python script's dimensions: 2480 x 3508 px
    const A4_WIDTH = 2480;
    const A4_HEIGHT = 3508;

    useEffect(() => {
        if (!singleBarcodeUrl) return;

        const renderSheet = async () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Clear canvas
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, A4_WIDTH, A4_HEIGHT);

            // Load barcode image
            const barcodeImg = new Image();
            barcodeImg.src = singleBarcodeUrl;
            await new Promise(r => barcodeImg.onload = r);

            const {
                rows, cols, hMargin, vMargin,
                productName, labelFontSize,
                showExpiry, expiryText, expiryFontSize
            } = config;

            // Calculate cell dimensions
            // Python logic: cell_w = (A4_W - (cols + 1) * h_margin) // cols
            const cellW = Math.floor((A4_WIDTH - (cols + 1) * hMargin) / cols);
            const cellH = Math.floor((A4_HEIGHT - (rows + 1) * vMargin) / rows);

            // Font settings
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const cellX = hMargin + c * (cellW + hMargin);
                    const cellY = vMargin + r * (cellH + vMargin);

                    // Draw Debug Box (Optional, maybe remove later)
                    // ctx.strokeStyle = '#eee';
                    // ctx.strokeRect(cellX, cellY, cellW, cellH);

                    let currentY = cellY + 10; // Top padding

                    // 1. Draw Product Name
                    if (productName) {
                        ctx.font = `bold ${labelFontSize}px Inter, sans-serif`;
                        // Simple wrap logic (split by space)
                        const words = productName.split(' ');
                        let line = '';
                        const lineHeight = labelFontSize * 1.2;

                        for (let n = 0; n < words.length; n++) {
                            const testLine = line + words[n] + ' ';
                            const metrics = ctx.measureText(testLine);
                            const testWidth = metrics.width;
                            if (testWidth > cellW && n > 0) {
                                ctx.fillText(line, cellX + cellW / 2, currentY);
                                line = words[n] + ' ';
                                currentY += lineHeight;
                            } else {
                                line = testLine;
                            }
                        }
                        ctx.fillText(line, cellX + cellW / 2, currentY);
                        currentY += lineHeight + 15; // Spacing after text
                    }

                    // 2. Draw Expiry
                    if (showExpiry) {
                        ctx.font = `${expiryFontSize}px Inter, sans-serif`;
                        ctx.textAlign = 'right';
                        const expText = expiryText ? `EXP: ${expiryText}` : 'EXP:';
                        // Align right within cell
                        ctx.fillText(expText, cellX + cellW - 5, currentY);
                        ctx.textAlign = 'center'; // Reset
                        currentY += expiryFontSize * 1.2 + 15;
                    }

                    // 3. Draw Barcode
                    // Fit barcode into remaining space
                    const remainingH = (cellY + cellH) - currentY - 10;
                    if (remainingH > 20) {
                        // Maintain aspect ratio
                        const aspect = barcodeImg.height / barcodeImg.width;
                        let targetW = cellW - 20; // Padding
                        let targetH = targetW * aspect;

                        if (targetH > remainingH) {
                            targetH = remainingH;
                            targetW = targetH / aspect;
                        }

                        const drawX = cellX + (cellW - targetW) / 2;
                        const drawY = currentY + (remainingH - targetH) / 2;

                        ctx.drawImage(barcodeImg, drawX, drawY, targetW, targetH);
                    }
                }
            }

            setSheetUrl(canvas.toDataURL('image/png'));
        };

        renderSheet();
    }, [config, singleBarcodeUrl]);

    const handleDownloadSheet = () => {
        if (sheetUrl) {
            const link = document.createElement('a');
            link.download = `barcode-sheet-${config.text}.png`;
            link.href = sheetUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="w-full overflow-auto bg-slate-200 p-4 rounded-lg border border-slate-300" style={{ maxHeight: '600px' }}>
                {/* Scale down for preview */}
                <canvas
                    ref={canvasRef}
                    width={A4_WIDTH}
                    height={A4_HEIGHT}
                    style={{ width: '100%', height: 'auto', background: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
            </div>
            <button
                onClick={handleDownloadSheet}
                className="btn btn-primary w-full md:w-auto"
                disabled={!sheetUrl}
            >
                <Printer size={18} />
                Download A4 Sheet
            </button>
        </div>
    );
}
