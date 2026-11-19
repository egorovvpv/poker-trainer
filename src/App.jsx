import React, { useState, useEffect } from 'react';
import { dealStartingHand, convertToChartFormat, getSuitIcon } from './pokerEngine';
import charts from './charts.json';
import './App.css';

// Доступные конфигурации блайндов в нашем приложении
const BLIND_CONFIGS = [
  { id: 'HU_SB_fish_21_99BB', label: '21 - 99 BB' },
  { id: 'HU_SB_fish_18_20BB', label: '18 - 20 BB' },
  { id: 'HU_SB_fish_16_17BB', label: '16 - 17 BB' }
];

const SCENARIOS = [
  { id: 'first_action', label: 'Ваш первый ход на SB' },
  { id: 'vs_bb_allin', label: 'Вы сделали РЕЙЗ 2bb или Лимп ➜ BB сыграл ALL-IN' },
  { id: 'vs_bb_3bet', label: 'Вы сделали РЕЙЗ 2bb или Лимп ➜ BB сыграл 3-БЕТ (не олл-ин)' }
];

function App() {
  // Состояние выбранных блайндов
  const [selectedBlind, setSelectedBlind] = useState(BLIND_CONFIGS[0].id);
  // Состояние текущего случайного сценария
  const [currentScenario, setCurrentScenario] = useState(SCENARIOS[0]);
  // Состояние текущей руки
  const [currentHand, setCurrentHand] = useState(() => dealStartingHand());
  
  // Статистика сессии
  const [score, setScore] = useState(0);
  const [totalHanded, setTotalHanded] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Функция для выбора случайного сценария (вызывается при смене раздачи)
  const pickRandomScenario = () => {
    const randomIndex = Math.floor(Math.random() * SCENARIOS.length);
    setCurrentScenario(SCENARIOS[randomIndex]);
  };

  // Сброс руки и сценария при ручном переключении блайндов пользователем
  useEffect(() => {
    setCurrentHand(dealStartingHand());
    pickRandomScenario();
    setFeedback('');
  }, [selectedBlind]);

  const handleAction = (userAction) => {
    const handCode = convertToChartFormat(currentHand[0], currentHand[1]);
    
    // Подтягиваем нужную матрицу на основе выбранного уровня блайндов и сценария
    const activeChart = charts[selectedBlind];
    const activeMatrix = activeChart[currentScenario.id]?.matrix || {};
    
    // Если руки нет в матрице, дефолтное действие — fold
    const correctAction = activeMatrix[handCode] || 'fold';

    setTotalHanded(prev => prev + 1);

    if (userAction === correctAction) {
      setScore(prev => prev + 1);
      setFeedback(`Правильно! В ситуации [${currentScenario.label}] рука ${handCode} — это ${correctAction.toUpperCase()}`);
    } else {
      setFeedback(`Ошибка! Ситуация: [${currentScenario.label}]. С рукой ${handCode} правильно: ${correctAction.toUpperCase()}`);
    }

    // Сдаем новую руку и меняем игровой сценарий
    setCurrentHand(dealStartingHand());
    pickRandomScenario();
  };

  // Динамический рендеринг кнопок под текущий сценарий
  const renderButtons = () => {
    if (currentScenario.id === 'first_action') {
      return (
        <>
          <button className="btn-raise" onClick={() => handleAction('raise')}>RAISE 2BB</button>
          <button className="btn-call" onClick={() => handleAction('call')}>CALL</button>
          <button className="btn-allin" onClick={() => handleAction('allin')}>ALL-IN</button>
        </>
      );
    }
    return (
      <>
        <button className="btn-call" onClick={() => handleAction('call')}>CALL</button>
        <button className="btn-allin" onClick={() => handleAction('allin')}>ALL-IN</button>
        <button className="btn-fold" onClick={() => handleAction('fold')}>FOLD</button>
      </>
    );
  };

  return (
    <div className="trainer-container">
      <h1>Покерный Тренажер PRO (PokerHero Pack)</h1>
      <p className="subtitle">Хедз-ап против FISH. Позиция: Малый Блайнд (SB).</p>
      
      {/* Переключатель блайндов (Блок вкладок) */}
      <div className="blind-selector">
        {BLIND_CONFIGS.map((config) => (
          <button
            key={config.id}
            className={`blind-tab ${selectedBlind === config.id ? 'active' : ''}`}
            onClick={() => setSelectedBlind(config.id)}
          >
            {config.label}
          </button>
        ))}
      </div>
      
      <div className="scenario-badge">
        Ситуация: <strong>{currentScenario.label}</strong>
      </div>

      <div className="stats-board">
        <span>Успешно: <strong>{score}</strong> / {totalHanded}</span>
        {totalHanded > 0 && (
          <span className="pct"> Точность: {((score / totalHanded) * 100).toFixed(1)}%</span>
        )}
      </div>

      <div className="poker-table">
        <div className="card-slots">
          <div className={`poker-card ${currentHand[0].suit === 'h' || currentHand[0].suit === 'd' ? 'red' : 'black'}`}>
            <span className="rank">{currentHand[0].rank}</span>
            <span className="suit">{getSuitIcon(currentHand[0].suit)}</span>
          </div>
          <div className={`poker-card ${currentHand[1].suit === 'h' || currentHand[1].suit === 'd' ? 'red' : 'black'}`}>
            <span className="rank">{currentHand[1].rank}</span>
            <span className="suit">{getSuitIcon(currentHand[1].suit)}</span>
          </div>
        </div>
      </div>

      <div className="feedback-line">{feedback}</div>

      <div className="action-buttons">
        {renderButtons()}
      </div>
    </div>
  );
}

export default App;
