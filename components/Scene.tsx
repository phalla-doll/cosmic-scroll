import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, Group } from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Planet, Sun } from './Planets';
import StarField from './StarField';
import { PlanetConfig } from '../types';

gsap.registerPlugin(ScrollTrigger);

export const PLANET_DATA: PlanetConfig[] = [
  { name: "Earth", color: "#2E86C1", positionX: 30, scale: 2, description: "The Blue Marble", orbitSpeed: 1 },
  { name: "Mars", color: "#C0392B", positionX: 60, scale: 1.5, description: "The Red Planet", orbitSpeed: 0.8 },
  { name: "Jupiter", color: "#D35400", positionX: 120, scale: 4, description: "The Gas Giant", orbitSpeed: 0.4 },
];

const Scene: React.FC = () => {
  const { camera, scene } = useThree();
  
  const earthPivot = useRef<Group>(null);
  const marsPivot = useRef<Group>(null);
  const jupiterPivot = useRef<Group>(null);
  
  // Camera target proxy for smooth lookAt animation
  const cameraTarget = useRef(new Vector3(30, 0, 0)); 

  useLayoutEffect(() => {
    // Ensure the scroll trigger is refreshed
    ScrollTrigger.refresh();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    // --- PHASE 1: Earth to Mars ---
    // Move Camera
    tl.to(camera.position, {
      x: 60,
      y: 2,
      z: 20,
      duration: 1,
      ease: "power1.inOut"
    }, "start");

    // Move LookAt Target
    tl.to(cameraTarget.current, {
      x: 60,
      y: 0,
      z: 0,
      duration: 1,
      ease: "power1.inOut"
    }, "start");

    // Rotate Pivots (Time passing)
    tl.to(earthPivot.current!.rotation, { y: Math.PI * 0.5, duration: 1 }, "start");
    tl.to(marsPivot.current!.rotation, { y: Math.PI * 0.25, duration: 1 }, "start");

    // --- PHASE 2: Mars to Jupiter ---
    // Move Camera
    tl.to(camera.position, {
      x: 120,
      y: 5,
      z: 40,
      duration: 1,
      ease: "power1.inOut"
    }, "journey");

    // Move LookAt Target
    tl.to(cameraTarget.current, {
      x: 120,
      y: 0,
      z: 0,
      duration: 1,
      ease: "power1.inOut"
    }, "journey");

     // Rotate Pivots further
     tl.to(earthPivot.current!.rotation, { y: Math.PI * 1, duration: 1 }, "journey");
     tl.to(marsPivot.current!.rotation, { y: Math.PI * 0.8, duration: 1 }, "journey");
     tl.to(jupiterPivot.current!.rotation, { y: Math.PI * 0.1, duration: 1 }, "journey");

    return () => {
        // Cleanup GSAP
        tl.kill();
        ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [camera]);

  // Update LookAt every frame
  useFrame(() => {
    camera.lookAt(cameraTarget.current);
  });

  return (
    <>
      <StarField />
      <Sun />
      
      {/* Earth */}
      <Planet 
        config={PLANET_DATA[0]} 
        pivotRef={earthPivot}
      />

      {/* Mars */}
      <Planet 
        config={PLANET_DATA[1]} 
        pivotRef={marsPivot}
      />

      {/* Jupiter */}
      <Planet 
        config={PLANET_DATA[2]} 
        pivotRef={jupiterPivot}
      />
    </>
  );
};

export default Scene;
