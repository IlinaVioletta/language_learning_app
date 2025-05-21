import React from 'react';
import { FaTimes } from 'react-icons/fa';
import '../styles/Settings.css';

function Help({ onClose }) {
    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <div className="settings-header">
                    <h2>Довідка</h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="settings-content">
                    <div className="help-section">
                        <h3>Як користуватися додатком?</h3>
                        <p>
                            Цей додаток допоможе вам ефективно вивчати нові слова іноземною мовою.
                        </p>

                        <h4>Мій словник</h4>
                        <p>
                            У розділі "Мій словник" ви можете додавати нові слова, обираючи категорію
                            для кожного. Також тут можна редагувати або видаляти слова, а також шукати слова
                            за допомогою пошукового поля або фільтрувати їх за категоріями.
                        </p>

                        <h4>Тести</h4>
                        <p>
                            Розділ "Тести" дозволяє перевірити свої знання. Ви можете обрати один із двох режимів:
                        </p>
                        <ul>
                            <li>Тест з варіантами - вам буде показано слово і чотири варіанти його перекладу</li>
                            <li>Тест на введення - вам потрібно буде самостійно ввести переклад показаного слова</li>
                        </ul>
                        <p>
                            Ви можете тестувати себе за окремими категоріями або за всіма словами одразу.
                        </p>

                        <h4>Прогрес</h4>
                        <p>
                            Розділ "Прогрес" відображає вашу статистику вивчення. Тут ви можете побачити:
                        </p>
                        <ul>
                            <li>Загальну кількість слів і пройдених тестів</li>
                            <li>Ваш середній результат</li>
                            <li>Проблемні слова, з якими ви робите найбільше помилок</li>
                            <li>Статистику за категоріями</li>
                            <li>Повну історію тестів</li>
                        </ul>
                    </div>
                </div>

                <div className="settings-footer">
                    <button className="settings-button primary" onClick={onClose}>
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Help;