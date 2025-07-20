import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Duck } from './Duck';
import { GitHubIcon, LinkedInIcon, BuyMeACoffeeIcon } from './Icons';
import './App.css';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  const [showOverlay, setShowOverlay] = useState(true);
  const [duckScale, setDuckScale] = useState([3, 3, 3]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleClick = () => {
    setShowOverlay(!showOverlay);
    if (!hasInteracted) setHasInteracted(true);
  };

  const calculateDuckScale = () => {
    const width = window.innerWidth;
    let scale = [3, 3, 3];
    if (width < 768) {
      scale = [2, 2, 2];
    } else if (width < 1200) {
      scale = [2.5, 2.5, 2.5];
    }
    setDuckScale(scale);
  };

  useEffect(() => {
    calculateDuckScale();
    window.addEventListener('resize', calculateDuckScale);
    return () => {
      window.removeEventListener('resize', calculateDuckScale);
    };
  }, []);

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    if (!hasInteracted) setHasInteracted(true);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <button onClick={toggleSound} className="sound-toggle-button">
        {isSoundEnabled ? '🔊' : '🔇'}
      </button>
      <button onClick={toggleDarkMode} className="dark-mode-toggle-button">
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div className={`canvas-container ${showOverlay ? 'blurred' : ''}`} onClick={handleClick}>
        {showOverlay && (
          <div className="overlay">
            <h1>{t('app_title')}</h1>
            <p>{t('overlay_text_p1')}</p>
            <p>{t('overlay_text_p2')}</p>
          </div>
        )}
        <Canvas style={{ height: '100vh' }} camera={{ position: [0, 0, 5], fov: 50 }}>
          <>
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.7} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <directionalLight position={[0, 5, 5]} intensity={2.0} />
            <Suspense fallback={null}>
              <Duck position={[2, -5.2, -1]} scale={duckScale} isSoundEnabled={isSoundEnabled} hasInteracted={hasInteracted} />
            </Suspense>
          </>
        </Canvas>
      </div>

      <footer className="app-footer">
        <span>{t('created_by', { name: 'rUrtiaga' })}</span>
        <a href="https://github.com/rUrtiaga" target="_blank" rel="noopener noreferrer">
          <GitHubIcon />
        </a>
        <a href="https://linkedin.com/in/rmu" target="_blank" rel="noopener noreferrer">
          <LinkedInIcon />
        </a>
        <a href="https://www.buymeacoffee.com/rUrtiaga" target="_blank" rel="noopener noreferrer" className="bmac-link">
          <BuyMeACoffeeIcon />
          <span>{t('buy_me_a_coffee')}</span>
        </a>
      </footer>
    </div>
  );
}

export default App;