import React, { useState } from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import '../styles/Settings.css';
import ConfirmDialog from './ConfirmDialog';

function Settings({ onClose }) {
    const [showConfirmProblemWords, setShowConfirmProblemWords] = useState(false);
    const [showConfirmTestHistory, setShowConfirmTestHistory] = useState(false);
    const [showConfirmResetAll, setShowConfirmResetAll] = useState(false);

    // Функція для очищення проблемних слів
    const clearProblemWords = () => {
        // Показуємо діалог підтвердження
        setShowConfirmProblemWords(true);
    };

    // Функція для виконання очищення проблемних слів після підтвердження
    const confirmClearProblemWords = () => {
        // Отримуємо поточний словник
        const vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];

        // Оновлюємо слова, скидаючи лічильники помилок
        const updatedVocabulary = vocabulary.map(word => {
            if (word.incorrectCount && word.incorrectCount > 0) {
                return {
                    ...word,
                    incorrectCount: 0  // Скидаємо лічильник помилок
                };
            }
            return word;
        });

        // Зберігаємо оновлений словник
        localStorage.setItem('vocabulary', JSON.stringify(updatedVocabulary));

        // Закриваємо діалог
        setShowConfirmProblemWords(false);

        // Перезавантажуємо сторінку
        window.location.reload();
    };

    // Функція для очищення історії тестів
    const clearTestHistory = () => {
        // Показуємо діалог підтвердження
        setShowConfirmTestHistory(true);
    };

    // Функція для виконання очищення історії тестів після підтвердження
    const confirmClearTestHistory = () => {
        localStorage.removeItem('testHistory');

        // Закриваємо діалог
        setShowConfirmTestHistory(false);

        // Перезавантажуємо сторінку
        window.location.reload();
    };

    // Функція для повного скидання всіх даних
    const resetAllData = () => {
        setShowConfirmResetAll(true);
    };

    // Підтвердження повного скидання
    const confirmResetAllData = () => {
        // Видаляємо всі дані додатку з localStorage
        localStorage.removeItem('testHistory');
        // Зберігаємо словник, але скидаємо всю статистику
        const vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];
        const resetVocabulary = vocabulary.map(word => ({
            ...word,
            correctCount: 0,
            incorrectCount: 0,
            lastTested: null
        }));
        localStorage.setItem('vocabulary', JSON.stringify(resetVocabulary));

        // Закриваємо діалог
        setShowConfirmResetAll(false);

        // Перезавантажуємо сторінку
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

            {/* Діалог підтвердження видалення проблемних слів */}
            {showConfirmProblemWords && (
                <ConfirmDialog
                    message="Ви впевнені, що хочете очистити статистику помилок для проблемних слів?"
                    onConfirm={confirmClearProblemWords}
                    onCancel={() => setShowConfirmProblemWords(false)}
                />
            )}

            {/* Діалог підтвердження видалення історії тестів */}
            {showConfirmTestHistory && (
                <ConfirmDialog
                    message="Ви впевнені, що хочете видалити всю історію тестів?"
                    onConfirm={confirmClearTestHistory}
                    onCancel={() => setShowConfirmTestHistory(false)}
                />
            )}

            {/* Діалог підтвердження скидання всіх даних */}
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