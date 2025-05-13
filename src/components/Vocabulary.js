import React, { useState, useEffect } from 'react';

function Vocabulary() {
    const [word, setWord] = useState('');
    const [words, setWords] = useState(() => JSON.parse(localStorage.getItem('words')) || []);

    const addWord = () => {
        if (word.trim()) {
            const updated = [...words, word];
            setWords(updated);
            localStorage.setItem('words', JSON.stringify(updated));
            setWord('');
        }
    };

    return (
        <div className="section">
            <h2>Мій словник</h2>
            <input
                type="text"
                placeholder="Введіть слово"
                value={word}
                onChange={(e) => setWord(e.target.value)}
            />
            <button onClick={addWord}>Додати слово</button>
            <ul>
                {words.map((w, index) => <li key={index}>{w}</li>)}
            </ul>
        </div>
    );
}

export default Vocabulary;
