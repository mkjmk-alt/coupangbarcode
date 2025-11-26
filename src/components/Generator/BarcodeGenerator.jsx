import { Settings } from 'lucide-react';

export default function BarcodeGenerator({ config, setConfig }) {
    const handleChange = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const barcodeTypes = [
        { value: 'code128', label: 'Code 128' },
        { value: 'qrcode', label: 'QR Code' },
        { value: 'ean13', label: 'EAN-13' },
        { value: 'ean8', label: 'EAN-8' },
        { value: 'code39', label: 'Code 39' },
    ];

    return (
        <div className="space-y-4">
            {/* Barcode Type */}
            <div>
                <label className="label">Barcode Type</label>
                <select
                    className="input"
                    value={config.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                >
                    {barcodeTypes.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>
            </div>

            {/* Content */}
            <div>
                <label className="label">Content</label>
                <input
                    type="text"
                    className="input"
                    value={config.text}
                    onChange={(e) => handleChange('text', e.target.value)}
                    placeholder="Enter barcode data"
                />
            </div>

            {/* Product Name */}
            <div>
                <label className="label">Product Name (for Label)</label>
                <input
                    type="text"
                    className="input"
                    value={config.productName}
                    onChange={(e) => handleChange('productName', e.target.value)}
                    placeholder="e.g. Wireless Mouse"
                />
            </div>

            {/* Options */}
            <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={config.removeSpecial}
                        onChange={(e) => handleChange('removeSpecial', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Remove Special Characters</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={config.includeText}
                        onChange={(e) => handleChange('includeText', e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Show Text Below Barcode</span>
                </label>
            </div>

            <div className="border-t border-slate-200 my-4"></div>

            {/* A4 Sheet Options Toggle */}
            <div>
                <button
                    onClick={() => handleChange('showSheetOptions', !config.showSheetOptions)}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    <Settings size={16} />
                    {config.showSheetOptions ? 'Hide Sheet Options' : 'Show Sheet Options'}
                </button>
            </div>

            {config.showSheetOptions && (
                <div className="space-y-4 animate-fade-in bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="label">Rows</label>
                            <input
                                type="number"
                                className="input"
                                value={config.rows}
                                onChange={(e) => handleChange('rows', parseInt(e.target.value) || 1)}
                                min="1" max="30"
                            />
                        </div>
                        <div>
                            <label className="label">Cols</label>
                            <input
                                type="number"
                                className="input"
                                value={config.cols}
                                onChange={(e) => handleChange('cols', parseInt(e.target.value) || 1)}
                                min="1" max="10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">H-Margin (px)</label>
                        <input
                            type="range"
                            className="w-full"
                            value={config.hMargin}
                            onChange={(e) => handleChange('hMargin', parseInt(e.target.value))}
                            min="0" max="150"
                        />
                        <div className="text-xs text-right text-slate-500">{config.hMargin}px</div>
                    </div>

                    <div>
                        <label className="label">V-Margin (px)</label>
                        <input
                            type="range"
                            className="w-full"
                            value={config.vMargin}
                            onChange={(e) => handleChange('vMargin', parseInt(e.target.value))}
                            min="0" max="150"
                        />
                        <div className="text-xs text-right text-slate-500">{config.vMargin}px</div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer mb-2">
                            <input
                                type="checkbox"
                                checked={config.showExpiry}
                                onChange={(e) => handleChange('showExpiry', e.target.checked)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-700">Add Expiry Date</span>
                        </label>
                        {config.showExpiry && (
                            <input
                                type="text"
                                className="input"
                                value={config.expiryText}
                                onChange={(e) => handleChange('expiryText', e.target.value)}
                                placeholder="YYYY-MM-DD"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
