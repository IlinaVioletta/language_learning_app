import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import '../styles/Vocabulary.css';
import { defaultVocabulary } from '../data/dictionary';

function Vocabulary() {
    const [originalWord, setOriginalWord] = useState('');
    const [translatedWord, setTranslatedWord] = useState('');
    const [category, setCategory] = useState('general');
    const [words, setWords] = useState(() => {
        const savedWords = JSON.parse(localStorage.getItem('vocabulary')) || [];
        if (savedWords.length === 0) {
            localStorage.setItem('vocabulary', JSON.stringify(defaultVocabulary));
            return defaultVocabulary;
        }
        return savedWords;
    });
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const categories = [
        { id: 'general', name: 'Загальні' },
        { id: 'travel', name: 'Подорожі' },
        { id: 'business', name: 'Бізнес' },
        { id: 'food', name: 'Їжа' },
        { id: 'tech', name: 'Технології' }
    ];

    useEffect(() => {
        localStorage.setItem('vocabulary', JSON.stringify(words));
    }, [words]);

    const addWord = () => {
        if (originalWord.trim() && translatedWord.trim()) {
            const newWord = {
                original: originalWord.trim(),
                translated: translatedWord.trim(),
                category: category,
                dateAdded: new Date().toISOString(),
                lastTested: null,
                correctCount: 0,
                incorrectCount: 0
            };

            setWords([...words, newWord]);
            setOriginalWord('');
            setTranslatedWord('');
        }
    };

    const deleteWord = (index) => {
        const wordToDelete = filteredWords[index];

        const originalIndex = words.findIndex(word =>
            word.original === wordToDelete.original &&
            word.translated === wordToDelete.translated
        );

        if (originalIndex !== -1) {
            const updatedWords = [...words];
            updatedWords.splice(originalIndex, 1);
            setWords(updatedWords);
        }
    };

    const startEditing = (index) => {
        const wordToEdit = filteredWords[index];

        const originalIndex = words.findIndex(word =>
            word.original === wordToEdit.original &&
            word.translated === wordToEdit.translated
        );

        if (originalIndex !== -1) {
            setEditingIndex(originalIndex);
            setOriginalWord(words[originalIndex].original);
            setTranslatedWord(words[originalIndex].translated);
            setCategory(words[originalIndex].category);
        }
    };

    const saveEdit = () => {
        if (originalWord.trim() && translatedWord.trim() && editingIndex !== null) {
            const updatedWords = [...words];
            updatedWords[editingIndex] = {
                ...updatedWords[editingIndex],
                original: originalWord.trim(),
                translated: translatedWord.trim(),
                category: category
            };

            setWords(updatedWords);
            setEditingIndex(null);
            setOriginalWord('');
            setTranslatedWord('');
            setCategory('general');
        }
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setOriginalWord('');
        setTranslatedWord('');
        setCategory('general');
    };

    const filteredWords = words.filter(word => {
        const matchesSearch = word.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
            word.translated.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filter === 'all' || word.category === filter;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="vocabulary">
            <h2 className="section-title">Мій словник</h2>

            <div className="add-word-form">
                <div className="form-container">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Слово:</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Оригінальне слово"
                                value={originalWord}
                                onChange={(e) => setOriginalWord(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Переклад:</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Переклад слова"
                                value={translatedWord}
                                onChange={(e) => setTranslatedWord(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Категорія:</label>
                            <select
                                className="form-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    {editingIndex !== null ? (
                        <div className="edit-actions">
                            <button
                                onClick={saveEdit}
                                className="btn btn-success"
                            >
                                <FaSave className="btn-icon" /> Зберегти
                            </button>
                            <button
                                onClick={cancelEdit}
                                className="btn btn-secondary"
                            >
                                <FaTimes className="btn-icon" /> Скасувати
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={addWord}
                            className="btn btn-primary"
                        >
                            Додати слово
                        </button>
                    )}
                </div>
            </div>

            <div className="filters-container">
                <div className="category-filter">
                    <select
                        className="form-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">Всі категорії</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Пошук слів..."
                        className="form-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="words-table">
                    <thead>
                    <tr>
                        <th className="word-column">Слово</th>
                        <th className="translation-column">Переклад</th>
                        <th className="category-column">Категорія</th>
                        <th className="actions-column">Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredWords.length > 0 ? (
                        filteredWords.map((word, index) => (
                            <tr key={index} className="word-row">
                                <td className="word-column">{word.original}</td>
                                <td className="translation-column">{word.translated}</td>
                                <td className="category-column">
                                    {categories.find(cat => cat.id === word.category)?.name || word.category}
                                </td>
                                <td className="actions-cell">
                                    <button
                                        onClick={() => startEditing(index)}
                                        className="action-btn edit-btn"
                                        title="Редагувати"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => deleteWord(index)}
                                        className="action-btn delete-btn"
                                        title="Видалити"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="empty-state">
                                {words.length === 0
                                    ? "Ваш словник порожній. Додайте своє перше слово!"
                                    : "Нічого не знайдено за вашим запитом."}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Vocabulary;