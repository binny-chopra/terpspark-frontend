import { useState, useEffect, useRef } from 'react';
import { Camera, XCircle, CheckCircle, AlertCircle } from 'lucide-react';

const QRScanner = ({ eventId, onScan, onError }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, success, error
    const [scanMessage, setScanMessage] = useState('');
    const videoRef = useRef(null);
    const scanTimeout = useRef(null);

    useEffect(() => {
        return () => {
            stopScanning();
            if (scanTimeout.current) {
                clearTimeout(scanTimeout.current);
            }
        };
    }, []);

    const startScanning = async () => {
        try {
            setIsScanning(true);
            setScanStatus('scanning');
            setScanMessage('Point camera at QR code...');

            // Mock camera access (in production, use getUserMedia)
            // const stream = await navigator.mediaDevices.getUserMedia({ 
            //   video: { facingMode: 'environment' } 
            // });
            // if (videoRef.current) {
            //   videoRef.current.srcObject = stream;
            // }

            // Simulate scanning process
            console.log('Camera started, scanning for QR codes...');
        } catch (error) {
            console.error('Camera access error:', error);
            setScanStatus('error');
            setScanMessage('Camera access denied. Please enable camera permissions.');
            setIsScanning(false);

            if (onError) {
                onError(new Error('Camera access denied'));
            }
        }
    };

    const stopScanning = () => {
        setIsScanning(false);
        setScanStatus('idle');
        setScanMessage('');

        // Stop camera stream
        if (videoRef.current?.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }

        if (scanTimeout.current) {
            clearTimeout(scanTimeout.current);
        }
    };

    const simulateScan = () => {
        // Simulate QR code detection
        setScanStatus('scanning');
        setScanMessage('Scanning...');

        scanTimeout.current = setTimeout(() => {
            // Mock QR code data
            const mockQRCode = `QR-TKT-${Date.now()}-${eventId}`;

            setScanStatus('success');
            setScanMessage('QR Code detected!');

            // Call onScan callback
            if (onScan) {
                onScan(mockQRCode);
            }

            // Reset after 2 seconds
            setTimeout(() => {
                setScanStatus('scanning');
                setScanMessage('Ready to scan next code...');
            }, 2000);
        }, 1000);
    };

    const getStatusIcon = () => {
        switch (scanStatus) {
            case 'success':
                return <CheckCircle className="w-16 h-16 text-green-500" />;
            case 'error':
                return <XCircle className="w-16 h-16 text-red-500" />;
            case 'scanning':
                return <Camera className="w-16 h-16 text-blue-500 animate-pulse" />;
            default:
                return <Camera className="w-16 h-16 text-gray-400" />;
        }
    };

    const getStatusColor = () => {
        switch (scanStatus) {
            case 'success':
                return 'border-green-500 bg-green-50';
            case 'error':
                return 'border-red-500 bg-red-50';
            case 'scanning':
                return 'border-blue-500 bg-blue-50';
            default:
                return 'border-gray-300 bg-gray-50';
        }
    };

    return (
        <div className="space-y-4">
            {/* Camera Preview */}
            <div className={`relative aspect-video rounded-lg border-4 ${getStatusColor()} overflow-hidden transition-colors`}>
                {/* Video element (hidden in mock, would show camera feed in production) */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover hidden"
                />

                {/* Mock camera view */}
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <div className="text-center">
                        {getStatusIcon()}
                        <p className="mt-4 text-white font-medium">{scanMessage || 'Camera ready'}</p>
                    </div>
                </div>

                {/* Scanning overlay */}
                {isScanning && scanStatus === 'scanning' && (
                    <div className="absolute inset-0 pointer-events-none">
                        {/* Scanning line animation */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-64 h-64 border-4 border-white/50 rounded-lg relative">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>

                                {/* Animated scan line */}
                                <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-scan"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success checkmark */}
                {scanStatus === 'success' && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-pulse">
                        <CheckCircle className="w-32 h-32 text-green-500" />
                    </div>
                )}
            </div>

            {/* Status Message */}
            {scanMessage && (
                <div className={`p-4 rounded-lg ${scanStatus === 'success' ? 'bg-green-100 text-green-800' :
                        scanStatus === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                    }`}>
                    <div className="flex items-center gap-2">
                        {scanStatus === 'success' && <CheckCircle className="w-5 h-5" />}
                        {scanStatus === 'error' && <AlertCircle className="w-5 h-5" />}
                        {scanStatus === 'scanning' && <Camera className="w-5 h-5" />}
                        <span className="font-medium">{scanMessage}</span>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="flex gap-3">
                {!isScanning ? (
                    <button
                        onClick={startScanning}
                        className="flex-1 bg-umd-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                        <Camera className="w-5 h-5" />
                        Start Camera
                    </button>
                ) : (
                    <>
                        <button
                            onClick={simulateScan}
                            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Simulate Scan
                        </button>
                        <button
                            onClick={stopScanning}
                            className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2"
                        >
                            <XCircle className="w-5 h-5" />
                            Stop Camera
                        </button>
                    </>
                )}
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">How to use QR scanner:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>1. Click "Start Camera" to activate the scanner</li>
                    <li>2. Point your camera at the attendee's QR code ticket</li>
                    <li>3. The system will automatically detect and validate the code</li>
                    <li>4. You'll see a confirmation when check-in is successful</li>
                </ul>
                <p className="mt-3 text-xs text-gray-500">
                    <strong>Note:</strong> In this demo, click "Simulate Scan" to test the check-in flow.
                    In production, the camera will automatically scan real QR codes.
                </p>
            </div>

            {/* CSS for scanning animation */}
            <style jsx>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          100% {
            top: 100%;
          }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default QRScanner;