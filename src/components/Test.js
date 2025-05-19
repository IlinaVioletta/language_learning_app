import React, { useState, useEffect } from 'react';
import '../styles/Test.css';

function Test() {
    const [vocabularyWords, setVocabularyWords] = useState([]);
    const [testMode, setTestMode] = useState(null); // 'choice', 'write', 'matching'
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [options, setOptions] = useState([]);
    const [result, setResult] = useState(null);

    // Додаємо лічильник помилок до прогресу тесту
    const [testProgress, setTestProgress] = useState({
        current: 0,
        total: 0,
        correct: 0,
        errors: 0 // Додали лічильник помилок
    });

    const [testComplete, setTestComplete] = useState(false);
    const [testHistory, setTestHistory] = useState(() => JSON.parse(localStorage.getItem('testHistory')) || []);
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Додаємо стан для відстеження слів, у яких були помилки
    const [errorWords, setErrorWords] = useState([]);

    // Додаємо стани для тесту на співставлення
    const [matchingPairs, setMatchingPairs] = useState({ originals: [], translations: [] });
    const [selectedWord, setSelectedWord] = useState(null);
    const [completedPairs, setCompletedPairs] = useState([]);
    const [wrongPair, setWrongPair] = useState(null);

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
        setErrorWords([]); // Очищуємо список слів з помилками

        if (mode === 'matching') {
            // Для тесту на співставлення обираємо 6 випадкових слів (або менше, якщо слів менше 6)
            const numWords = Math.min(6, filteredWords.length);
            const shuffledWords = [...filteredWords].sort(() => Math.random() - 0.5);
            const testWords = shuffledWords.slice(0, numWords);

            // Створюємо пари слів для співставлення
            const pairs = testWords.map(word => ({
                original: word.original,
                translated: word.translated,
                id: Math.random().toString(36).substr(2, 9)
            }));

            // Перемішуємо пари
            const shuffledOriginals = [...pairs].sort(() => Math.random() - 0.5);
            const shuffledTranslations = [...pairs].sort(() => Math.random() - 0.5);

            setMatchingPairs({
                originals: shuffledOriginals,
                translations: shuffledTranslations
            });
            setCompletedPairs([]);
            setSelectedWord(null);
            setWrongPair(null);

            setTestProgress({
                current: 0,
                total: testWords.length,
                correct: 0,
                errors: 0
            });

        } else {
            setTestProgress({
                current: 1,
                total: Math.min(10, filteredWords.length),
                correct: 0,
                errors: 0
            });

            generateQuestion(mode, 0);
        }
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
        // Визначаємо фінальний рахунок і загальну кількість
        let finalScore;
        let finalTotal = testProgress.total;

        if (testMode === 'matching') {
            // Для тесту на співставлення:
            // Рахунок = кількість знайдених пар мінус кількість помилок (але не менше 0)
            finalScore = Math.max(0, completedPairs.length - testProgress.errors);
        } else {
            // Для інших типів тестів
            finalScore = testProgress.correct;
        }

        const newTestResult = {
            date: new Date().toISOString(),
            mode: testMode,
            score: finalScore,
            total: finalTotal,
            errors: testProgress.errors,
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
                // Додаємо слово до списку слів з помилками
                if (!errorWords.some(w => w.original === currentQuestion.original)) {
                    setErrorWords([...errorWords, currentQuestion]);
                }
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
        } else {
            // Збільшуємо лічильник помилок
            setTestProgress(prev => ({
                ...prev,
                errors: prev.errors + 1
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

    // Функція для обробки кліку по слову в тесті на співставлення
    const handleWordClick = (word, type) => {
        // Якщо є анімація неправильної пари, ігноруємо клік
        if (wrongPair) return;

        // Перевіряємо, чи слово вже в завершених парах
        if (completedPairs.some(pair =>
            pair.original === word.original || pair.translated === word.translated
        )) {
            return;
        }

        if (!selectedWord) {
            setSelectedWord({ word, type });
        } else {
            // Слово вже вибране, перевіряємо чи це пара
            if (selectedWord.type === type) {
                // Користувач натиснув на слово того ж типу, просто змінюємо вибір
                setSelectedWord({ word, type });
            } else {
                // Користувач натиснув на слово іншого типу, перевіряємо чи це пара
                const isMatch = selectedWord.type === 'original'
                    ? selectedWord.word.id === word.id
                    : word.id === selectedWord.word.id;

                if (isMatch) {
                    // Пара знайдена!
                    setCompletedPairs([...completedPairs, {
                        original: selectedWord.type === 'original' ? selectedWord.word.original : word.original,
                        translated: selectedWord.type === 'original' ? word.translated : selectedWord.word.translated,
                        id: selectedWord.word.id
                    }]);

                    // Збільшуємо прогрес
                    setTestProgress(prev => ({
                        ...prev,
                        current: prev.current + 1,
                        correct: prev.correct + 1
                    }));

                    // Скидаємо вибране слово
                    setSelectedWord(null);

                    // Перевіряємо чи тест завершено
                    if (completedPairs.length + 1 >= testProgress.total) {
                        setTimeout(() => {
                            finishTest();
                        }, 500);
                    }
                } else {
                    // Неправильна пара!
                    // Знаходимо правильну пару до першого обраного слова
                    const firstSelectedWord = selectedWord.word;
                    const correctPairId = firstSelectedWord.id;

                    // Встановлюємо неправильну пару і правильну пару для відображення помилки
                    setWrongPair({
                        // Перше слово, яке користувач вибрав
                        firstSelected: {
                            word: selectedWord.word,
                            type: selectedWord.type
                        },
                        // Друге слово, яке користувач вибрав (неправильне)
                        secondSelected: {
                            word: word,
                            type: type
                        },
                        // ID правильної пари для першого вибраного слова
                        correctPairId: correctPairId
                    });

                    // Збільшуємо лічильник помилок
                    setTestProgress(prev => ({
                        ...prev,
                        errors: prev.errors + 1
                    }));

                    // Додаємо слово до списку слів з помилками
                    const errorWord = selectedWord.type === 'original' ? selectedWord.word : word;
                    if (!errorWords.some(w => w.original === errorWord.original)) {
                        const originalWord = vocabularyWords.find(w => w.original === errorWord.original);
                        if (originalWord) {
                            setErrorWords([...errorWords, originalWord]);
                        }
                    }

                    // Скидаємо вибране слово після короткої затримки
                    setTimeout(() => {
                        setSelectedWord(null);
                        setWrongPair(null);
                    }, 800);

                    // Оновлення статистики слів
                    const wordToUpdate = selectedWord.type === 'original' ? selectedWord.word : word;
                    const updatedWords = [...vocabularyWords];
                    const wordIndex = updatedWords.findIndex(w =>
                        w.original === wordToUpdate.original
                    );

                    if (wordIndex !== -1) {
                        updatedWords[wordIndex].incorrectCount =
                            (updatedWords[wordIndex].incorrectCount || 0) + 1;
                        updatedWords[wordIndex].lastTested = new Date().toISOString();

                        setVocabularyWords(updatedWords);
                        localStorage.setItem('vocabulary', JSON.stringify(updatedWords));
                    }
                }
            }
        }
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

                    <div className="test-card">
                        <div className="test-card-body">
                            <h3 className="test-card-title">Тест на співставлення</h3>
                            <p className="test-card-text">
                                З'єднайте слова та їх переклади, клікаючи на них по черзі.
                            </p>
                            <button
                                onClick={() => startTest('matching')}
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
        // Розраховуємо відсоток успішності
        let score;
        let scoreFraction;

        if (testMode === 'matching') {
            // Для тесту на співставлення
            scoreFraction = Math.max(0, completedPairs.length - testProgress.errors);
            score = Math.round((scoreFraction / testProgress.total) * 100);
        } else {
            // Для інших типів тестів
            scoreFraction = testProgress.correct;
            score = Math.round((scoreFraction / testProgress.total) * 100);
        }

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
                        {testMode === 'matching'
                            ? `${completedPairs.length} знайдених пар з ${testProgress.total} (${testProgress.errors} помилок = ${Math.max(0, completedPairs.length - testProgress.errors)}/${testProgress.total})`
                            : `${testProgress.correct} правильних відповідей з ${testProgress.total}`}
                    </p>
                </div>

                {/* Додаємо відображення слів з помилками */}
                {errorWords.length > 0 && (
                    <div className="error-words-container">
                        <h3 className="error-words-title">Слова, в яких були допущені помилки:</h3>
                        <div className="error-words-list">
                            {errorWords.map((word, index) => (
                                <div key={index} className="error-word-item">
                                    <span className="error-word-original">{word.original}</span>
                                    <span className="error-word-arrow">→</span>
                                    <span className="error-word-translated">{word.translated}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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

    // Відображення тесту на співставлення
    if (testMode === 'matching') {
        return (
            <div className="matching-test">
                <h2 className="section-title">Тест на співставлення</h2>

                <div className="test-progress-bar">
                    <div className="progress-info">
                        <div className="question-counter">
                            Знайдено пар: {completedPairs.length} з {testProgress.total}
                        </div>
                        {testProgress.errors > 0 && (
                            <div className="error-counter">
                                Помилок: {testProgress.errors}
                            </div>
                        )}
                    </div>
                </div>

                <div className="matching-container">
                    <div className="matching-column">
                        <h3 className="matching-column-title">Слова</h3>
                        <div className="matching-words">
                            {matchingPairs.originals && matchingPairs.originals.map(word => {
                                const isCompleted = completedPairs.some(pair => pair.original === word.original);
                                const isSelected = selectedWord &&
                                    selectedWord.type === 'original' &&
                                    selectedWord.word.original === word.original;

                                // Змінена умова для підсвічування неправильних пар
                                const isWrong = wrongPair && (
                                    (wrongPair.firstSelected.type === 'original' && wrongPair.firstSelected.word.id === word.id) ||
                                    (wrongPair.firstSelected.type === 'translated' && wrongPair.correctPairId === word.id)
                                );

                                return (
                                    <button
                                        key={word.id}
                                        className={`matching-word 
                                            ${isCompleted ? 'completed' : ''} 
                                            ${isSelected ? 'selected' : ''} 
                                            ${isWrong ? 'wrong' : ''}`}
                                        onClick={() => handleWordClick(word, 'original')}
                                        disabled={isCompleted}
                                    >
                                        {word.original}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="matching-column">
                        <h3 className="matching-column-title">Переклади</h3>
                        <div className="matching-words">
                            {matchingPairs.translations && matchingPairs.translations.map(word => {
                                const isCompleted = completedPairs.some(pair => pair.translated === word.translated);
                                const isSelected = selectedWord &&
                                    selectedWord.type === 'translated' &&
                                    selectedWord.word.translated === word.translated;

                                // Змінена умова для підсвічування неправильних пар
                                const isWrong = wrongPair && (
                                    (wrongPair.firstSelected.type === 'translated' && wrongPair.firstSelected.word.id === word.id) ||
                                    (wrongPair.firstSelected.type === 'original' && wrongPair.correctPairId === word.id)
                                );

                                return (
                                    <button
                                        key={word.id}
                                        className={`matching-word 
                                            ${isCompleted ? 'completed' : ''} 
                                            ${isSelected ? 'selected' : ''} 
                                            ${isWrong ? 'wrong' : ''}`}
                                        onClick={() => handleWordClick(word, 'translated')}
                                        disabled={isCompleted}
                                    >
                                        {word.translated}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="test-actions">
                    <button
                        onClick={() => setTestMode(null)}
                        className="btn btn-secondary"
                    >
                        Вийти
                    </button>
                </div>
            </div>
        );
    }

    // Відображення тесту в процесі (choice або write)
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
                    <div className="stats-counter">
                        <span className="correct-counter">
                            Правильних: {testProgress.correct}
                        </span>
                        {testProgress.errors > 0 && (
                            <span className="error-counter">
                                Помилок: {testProgress.errors}
                            </span>
                        )}
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