import React from 'react';
import { FaGlobe, FaCog } from 'react-icons/fa';
import '../styles/Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <div className="header-content">
                    <div className="header-title">
                        <h1>Language Learning App</h1>
                        <p>Вивчайте мови легко та ефективно</p>
                    </div>
                    <div className="icons-container">
                        <button className="icon-button">
                            <FaGlobe className="header-icon" />
                        </button>
                        <button className="icon-button">
                            <FaCog className="header-icon" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
