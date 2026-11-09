"use client";

import { useEffect } from "react";

/**
 * oneko: the cursor-chasing cat.
 *
 * A faithful port of oneko.js (https://github.com/adryd325/oneko.js, public
 * domain), which is itself a recreation of Masayuki Koba's X11 "neko".
 *
 * The cat runs toward the cursor at a fixed speed, plays a two-frame walk
 * cycle in one of eight directions, and once it catches up it idles: with a
 * chance of sleeping, washing itself, or scratching whichever wall it happens
 * to be standing against.
 */

const SPRITE_SIZE = 32;
const SPEED = 10;
const FRAME_MS = 100;

// Each entry is a [column, row] coordinate into the 8x4 sprite sheet.
const spriteSets: Record<string, [number, number][]> = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [
    [-5, 0],
    [-6, 0],
    [-7, 0],
  ],
  scratchWallN: [
    [0, 0],
    [0, -1],
  ],
  scratchWallS: [
    [-7, -1],
    [-6, -2],
  ],
  scratchWallE: [
    [-2, -2],
    [-2, -3],
  ],
  scratchWallW: [
    [-4, 0],
    [-4, -1],
  ],
  tired: [[-3, -2]],
  sleeping: [
    [-2, 0],
    [-2, -1],
  ],
  N: [
    [-1, -2],
    [-1, -3],
  ],
  NE: [
    [0, -2],
    [0, -3],
  ],
  E: [
    [-3, 0],
    [-3, -1],
  ],
  SE: [
    [-5, -1],
    [-5, -2],
  ],
  S: [
    [-6, -3],
    [-7, -2],
  ],
  SW: [
    [-5, -3],
    [-6, -1],
  ],
  W: [
    [-4, -2],
    [-4, -3],
  ],
  NW: [
    [-1, 0],
    [-1, -1],
  ],
};

export function Oneko() {
  useEffect(() => {
    // The cat is decoration; don't animate it for people who asked not to.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const el = document.createElement("div");
    el.id = "oneko";
    el.ariaHidden = "true";
    Object.assign(el.style, {
      width: `${SPRITE_SIZE}px`,
      height: `${SPRITE_SIZE}px`,
      position: "fixed",
      pointerEvents: "none",
      imageRendering: "pixelated",
      left: "16px",
      top: "16px",
      zIndex: "2147483647",
      backgroundImage: "url(/oneko/oneko.gif)",
    });
    document.body.appendChild(el);

    let nekoPosX = 32;
    let nekoPosY = 32;
    let mousePosX = window.innerWidth / 2;
    let mousePosY = window.innerHeight / 2;

    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: string | null = null;
    let idleAnimationFrame = 0;

    function setSprite(name: string, frame: number) {
      const sets = spriteSets[name] ?? spriteSets.idle;
      const sprite = sets[frame % sets.length];
      el.style.backgroundPosition = `${sprite[0] * SPRITE_SIZE}px ${
        sprite[1] * SPRITE_SIZE
      }px`;
    }

    function resetIdleAnimation() {
      idleAnimation = null;
      idleAnimationFrame = 0;
    }

    function idle() {
      idleTime += 1;

      // Every so often, pick something to do while waiting.
      if (
        idleTime > 10 &&
        Math.floor(Math.random() * 200) === 0 &&
        idleAnimation == null
      ) {
        const options = ["sleeping", "scratchSelf"];
        if (nekoPosX < 32) options.push("scratchWallW");
        if (nekoPosY < 32) options.push("scratchWallN");
        if (nekoPosX > window.innerWidth - 32) options.push("scratchWallE");
        if (nekoPosY > window.innerHeight - 32) options.push("scratchWallS");
        idleAnimation = options[Math.floor(Math.random() * options.length)];
      }

      switch (idleAnimation) {
        case "sleeping":
          // Yawn first, then settle into the "Zz" loop.
          if (idleAnimationFrame < 8) {
            setSprite("tired", 0);
            break;
          }
          setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
          if (idleAnimationFrame > 192) resetIdleAnimation();
          break;
        case "scratchWallN":
        case "scratchWallS":
        case "scratchWallE":
        case "scratchWallW":
        case "scratchSelf":
          setSprite(idleAnimation, idleAnimationFrame);
          if (idleAnimationFrame > 9) resetIdleAnimation();
          break;
        default:
          setSprite("idle", 0);
          return;
      }
      idleAnimationFrame += 1;
    }

    function frame() {
      frameCount += 1;
      const diffX = nekoPosX - mousePosX;
      const diffY = nekoPosY - mousePosY;
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

      // Close enough: sit down.
      if (distance < SPEED || distance < 48) {
        idle();
        return;
      }

      resetIdleAnimation();

      // Just woken up: look startled for a beat before giving chase.
      if (idleTime > 1) {
        setSprite("alert", 0);
        idleTime = Math.min(idleTime, 7);
        idleTime -= 1;
        return;
      }

      let direction = diffY / distance > 0.5 ? "N" : "";
      direction += diffY / distance < -0.5 ? "S" : "";
      direction += diffX / distance > 0.5 ? "W" : "";
      direction += diffX / distance < -0.5 ? "E" : "";
      setSprite(direction, frameCount);

      nekoPosX -= (diffX / distance) * SPEED;
      nekoPosY -= (diffY / distance) * SPEED;

      nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
      nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

      el.style.left = `${nekoPosX - 16}px`;
      el.style.top = `${nekoPosY - 16}px`;
    }

    function onMouseMove(event: MouseEvent) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    }

    document.addEventListener("mousemove", onMouseMove);

    // Run at a steady 10fps, driven by rAF so it pauses in background tabs.
    let lastFrameTimestamp: number | undefined;
    let rafId = 0;

    function onAnimationFrame(timestamp: number) {
      if (!el.isConnected) return;
      if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;
      if (timestamp - lastFrameTimestamp > FRAME_MS) {
        lastFrameTimestamp = timestamp;
        frame();
      }
      rafId = window.requestAnimationFrame(onAnimationFrame);
    }
    rafId = window.requestAnimationFrame(onAnimationFrame);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.cancelAnimationFrame(rafId);
      el.remove();
    };
  }, []);

  return null;
}
