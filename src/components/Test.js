import React, { useState, useEffect } from 'react';
import '../styles/Test.css';

function Test() {
    const [vocabularyWords, setVocabularyWords] = useState([]);
    const [testMode, setTestMode] = useState(null); // 'choice', 'write'
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [options, setOptions] = useState([]);
    const [result, setResult] = useState(null);
    const [testProgress, setTestProgress] = useState({ current: 0, total: 0, correct: 0 });
    const [testComplete, setTestComplete] = useState(false);
    const [testHistory, setTestHistory] = useState(() => JSON.parse(localStorage.getItem('testHistory')) || []);
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Категорії для фільтрації
    const categories = [
        { id: 'general', name: 'Загальні' },
        { id: 'travel', name: 'Подорожі' },
        { id: 'business', name: 'Бізнес' },
        { id: 'food', name: 'Їжа' },
        { id: 'tech', name: 'Технології' }
    ];

    // Завантаження слів зі словника
    useEffect(() => {
        const words = JSON.parse(localStorage.getItem('vocabulary')) || [];
        setVocabularyWords(words);
    }, []);

    // Збереження історії тестів
    useEffect(() => {
        localStorage.setItem('testHistory', JSON.stringify(testHistory));
    }, [testHistory]);

    // Фільтрація слів за категорією
    const filteredWords = categoryFilter === 'all'
        ? vocabularyWords
        : vocabularyWords.filter(word => word.category === categoryFilter);

    // Запуск тесту
    const startTest = (mode) => {
        if (filteredWords.length < 4) {
            alert('Для тесту потрібно мінімум 4 слова у вашому словнику!');
            return;
        }

        setTestMode(mode);
        setTestComplete(false);
        setTestProgress({
            current: 1,
            total: Math.min(10, filteredWords.length),
            correct: 0
        });

        generateQuestion(mode, 0);
    };

    // Генерація нового питання
    const generateQuestion = (mode, questionIndex) => {
        const totalQuestions = Math.min(10, filteredWords.length);

        if (questionIndex >= totalQuestions) {
            finishTest();
            return;
        }

        // Вибір випадкового слова
        const randomIndex = Math.floor(Math.random() * filteredWords.length);
        const selectedWord = filteredWords[randomIndex];

        let questionOptions = [];

        if (mode === 'choice') {
            // Створення варіантів відповідей для режиму вибору
            questionOptions = generateOptions(selectedWord, filteredWords);
        }

        setCurrentQuestion(selectedWord);
        setOptions(questionOptions);
        setUserAnswer('');
        setResult(null);
    };

    // Генерація варіантів відповідей для тесту з вибором
    const generateOptions = (correctWord, allWords) => {
        // Додавання правильної відповіді
        const options = [correctWord.translated];

        // Додавання неправильних варіантів
        while (options.length < 4 && options.length < allWords.length) {
            const randomIndex = Math.floor(Math.random() * allWords.length);
            const randomWord = allWords[randomIndex].translated;

            if (!options.includes(randomWord) && randomWord !== correctWord.translated) {
                options.push(randomWord);
            }
        }

        // Перемішування варіантів
        return options.sort(() => Math.random() - 0.5);
    };

    // Завершення тесту
    const finishTest = () => {
        const newTestResult = {
            date: new Date().toISOString(),
            mode: testMode,
            score: testProgress.correct,
            total: testProgress.total,
            category: categoryFilter
        };

        setTestHistory([...testHistory, newTestResult]);
        setTestComplete(true);
    };

    // Перевірка відповіді
    const checkAnswer = () => {
        let isCorrect = false;

        if (testMode === 'choice') {
            isCorrect = userAnswer === currentQuestion.translated;
        } else if (testMode === 'write') {
            // Перевірка з урахуванням регістру і пробілів
            isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.translated.trim().toLowerCase();
        }

        // Оновлення статистики слова
        const updatedWords = [...vocabularyWords];
        const wordIndex = updatedWords.findIndex(w =>
            w.original === currentQuestion.original && w.translated === currentQuestion.translated
        );

        if (wordIndex !== -1) {
            if (isCorrect) {
                updatedWords[wordIndex].correctCount = (updatedWords[wordIndex].correctCount || 0) + 1;
            } else {
                updatedWords[wordIndex].incorrectCount = (updatedWords[wordIndex].incorrectCount || 0) + 1;
            }
            updatedWords[wordIndex].lastTested = new Date().toISOString();

            setVocabularyWords(updatedWords);
            localStorage.setItem('vocabulary', JSON.stringify(updatedWords));
        }

        // Встановлення результату та оновлення прогресу
        setResult({
            isCorrect,
            correctAnswer: currentQuestion.translated
        });

        if (isCorrect) {
            setTestProgress(prev => ({
                ...prev,
                correct: prev.correct + 1
            }));
        }
    };

    // Перехід до наступного питання
    const nextQuestion = () => {
        setTestProgress(prev => ({
            ...prev,
            current: prev.current + 1
        }));

        generateQuestion(testMode, testProgress.current);
    };

    // Вибір відповіді в режимі вибору
    const selectOption = (option) => {
        setUserAnswer(option);
    };

    // Відображення режиму вибору тесту
    if (!testMode) {
        return (
            <div className="test">
                <h2 className="section-title">Тести на знання</h2>

                <div className="category-chooser">
                    <label className="form-label">Фільтр за категорією:</label>
                    <select
                        className="form-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">Всі категорії</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <p className="words-count">
                        {filteredWords.length > 0
                            ? `${filteredWords.length} слів доступно для тестування`
                            : 'Немає слів у цій категорії'}
                    </p>
                </div>

                <div className="test-modes">
                    <div className="test-card">
                        <div className="test-card-body">
                            <h3 className="test-card-title">Тест з варіантами</h3>
                            <p className="test-card-text">
                                Оберіть правильний переклад слова з чотирьох варіантів відповідей.
                            </p>
                            <button
                                onClick={() => startTest('choice')}
                                className="btn btn-primary full-width"
                                disabled={filteredWords.length < 4}
                            >
                                Почати тест
                            </button>
                        </div>
                    </div>

                    <div className="test-card">
                        <div className="test-card-body">
                            <h3 className="test-card-title">Тест на введення</h3>
                            <p className="test-card-text">
                                Напишіть правильний переклад показаного слова.
                            </p>
                            <button
                                onClick={() => startTest('write')}
                                className="btn btn-primary full-width"
                                disabled={filteredWords.length < 4}
                            >
                                Почати тест
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Відображення результатів завершеного тесту
    if (testComplete) {
        const score = Math.round((testProgress.correct / testProgress.total) * 100);

        return (
            <div className="test-results">
                <h2 className="section-title">Тест завершено!</h2>

                <div className="result-summary">
                    <div className="score-circle-container">
                        <div className="score-circle">
                            <div className="score-content">
                                <div className="score-value">{score}%</div>
                                <div className="score-label">Результат</div>
                            </div>
                        </div>
                    </div>

                    <p className="score-text">
                        {testProgress.correct} правильних відповідей з {testProgress.total}
                    </p>
                </div>

                <div className="test-actions">
                    <button
                        onClick={() => startTest(testMode)}
                        className="btn btn-primary"
                    >
                        Спробувати ще раз
                    </button>
                    <button
                        onClick={() => setTestMode(null)}
                        className="btn btn-secondary"
                    >
                        Вийти до меню
                    </button>
                </div>
            </div>
        );
    }

    // Відображення тесту в процесі
    return (
        <div className="test-in-progress">
            <h2 className="section-title">
                {testMode === 'choice' ? 'Тест з варіантами' : 'Тест на введення'}
            </h2>

            <div className="test-progress-bar">
                <div className="progress-info">
                    <div className="question-counter">
                        Питання {testProgress.current} з {testProgress.total}
                    </div>
                    <div className="correct-counter">
                        Правильних: {testProgress.correct}
                    </div>
                </div>
            </div>

            <div className="question-container">
                <h3 className="question-text">
                    Як перекладається слово: <span className="word-highlight">{currentQuestion?.original}</span>?
                </h3>

                {testMode === 'choice' ? (
                    <div className="options-container">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => selectOption(option)}
                                disabled={result !== null}
                                className={`option-button ${
                                    userAnswer === option ? 'selected' : ''
                                } ${
                                    result && option === result.correctAnswer
                                        ? 'correct'
                                        : result && userAnswer === option && !result.isCorrect
                                            ? 'incorrect'
                                            : ''
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="write-answer-container">
                        <input
                            type="text"
                            placeholder="Введіть переклад..."
                            className="form-input"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={result !== null}
                        />
                    </div>
                )}

                {result && (
                    <div className={`result-message ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                        {result.isCorrect
                            ? 'Правильно!'
                            : `Неправильно. Правильна відповідь: ${result.correctAnswer}`}
                    </div>
                )}
            </div>

            <div className="test-actions">
                <button
                    onClick={() => setTestMode(null)}
                    className="btn btn-secondary"
                >
                    Вийти
                </button>

                {!result ? (
                    <button
                        onClick={checkAnswer}
                        className="btn btn-primary"
                        disabled={!userAnswer}
                    >
                        Перевірити
                    </button>
                ) : (
                    <button
                        onClick={nextQuestion}
                        className="btn btn-primary"
                    >
                        Наступне слово
                    </button>
                )}
            </div>
        </div>
    );
}

export default Test;