'use client';

import { markDashboardTutorialSeen } from '@/actions/tutorial/markDashboardTutorialSeen';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const steps = [
  {
    target: 'organizations',
    placement: 'bottom',
  },
  {
    target: 'families',
    placement: 'top',
  },
  {
    target: 'animals',
    placement: 'top',
  },
  {
    target: 'publish',
    placement: 'top',
  },
  {
    target: 'notifications',
    placement: 'top',
  },
  {
    target: 'transactions',
    placement: 'bottom',
  },
  {
    target: 'settings',
    placement: 'bottom',
  },
] as const;

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  radius: number;
};

export const DashboardTutorial = () => {
  const t = useTranslations();

  const [isMounted, setIsMounted] = useState(false);
  const [isFrameLocked, setIsFrameLocked] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);

  const step = steps[stepIndex];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsFrameLocked(true);

    const timeoutId = window.setTimeout(() => {
      setIsFrameLocked(false);
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [stepIndex]);

  useEffect(() => {
    const target = document.querySelector<HTMLElement>(`[data-tutorial-target="${step.target}"]`);

    if (!target) {
      setSpotlightRect(null);
      return;
    }

    target.classList.add('tutorial-target-active');

    const rect = target.getBoundingClientRect();
    const padding = 12;

    const width = rect.width + padding * 2;
    const height = rect.height + padding * 2;

    setSpotlightRect({
      top: rect.top - padding - 3,
      left: rect.left - padding,
      width,
      height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
      radius: Math.max(width, height) / 2,
    });

    return () => {
      target.classList.remove('tutorial-target-active');
    };
  }, [step.target]);

  const handleNext = async () => {
    if (isFrameLocked) {
      return;
    }

    const isLastStep = stepIndex === steps.length - 1;

    if (!isLastStep) {
      setStepIndex((current) => current + 1);
      return;
    }

    setIsVisible(false);
    await markDashboardTutorialSeen();
  };

  if (!isMounted || !isVisible) {
    return null;
  }

  return createPortal(
    <div
      className="tutorial-overlay"
      onClick={handleNext}
      style={
        spotlightRect
          ? ({
              '--spotlight-x': `${spotlightRect.centerX}px`,
              '--spotlight-y': `${spotlightRect.centerY}px`,
              '--spotlight-inner': `${spotlightRect.radius}px`,
              '--spotlight-mid': `${spotlightRect.radius + 18}px`,
              '--spotlight-outer': `${spotlightRect.radius + 70}px`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {spotlightRect && (
        <div
          className="tutorial-ring"
          style={{
            top: spotlightRect.top,
            left: spotlightRect.left,
            width: spotlightRect.width,
            height: spotlightRect.height,
          }}
        />
      )}

      {spotlightRect && (
        <div
          className={`tutorial-text tutorial-text-${step.placement}`}
          style={{
            top: step.placement === 'top' ? '25%' : '75%',
          }}
        >
          {t(`tutorial.${step.target}`)}
        </div>
      )}
    </div>,
    document.body,
  );
};
