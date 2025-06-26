"use client";

import React, { useEffect, useState } from 'react';
import { Box, Fade, Typography } from '@mui/material';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number; // Duración en milisegundos
}

export default function SplashScreen({ onComplete, duration = 8000 }: SplashScreenProps) {
  const [logoVisible, setLogoVisible] = useState(false);
  const [companyNameVisible, setCompanyNameVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);

  useEffect(() => {
    // Secuencia de animaciones
    const timer1 = setTimeout(() => {
      setLogoVisible(true);
    }, 300);

    const timer2 = setTimeout(() => {
      setCompanyNameVisible(true);
    }, 1200);

    const timer3 = setTimeout(() => {
      setTaglineVisible(true);
    }, 2000);

    const timer4 = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete, duration]);

  return (      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}
      >
      {/* Logo con animación */}
      <Fade in={logoVisible} timeout={1000}>
        <Box
          sx={{
            mb: 3,
            animation: logoVisible 
              ? 'logoFloat 3s ease-in-out infinite' 
              : 'none',
            '@keyframes logoFloat': {
              '0%, 100%': {
                transform: 'translateY(0px) scale(1)',
              },
              '25%': {
                transform: 'translateY(-10px) scale(1.05)',
              },
              '50%': {
                transform: 'translateY(0px) scale(1.1)',
              },
              '75%': {
                transform: 'translateY(-5px) scale(1.05)',
              },
            },
          }}
        >
          <Image
            src="/logo.svg"
            alt="Aparicio y García"
            width={140}
            height={140}
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
            }}
          />
        </Box>
      </Fade>

      {/* Nombre de la empresa */}
      <Fade in={companyNameVisible} timeout={800}>
        <Box textAlign="center" mb={2}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#1976d2',
              mb: 1,
              animation: companyNameVisible 
                ? 'textGlow 2s ease-in-out infinite alternate' 
                : 'none',
              '@keyframes textGlow': {
                '0%': {
                  color: '#1976d2',
                },
                '100%': {
                  color: '#2196f3',
                },
              },
            }}
          >
            Aparicio y García
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              color: '#666666',
            }}
          >
            Sociedad Comercial e Industrial Ltda.
          </Typography>
        </Box>
      </Fade>

      {/* Tagline */}
      <Fade in={taglineVisible} timeout={600}>
        <Typography
          variant="body1"
          sx={{
            color: '#888888',
            textAlign: 'center',
            fontStyle: 'italic',
            animation: taglineVisible 
              ? 'fadeInScale 1s ease-out' 
              : 'none',
            '@keyframes fadeInScale': {
              '0%': {
                opacity: 0,
                transform: 'scale(0.8)',
              },
              '100%': {
                opacity: 1,
                transform: 'scale(1)',
              },
            },
          }}
        >
          Sistema de Gestión de Recepción de Paddy
        </Typography>
      </Fade>

      {/* Puntos de carga animados */}
      <Fade in={taglineVisible} timeout={800}>
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            gap: 1,
          }}
        >
          {[0, 1, 2].map((index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                animation: `loadingDots 1.5s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
                '@keyframes loadingDots': {
                  '0%, 80%, 100%': {
                    transform: 'scale(0.8)',
                    opacity: 0.5,
                  },
                  '40%': {
                    transform: 'scale(1.2)',
                    opacity: 1,
                  },
                },
              }}
            />
          ))}
        </Box>
      </Fade>

      {/* Información adicional en la parte inferior */}
      <Fade in={taglineVisible} timeout={1000}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#999999',
              fontSize: '0.75rem',
            }}
          >
            Panamericana Sur km 345, Parral
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
}
