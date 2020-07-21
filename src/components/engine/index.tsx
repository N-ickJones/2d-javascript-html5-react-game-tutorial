import React, { useState, useEffect, useRef } from 'react';
import styles from './engine.module.scss';
import { useEvent } from '../../hooks';
import { CreateEngine, gameStatus } from './engine';

const initialState = {
  stage: 0,
  position: 0,
  blocks: [] as number[],
  status: gameStatus.Start,
};

export default function Engine() {
  const [gameState, setGameState] = useState(initialState);
  const [start, setStart] = useState(false);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Welcome! Press Spacebar to play and again to jump.");
  const engine = useRef(new CreateEngine(setGameState))
  
  const handleKeyPress = (e: any) => {
    if (e.key === ' ') {
      if (!running && !start) {
        setStatus("")
        setStart(true);
      }
      else {
        engine.current.jump();
      }
    }
  };
  useEvent('keyup', handleKeyPress);
  
  /*
  const handleScroll = (e: any) => { 
    const thing = window.scrollY;
    let scrollTop = e.srcElement.body.scrollTop, itemTranslate = Math.min(0, scrollTop/3 - 60);
  }
  useEvent('scroll', handleScroll);
  */

  useEffect(() => {
    if (start) {
      setRunning(true);
      setStart(false);
      engine.current.start();
    }

    if (gameState.status === gameStatus.Fail && running) {
      setRunning(false);
      setStatus("You lost! Press Spacebar to try again.");
      setGameState(initialState);
      setStart(false);
    }

    if (gameState.status === gameStatus.Win && running) {
      setRunning(false);
      setStatus("You won! Press Spacebar to play again.");
      setGameState(initialState);
      setStart(false);
    }
  }, [
    engine,
    gameState.status,
    start,
    running
  ]);

  return (
    <div
      className={styles.container}
    >
      <div className={styles.banner}><h4 className={styles.bannerText}>{status}</h4></div>
      <div
        className={styles.stage}
        style={{
          transform: `translate(-${engine.current.stage}px, 0px)`,
        }}
      >
        <span
          className={styles.character}
          style={{
            transform: `translate(${engine.current.stage + 200}px, -${engine.current.position}px)`,
            height: engine.current.settings.charHeight,
            width: engine.current.settings.charWidth,
          }}
        />
        {
          engine.current.blocks.map(
            block => (
              <span
                className={styles.block}
                key={block}
                style={{
                  transform: `translate(${block}px, 0px)`,
                  height: engine.current.settings.blockHeight,
                  width: engine.current.settings.blockWidth,
                }}
              />
            ),
          )
        }
      </div>
    </div>
  );
}
