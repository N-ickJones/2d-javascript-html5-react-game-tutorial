import React, { useState, useEffect, useRef } from 'react';
import styles from './engine.module.scss';
import { useEvent } from '../../hooks';
import { CreateEngine, gameStatus, CreateEngineBlock } from './engine';

const initialState = {
  stage: 0,
  position: 0,
  blocks: [] as CreateEngineBlock[],
  status: gameStatus.Start,
};

const settings = {
  tile: 20,
  jumpVelocity: 1.5,
  jumpHeight: 35,
  charWidth: 100,
  charHeight: 100,
  blockWidth: 150,
  blockHeight: 200,
}

const level = {
  length: 10,
  spacingMin: 100,
  spacingMax: 200,
  heightMin: 200,
  heightMax: 400,
  widthMin: 180,
  widthMax: 260
}

export default function Engine() {
  const [gameState, setGameState] = useState(initialState);
  const [start, setStart] = useState(false);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Welcome! Press Spacebar to play and again to jump.");
  const engine = useRef(new CreateEngine(settings));

  useEffect(() => {
    engine.current.setState = setGameState;
    engine.current.createLevel(level);
  }, [])
  
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

  useEffect(() => {
    if (start) {
      setRunning(true);
      setStart(false);
      engine.current.start();
    }

    if (gameState.status === gameStatus.Fail && running) {
      setRunning(false);
      setStatus("You lost! Press Spacebar to try again.");
      setStart(false);
    }

    if (gameState.status === gameStatus.Win && running) {
      setRunning(false);
      setStatus("You won! Press Spacebar to play again.");
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
          width: engine.current.width
        }}
      >
        <span
          className={styles.character}
          style={{
            transform: `translate(${engine.current.stage + engine.current.offset}px, -${engine.current.position}px)`,
            height: engine.current.settings.charHeight,
            width: engine.current.settings.charWidth,
          }}
        />
        {
          engine.current.blocks.map(
            (block, id) => (
              <span
                className={styles.block}
                key={id}
                style={{
                  transform: `translate(${block.transform}px, 0px)`,
                  height: block.height,
                  width: block.width,
                }}
              />
            ),
          )
        }
      </div>
    </div>
  );
}
