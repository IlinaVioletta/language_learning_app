import React, { useState } from 'react';
import { FaCog, FaQuestion } from 'react-icons/fa';
import '../styles/Header.css';
import Settings from './Settings';
import Help from './Help';

function Header() {
    const [showSettings, setShowSettings] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-content">
                    <div className="header-title">
                        <h1>Language Learning App</h1>
                        <p>Вивчайте мови легко та ефективно</p>
                    </div>
                    <div className="icons-container">
                        <button
                            className="icon-button"
                            onClick={() => setShowHelp(true)}
                            title="Довідка"
                        >
                            <FaQuestion className="header-icon" />
                        </button>
                        <button
                            className="icon-button"
                            onClick={() => setShowSettings(true)}
                            title="Налаштування"
                        >
                            <FaCog className="header-icon" />
                        </button>
                    </div>
                </div>
            </div>

            {showSettings && <Settings onClose={() => setShowSettings(false)} />}
            {showHelp && <Help onClose={() => setShowHelp(false)} />}
        </header>
    );
}

export default Header;