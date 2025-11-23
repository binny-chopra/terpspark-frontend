import { useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';

const ConfirmDialog = ({
    isOpen,
    title,
    message,
    type = 'warning', // warning, danger, info, success
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    confirmButtonClass = '',
    showCancelButton = true
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onCancel?.();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return <XCircle className="w-12 h-12 text-red-600" />;
            case 'success':
                return <CheckCircle className="w-12 h-12 text-green-600" />;
            case 'info':
                return <Info className="w-12 h-12 text-blue-600" />;
            case 'warning':
            default:
                return <AlertTriangle className="w-12 h-12 text-orange-600" />;
        }
    };

    const getDefaultButtonClass = () => {
        if (confirmButtonClass) return confirmButtonClass;

        switch (type) {
            case 'danger':
                return 'bg-red-600 hover:bg-red-700 text-white';
            case 'success':
                return 'bg-green-600 hover:bg-green-700 text-white';
            case 'info':
                return 'bg-blue-600 hover:bg-blue-700 text-white';
            case 'warning':
            default:
                return 'bg-orange-600 hover:bg-orange-700 text-white';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
            {/* Dialog */}
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slide-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            {getIcon()}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {title}
                        </h3>
                    </div>
                    {showCancelButton && (
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600 whitespace-pre-line">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    {showCancelButton && (
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        className={`px-6 py-2 rounded-lg font-semibold transition ${getDefaultButtonClass()}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            {/* Click outside to close */}
            <div
                className="absolute inset-0 -z-10"
                onClick={onCancel}
            />
        </div>
    );
};

// Custom Hook for using confirm dialogs
export const useConfirm = () => {
    const [dialogState, setDialogState] = React.useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'warning',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: null,
        onCancel: null
    });

    const confirm = ({
        title,
        message,
        type = 'warning',
        confirmText = 'Confirm',
        cancelText = 'Cancel'
    }) => {
        return new Promise((resolve) => {
            setDialogState({
                isOpen: true,
                title,
                message,
                type,
                confirmText,
                cancelText,
                onConfirm: () => {
                    setDialogState(prev => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setDialogState(prev => ({ ...prev, isOpen: false }));
                    resolve(false);
                }
            });
        });
    };

    const ConfirmDialogComponent = () => (
        <ConfirmDialog {...dialogState} />
    );

    return {
        confirm,
        ConfirmDialog: ConfirmDialogComponent
    };
};

export default ConfirmDialog;