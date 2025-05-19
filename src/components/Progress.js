import React, { useState, useEffect } from 'react';
import '../styles/Progress.css';

function Progress() {
    const [vocabulary, setVocabulary] = useState([]);
    const [testHistory, setTestHistory] = useState([]);
    const [statsView, setStatsView] = useState('general'); // 'general', 'words', 'tests'

    useEffect(() => {
        // Завантаження даних зі сховища
        const vocabData = JSON.parse(localStorage.getItem('vocabulary')) || [];
        const historyData = JSON.parse(localStorage.getItem('testHistory')) || [];

        setVocabulary(vocabData);
        setTestHistory(historyData);

        // Виведемо дані для діагностики
        console.log("Завантажена історія тестів:", historyData);
    }, []);

    // Загальна кількість слів
    const totalWords = vocabulary.length;

    // Кількість слів за категоріями
    const wordsByCategory = vocabulary.reduce((acc, word) => {
        const category = word.category || 'uncategorized';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    // Статистика тестів
    const totalTests = testHistory.length;
    const averageScore = totalTests > 0
        ? Math.round(testHistory.reduce((sum, test) => {
            const percent = test.displayPercent !== undefined
                ? test.displayPercent
                : Math.round((test.score / test.total) * 100);
            return sum + percent;
        }, 0) / totalTests)
        : 0;

    // Слова з найбільшою кількістю помилок
    const problemWords = [...vocabulary]
        .filter(word => (word.incorrectCount || 0) > 0)
        .sort((a, b) => (b.incorrectCount || 0) - (a.incorrectCount || 0))
        .slice(0, 10); // Показуємо до 10 слів з помилками

    // Останні 5 тестів
    const recentTests = [...testHistory].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    // Функція для визначення типу тесту
    const getTestTypeText = (mode) => {
        if (mode === 'choice') {
            return 'Тест з варіантами';
        } else if (mode === 'write') {
            return 'Тест на введення';
        } else {
            return `Невідомий тип тесту (${mode})`;
        }
    };

    // Функція для відображення відсотка результату
    const getDisplayPercent = (test) => {
        if (test.displayPercent !== undefined) {
            return test.displayPercent;
        }
        return Math.round((test.score / test.total) * 100);
    };

    // Функція для визначення класу стилю результату
    const getScoreClass = (test) => {
        const percent = getDisplayPercent(test);
        if (percent >= 70) return 'good';
        if (percent >= 40) return 'medium';
        return 'poor';
    };

    return (
        <div className="progress">
            <h2 className="section-title">Мій прогрес</h2>

            {/* Вкладки для перемикання видів статистики */}
            <div className="progress-tabs">
                <button
                    className={`progress-tab ${statsView === 'general' ? 'active' : ''}`}
                    onClick={() => setStatsView('general')}
                >
                    Загальна статистика
                </button>
                <button
                    className={`progress-tab ${statsView === 'words' ? 'active' : ''}`}
                    onClick={() => setStatsView('words')}
                >
                    Статистика по словах
                </button>
                <button
                    className={`progress-tab ${statsView === 'tests' ? 'active' : ''}`}
                    onClick={() => setStatsView('tests')}
                >
                    Історія тестів
                </button>
            </div>

            {/* Загальна статистика */}
            {statsView === 'general' && (
                <div className="general-stats">
                    <div className="stats-cards">
                        {/* Картка зі статистикою словника */}
                        <div className="stat-card">
                            <div className="stat-value">{totalWords}</div>
                            <div className="stat-label">Всього слів у словнику</div>
                        </div>

                        {/* Картка зі статистикою тестів */}
                        <div className="stat-card">
                            <div className="stat-value">{totalTests}</div>
                            <div className="stat-label">Пройдено тестів</div>
                        </div>

                        {/* Картка із середнім результатом */}
                        <div className="stat-card">
                            <div className="stat-value">{averageScore}%</div>
                            <div className="stat-label">Середній результат</div>
                        </div>
                    </div>

                    <div className="detailed-stats">
                        {/* Слова з найбільшою кількістю помилок */}
                        <div className="problem-words-card">
                            <h3 className="card-title">Проблемні слова</h3>

                            {problemWords.length > 0 ? (
                                <ul className="problem-words-list">
                                    {problemWords.map((word, index) => (
                                        <li key={index} className="problem-word-item">
                                            <div className="problem-word-info">
                                                <span className="problem-word-original">{word.original}</span>
                                                <span className="problem-word-translated">→ {word.translated}</span>
                                            </div>
                                            <div className="problem-word-errors">
                                                {word.incorrectCount} помилок
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="empty-state">Поки немає даних про помилки</p>
                            )}
                        </div>

                        {/* Останні тести */}
                        <div className="recent-tests-card">
                            <h3 className="card-title">Останні тести</h3>

                            {recentTests.length > 0 ? (
                                <ul className="recent-tests-list">
                                    {recentTests.map((test, index) => (
                                        <li key={index} className="recent-test-item">
                                            <div className="recent-test-info">
                                                <div className="recent-test-type">
                                                    {getTestTypeText(test.mode)}
                                                </div>
                                                <div className="recent-test-details">
                                                    {new Date(test.date).toLocaleDateString()}
                                                    {test.category !== 'all' && ` • ${test.category}`}
                                                </div>
                                            </div>
                                            <div className={`recent-test-score ${getScoreClass(test)}`}>
                                                {test.score}/{test.total} ({getDisplayPercent(test)}%)
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="empty-state">Ви ще не проходили тести</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Статистика по словах */}
            {statsView === 'words' && (
                <div className="words-stats">
                    <div className="categories-stats">
                        <h3 className="card-title">Слова за категоріями</h3>

                        <div className="categories-card">
                            {Object.keys(wordsByCategory).length > 0 ? (
                                <div className="categories-list">
                                    {Object.entries(wordsByCategory).map(([category, count]) => (
                                        <div key={category} className="category-item">
                                            <div className="category-header">
                                                <span className="category-name">{category}</span>
                                                <span className="category-count">
                                                    {count} слів ({Math.round((count / totalWords) * 100)}%)
                                                </span>
                                            </div>
                                            <div className="progress-bar-bg">
                                                <div
                                                    className="progress-bar-fill"
                                                    style={{ width: `${(count / totalWords) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="empty-state">Ваш словник порожній</p>
                            )}
                        </div>
                    </div>

                    {vocabulary.length > 0 && (
                        <div className="all-words-stats">
                            <h3 className="card-title">Всі слова</h3>

                            <div className="table-container">
                                <table className="words-table">
                                    <thead>
                                    <tr>
                                        <th>Слово</th>
                                        <th>Переклад</th>
                                        <th>Категорія</th>
                                        <th>Правильно</th>
                                        <th>Помилки</th>
                                        <th>Останній тест</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {vocabulary.map((word, index) => (
                                        <tr key={index}>
                                            <td>{word.original}</td>
                                            <td>{word.translated}</td>
                                            <td className="capitalize">{word.category || 'загальні'}</td>
                                            <td className="correct-count">{word.correctCount || 0}</td>
                                            <td className="incorrect-count">{word.incorrectCount || 0}</td>
                                            <td>
                                                {word.lastTested
                                                    ? new Date(word.lastTested).toLocaleDateString()
                                                    : 'Ніколи'}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Історія тестів */}
            {statsView === 'tests' && (
                <div className="tests-history">
                    {testHistory.length > 0 ? (
                        <div className="table-container">
                            <table className="history-table">
                                <thead>
                                <tr>
                                    <th>Дата</th>
                                    <th>Тип тесту</th>
                                    <th>Категорія</th>
                                    <th>Результат</th>
                                </tr>
                                </thead>
                                <tbody>
                                {testHistory
                                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                                    .map((test, index) => (
                                        <tr key={index}>
                                            <td>
                                                {new Date(test.date).toLocaleDateString()}
                                                {' '}
                                                {new Date(test.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </td>
                                            <td>
                                                {getTestTypeText(test.mode)}
                                            </td>
                                            <td className="capitalize">
                                                {test.category === 'all' ? 'Всі категорії' : test.category}
                                            </td>
                                            <td>
                                                <span className={`score-badge ${getScoreClass(test)}`}>
                                                    {test.score}/{test.total} ({getDisplayPercent(test)}%)
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-history-card">
                            <p className="empty-history-message">У вас ще немає історії тестів</p>
                            <p className="empty-history-hint">Пройдіть тест, щоб побачити вашу статистику</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Progress;