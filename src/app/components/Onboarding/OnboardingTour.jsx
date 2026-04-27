"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOnboarding } from "./OnboardingContext";
import { ONBOARDING_PHASE } from "./steps";
import TourTooltip from "./TourTooltip";
import WelcomeModal from "./WelcomeModal";
import CompletionModal from "./CompletionModal";

const SPOTLIGHT_PADDING = 8;
const VIEWPORT_GUTTER = 16;
const TOOLTIP_GAP = 14;
const TOOLTIP_WIDTH = 320;
const TOOLTIP_HEIGHT_ESTIMATE = 200;
const SIDEBAR_OPEN_EVENT = "onboarding:open-sidebar";
const MAX_TARGET_WAIT_MS = 1500;
const TARGET_POLL_INTERVAL_MS = 100;

const isClient = () => typeof window !== "undefined";

const getMobileViewport = () => {
  if (!isClient()) return false;
  return window.matchMedia("(max-width: 1023px)").matches;
};

const placeTooltip = (rect, placement, viewport) => {
  const { innerWidth: vw, innerHeight: vh } = viewport;
  const isMobile = vw < 1024;

  if (isMobile) {
    const left = Math.max(
      VIEWPORT_GUTTER,
      Math.min(vw - TOOLTIP_WIDTH - VIEWPORT_GUTTER, (vw - TOOLTIP_WIDTH) / 2)
    );
    const top =
      rect.bottom + TOOLTIP_HEIGHT_ESTIMATE + TOOLTIP_GAP < vh
        ? rect.bottom + TOOLTIP_GAP
        : Math.max(VIEWPORT_GUTTER, rect.top - TOOLTIP_HEIGHT_ESTIMATE - TOOLTIP_GAP);
    return { top, left };
  }

  let top = 0;
  let left = 0;

  switch (placement) {
    case "top":
      top = rect.top - TOOLTIP_HEIGHT_ESTIMATE - TOOLTIP_GAP;
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      break;
    case "right":
      top = rect.top + rect.height / 2 - TOOLTIP_HEIGHT_ESTIMATE / 2;
      left = rect.right + TOOLTIP_GAP;
      break;
    case "left":
      top = rect.top + rect.height / 2 - TOOLTIP_HEIGHT_ESTIMATE / 2;
      left = rect.left - TOOLTIP_WIDTH - TOOLTIP_GAP;
      break;
    case "bottom-end":
      top = rect.bottom + TOOLTIP_GAP;
      left = rect.right - TOOLTIP_WIDTH;
      break;
    case "bottom":
    default:
      top = rect.bottom + TOOLTIP_GAP;
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      break;
  }

  if (top + TOOLTIP_HEIGHT_ESTIMATE + VIEWPORT_GUTTER > vh) {
    top = Math.max(VIEWPORT_GUTTER, rect.top - TOOLTIP_HEIGHT_ESTIMATE - TOOLTIP_GAP);
  }
  if (top < VIEWPORT_GUTTER) {
    top = VIEWPORT_GUTTER;
  }
  if (left + TOOLTIP_WIDTH + VIEWPORT_GUTTER > vw) {
    left = vw - TOOLTIP_WIDTH - VIEWPORT_GUTTER;
  }
  if (left < VIEWPORT_GUTTER) {
    left = VIEWPORT_GUTTER;
  }

  return { top, left };
};

const OnboardingTour = () => {
  const {
    phase,
    stepIndex,
    stepCount,
    currentStep,
    profile,
    next,
    back,
    skip,
    finish,
    start,
  } = useOnboarding();

  const [mounted, setMounted] = useState(false);
  const [targetRect, setTargetRect] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const skipScheduled = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const measureTarget = useCallback(() => {
    if (!currentStep || !isClient()) return null;
    const el = document.querySelector(currentStep.target);
    if (!el) return null;
    return el.getBoundingClientRect();
  }, [currentStep]);

  useEffect(() => {
    if (phase !== ONBOARDING_PHASE.TOUR || !currentStep) return undefined;

    skipScheduled.current = false;

    if (getMobileViewport() && currentStep.id.startsWith("nav-")) {
      window.dispatchEvent(new CustomEvent(SIDEBAR_OPEN_EVENT));
    }
    if (getMobileViewport() && (currentStep.id === "settings" || currentStep.id === "profile")) {
      window.dispatchEvent(new CustomEvent(SIDEBAR_OPEN_EVENT));
    }

    const updatePosition = () => {
      const rect = measureTarget();
      if (!rect) return false;
      setTargetRect(rect);
      const pos = placeTooltip(rect, currentStep.placement, window);
      setTooltipPos(pos);
      return true;
    };

    if (updatePosition()) {
      const target = document.querySelector(currentStep.target);
      target?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    } else {
      const startedAt = Date.now();
      const interval = setInterval(() => {
        if (updatePosition()) {
          clearInterval(interval);
        } else if (Date.now() - startedAt > MAX_TARGET_WAIT_MS) {
          clearInterval(interval);
          if (!skipScheduled.current) {
            skipScheduled.current = true;
            next();
          }
        }
      }, TARGET_POLL_INTERVAL_MS);
      return () => clearInterval(interval);
    }

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [phase, currentStep, measureTarget, next]);

  useLayoutEffect(() => {
    if (phase === ONBOARDING_PHASE.IDLE) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  if (!mounted) return null;

  if (phase === ONBOARDING_PHASE.WELCOME) {
    return createPortal(
      <WelcomeModal
        firstName={profile?.first_name}
        onStart={start}
        onSkip={skip}
        stepCount={stepCount}
      />,
      document.body
    );
  }

  if (phase === ONBOARDING_PHASE.COMPLETION) {
    return createPortal(<CompletionModal onClose={finish} />, document.body);
  }

  if (phase !== ONBOARDING_PHASE.TOUR || !currentStep || !targetRect) {
    return null;
  }

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === stepCount - 1;

  const spotlightStyle = {
    top: targetRect.top - SPOTLIGHT_PADDING,
    left: targetRect.left - SPOTLIGHT_PADDING,
    width: targetRect.width + SPOTLIGHT_PADDING * 2,
    height: targetRect.height + SPOTLIGHT_PADDING * 2,
  };

  return createPortal(
    <div className="fixed inset-0 z-[100]" aria-hidden={false}>
      <div
        className="absolute rounded-xl pointer-events-none transition-all duration-300 ease-out"
        style={{
          ...spotlightStyle,
          boxShadow:
            "0 0 0 9999px rgba(13, 13, 18, 0.62), 0 0 0 2px rgba(62, 191, 15, 0.85), 0 0 32px rgba(62, 191, 15, 0.55)",
        }}
      />
      <div
        className="absolute transition-all duration-300 ease-out"
        style={{ top: tooltipPos.top, left: tooltipPos.left, width: TOOLTIP_WIDTH }}
      >
        <TourTooltip
          step={currentStep}
          stepIndex={stepIndex}
          stepCount={stepCount}
          onNext={isLast ? finish : next}
          onBack={back}
          onSkip={skip}
          isFirst={isFirst}
          isLast={isLast}
        />
      </div>
    </div>,
    document.body
  );
};

export default OnboardingTour;
