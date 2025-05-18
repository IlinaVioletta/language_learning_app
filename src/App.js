import React, { useState } from 'react';
import Vocabulary from './components/Vocabulary';
import Test from './components/Test';
import Progress from './components/Progress';
import Header from './components/Header';
import './App.css';

function App() {
    const [activeTab, setActiveTab] = useState('vocabulary');

    return (
        <div className="app-container">
            <Header />

            {/* Навігація */}
            <div className="main-container">
                <div className="tabs-navigation">
                    <button
                        className={`tab-button ${activeTab === 'vocabulary' ? 'active' : ''}`}
                        onClick={() => setActiveTab('vocabulary')}
                    >
                        Мій словник
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'test' ? 'active' : ''}`}
                        onClick={() => setActiveTab('test')}
                    >
                        Тести
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
                        onClick={() => setActiveTab('progress')}
                    >
                        Прогрес
                    </button>
                </div>

                {/* Основний контент */}
                <div className="content-container">
                    {activeTab === 'vocabulary' && <Vocabulary />}
                    {activeTab === 'test' && <Test />}
                    {activeTab === 'progress' && <Progress />}
                </div>
            </div>
        </div>
    );
}

export default App;