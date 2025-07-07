import React, { useRef, useEffect } from 'react';

export default function MatrixRain({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext('2d');

    c.height = window.innerHeight;
    c.width = window.innerWidth;

    const matrix = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ123456789@#$%^&*()*&^%';
    const characters = matrix.split('');

    const fontSize = 10;
    const columns = c.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
      
      const trailColor = isDarkTheme 
        ? 'rgba(30, 30, 30, 0.07)'
        : 'rgba(255, 255, 255, 0.07)';

      ctx.fillStyle = trailColor;
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.fillStyle = 'rgb(30, 144, 255)';
      ctx.font = `${fontSize}px consolas`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > c.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 80);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <canvas 
      className={className} 
      ref={canvasRef} 
      style={{ 
        width: '100%',
        height: '100%',
      }} 
    />
  );
};