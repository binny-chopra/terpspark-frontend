import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext({ addToast: () => {} });

const TYPE_STYLES = {
    success: 'bg-green-600 text-white border border-green-700',
    error: 'bg-red-600 text-white border border-red-700',
    warning: 'bg-amber-500 text-white border border-amber-600',
    info: 'bg-gray-900 text-white border border-gray-800'
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        setTimeout(() => removeToast(id), duration);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-4 right-4 space-y-2 z-50 max-w-sm w-full">
                {toasts.map(({ id, message, type, duration }) => (
                    <div
                        key={id}
                        className={`relative shadow-lg rounded-lg px-4 py-3 text-sm flex items-start space-x-2 overflow-hidden ${TYPE_STYLES[type] || TYPE_STYLES.info}`}
                    >
                        <div
                            className="toast-progress absolute left-0 bottom-0 h-0.5 bg-white/70"
                            style={{ animationDuration: `${duration}ms` }}
                        />
                        <span className="block flex-1">{message}</span>
                        <button
                            onClick={() => removeToast(id)}
                            className="ml-2 text-white/80 hover:text-white transition-colors"
                            aria-label="Close notification"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
