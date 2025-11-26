import { Check, AlertTriangle, Copy } from 'lucide-react';

export default function ResultDisplay({ result }) {
    if (!result) return null;

    const { text, format, timestamp } = result;

    // Helper to highlight whitespace/special chars
    const renderHighlightedText = (str) => {
        return str.split('').map((char, index) => {
            if (char === ' ') {
                return <span key={index} className="bg-red-500 text-white px-1 rounded text-xs mx-0.5">SPACE</span>;
            }
            if (char === '\n') {
                return <span key={index} className="bg-red-500 text-white px-1 rounded text-xs mx-0.5">NEWLINE<br /></span>;
            }
            if (char === '\t') {
                return <span key={index} className="bg-red-500 text-white px-1 rounded text-xs mx-0.5">TAB</span>;
            }
            return char;
        });
    };

    const hasSpecialChars = /[\s\n\t\r]/.test(text);
    const normalizedText = text.replace(/[\s\n\t\r]/g, '');

    const copyToClipboard = (txt) => {
        navigator.clipboard.writeText(txt);
        alert('Copied to clipboard!');
    };

    return (
        <div className="card animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">
                        {format}
                    </span>
                    <span className="text-xs text-slate-400">
                        {new Date(timestamp).toLocaleTimeString()}
                    </span>
                </div>
                {hasSpecialChars && (
                    <div className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                        <AlertTriangle size={16} />
                        <span>Special Characters Detected</span>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {/* Raw Result */}
                <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-2">Raw Content</h3>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg font-mono text-lg break-all">
                        {renderHighlightedText(text)}
                    </div>
                </div>

                {/* Normalized Result */}
                {hasSpecialChars && (
                    <div>
                        <h3 className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                            <Check size={16} className="text-green-500" />
                            Normalized Content (No Special Chars)
                        </h3>
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg font-mono text-lg break-all flex items-center justify-between">
                            <span>{normalizedText}</span>
                            <button
                                onClick={() => copyToClipboard(normalizedText)}
                                className="p-2 hover:bg-green-100 rounded-full text-green-700 transition-colors"
                                title="Copy Normalized Text"
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
