import React from 'react';
import '../styles/ConfirmDialog.css';

function ConfirmDialog({ message, onConfirm, onCancel }) {
    return (
        <div className="confirm-overlay">
            <div className="confirm-dialog">
                <div className="confirm-message">{message}</div>
                <div className="confirm-buttons">
                    <button
                        className="confirm-button confirm-yes"
                        onClick={onConfirm}
                    >
                        Так
                    </button>
                    <button
                        className="confirm-button confirm-no"
                        onClick={onCancel}
                    >
                        Ні
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;