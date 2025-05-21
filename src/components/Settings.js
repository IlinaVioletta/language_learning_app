import React, { useState } from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import '../styles/Settings.css';
import ConfirmDialog from './ConfirmDialog';

function Settings({ onClose }) {
    const [showConfirmProblemWords, setShowConfirmProblemWords] = useState(false);
    const [showConfirmTestHistory, setShowConfirmTestHistory] = useState(false);
    const [showConfirmResetAll, setShowConfirmResetAll] = useState(false);

    const clearProblemWords = () => {
        setShowConfirmProblemWords(true);
    };

    const confirmClearProblemWords = () => {
        const vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];

        const updatedVocabulary = vocabulary.map(word => {
            if (word.incorrectCount && word.incorrectCount > 0) {
                return {
                    ...word,
                    incorrectCount: 0
                };
            }
            return word;
        });

        localStorage.setItem('vocabulary', JSON.stringify(updatedVocabulary));

        setShowConfirmProblemWords(false);

        window.location.reload();
    };

    const clearTestHistory = () => {
        setShowConfirmTestHistory(true);
    };

    const confirmClearTestHistory = () => {
        localStorage.removeItem('testHistory');

        setShowConfirmTestHistory(false);

        window.location.reload();
    };

    const resetAllData = () => {
        setShowConfirmResetAll(true);
    };

    const confirmResetAllData = () => {
        localStorage.removeItem('testHistory');
        const vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];
        const resetVocabulary = vocabulary.map(word => ({
            ...word,
            correctCount: 0,
            incorrectCount: 0,
            lastTested: null
        }));
        localStorage.setItem('vocabulary', JSON.stringify(resetVocabulary));

        setShowConfirmResetAll(false);

        window.location.reload();
    };

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <div className="settings-header">
                    <h2>Налаштування</h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="settings-content">
                    <div className="settings-section">
                        <h3>Управління даними</h3>
                        <div className="settings-actions">
                            <button className="settings-button danger" onClick={clearProblemWords}>
                                <FaTrash className="settings-icon" /> Очистити проблемні слова
                            </button>
                            <button className="settings-button danger" onClick={clearTestHistory}>
                                <FaTrash className="settings-icon" /> Очистити історію тестів
                            </button>
                            <button className="settings-button danger" onClick={resetAllData}>
                                <FaTrash className="settings-icon" /> Скинути всі дані
                            </button>
                        </div>
                    </div>
                </div>

                <div className="settings-footer">
                    <button className="settings-button primary" onClick={onClose}>
                        Закрити
                    </button>
                </div>
            </div>

            {showConfirmProblemWords && (
                <ConfirmDialog
                    message="Ви впевнені, що хочете очистити статистику помилок для проблемних слів?"
                    onConfirm={confirmClearProblemWords}
                    onCancel={() => setShowConfirmProblemWords(false)}
                />
            )}

            {showConfirmTestHistory && (
                <ConfirmDialog
                    message="Ви впевнені, що хочете видалити всю історію тестів?"
                    onConfirm={confirmClearTestHistory}
                    onCancel={() => setShowConfirmTestHistory(false)}
                />
            )}

            {showConfirmResetAll && (
                <ConfirmDialog
                    message="Ви впевнені, що хочете скинути всі дані? Це видалить історію тестів та всю статистику слів!"
                    onConfirm={confirmResetAllData}
                    onCancel={() => setShowConfirmResetAll(false)}
                />
            )}
        </div>
    );
}

export default Settings;