import { useState, useEffect } from 'react';
import BarcodeGenerator from './BarcodeGenerator';
import Preview from './Preview';

export default function Generator() {
    const [config, setConfig] = useState({
        text: '12345678',
        type: 'code128',
        productName: 'Sample Product',
        includeText: true,
        scale: 3,
        height: 10,
        width: 20, // module width in some units, bwip-js uses scale
        removeSpecial: true,

        // A4 Sheet Options
        showSheetOptions: false,
        rows: 10,
        cols: 4,
        hMargin: 47,
        vMargin: 18,
        labelFontSize: 30,
        expiryFontSize: 20,
        expiryText: '',
        showExpiry: false,
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
                <div className="card">
                    <h2 className="text-lg font-bold mb-4">Configuration</h2>
                    <BarcodeGenerator config={config} setConfig={setConfig} />
                </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
                <div className="card min-h-[500px] flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-bold">Preview</h2>
                        <span className="text-sm text-slate-500 font-normal">
                            ({config.text.length} characters)
                        </span>
                    </div>
                    <Preview config={config} />
                </div>
            </div>
        </div>
    );
}
