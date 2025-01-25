import React, { useId, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  
  const [init, setInit] = useState(false);
  
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      // Container loaded
    }
  };

  const generatedId = useId();

  return (
    <div className={`absolute inset-0 -z-10 transition-opacity duration-1000 ${className || ''}`}>
      {init && (
        <Particles
          id={id || generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: background || "#000000",
              },
            },
            fullScreen: {
              enable: false,
              zIndex: -1,
            },
            fpsLimit: 120,
            particles: {
              color: {
                value: particleColor || "#ffffff",
              },
              move: {
                enable: true,
                speed: speed || 0.5,
                direction: "none",
                random: true,
                straight: false,
                outModes: {
                  default: "out",
                },
              },
              number: {
                density: {
                  enable: true,
                  width: 400,
                  height: 400,
                },
                value: particleDensity || 80,
              },
              opacity: {
                value: {
                  min: 0.1,
                  max: 0.3,
                },
                animation: {
                  enable: true,
                  speed: 1,
                  sync: false,
                },
              },
              size: {
                value: {
                  min: minSize || 1,
                  max: maxSize || 2,
                },
              },
            },
            detectRetina: true,
          }}
        />
      )}
    </div>
  );
};