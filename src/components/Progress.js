import React from 'react';

function Progress() {
    const words = JSON.parse(localStorage.getItem('words')) || [];

    return (
        <div className="section">
            <h2>Мій прогрес</h2>
            <p>Кількість вивчених слів: {words.length}</p>
        </div>
    );
}

export default Progress;
