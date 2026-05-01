"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useApi } from "@/services/axiosConfig";
import { useAuth } from "@/context/AuthContext";
import {
  ONBOARDING_PHASE,
  ONBOARDING_STATUS,
  ONBOARDING_STORAGE_KEY,
  TOUR_STEPS,
} from "./steps";

const OnboardingContext = createContext(null);

const readLocalStatus = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.status || null;
  } catch {
    return null;
  }
};

const writeLocalStatus = (status, completedSteps = []) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      JSON.stringify({ status, completed_steps: completedSteps })
    );
  } catch {
    // localStorage may be unavailable (private mode); ignore.
  }
};

export const OnboardingProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { axiosInstance } = useApi();

  const [status, setStatus] = useState(null);
  const [phase, setPhase] = useState(ONBOARDING_PHASE.IDLE);
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const hydrationRef = useRef(false);

  const persistStatus = useCallback(
    async (nextStatus, completedStepId) => {
      const completedSteps = completedStepId ? [completedStepId] : [];
      writeLocalStatus(nextStatus, completedSteps);
      try {
        await axiosInstance.patch(
          "/users/me/onboarding/",
          {
            status: nextStatus,
            ...(completedStepId ? { completed_steps: [completedStepId] } : {}),
          },
          { showLoader: false }
        );
      } catch {
        // Backend may not yet expose the endpoint; localStorage keeps the user
        // experience consistent on this device until the API is live.
      }
    },
    [axiosInstance]
  );

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setHydrated(false);
      hydrationRef.current = false;
      return;
    }
    if (hydrationRef.current) return;
    hydrationRef.current = true;

    const fetchStatus = async () => {
      let backendStatus = null;
      let resolvedProfile = null;

      try {
        const { data } = await axiosInstance.get("/users/me/", {
          showLoader: false,
        });
        resolvedProfile = data?.user || null;
        backendStatus =
          data?.user?.onboarding_status ||
          data?.onboarding?.status ||
          null;
      } catch {
        // Network or backend error — treat as unknown; do NOT fire the tour.
      }

      const localStatus = readLocalStatus();

      // First-time-only gating:
      // The tour fires only when the backend explicitly returns "pending"
      // (default for newly-created accounts; backfill sets all existing
      // users to "completed"). Any other state — missing field, network
      // failure, unknown status — defaults to NOT firing. localStorage can
      // only suppress the tour (skipped/completed), never trigger it.
      const localSuppresses =
        localStatus === ONBOARDING_STATUS.SKIPPED ||
        localStatus === ONBOARDING_STATUS.COMPLETED;

      let finalStatus;
      if (localSuppresses) {
        finalStatus = localStatus;
      } else if (backendStatus === ONBOARDING_STATUS.PENDING) {
        finalStatus = ONBOARDING_STATUS.PENDING;
      } else if (backendStatus === ONBOARDING_STATUS.IN_PROGRESS) {
        finalStatus = ONBOARDING_STATUS.IN_PROGRESS;
      } else {
        finalStatus = ONBOARDING_STATUS.COMPLETED;
      }

      // Explicit override: ?startTour=1 forces the welcome modal regardless
      // of stored state. Used for local QA before the backend ships and for
      // support staff replaying the tour with a customer over a screen share.
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (params.get("startTour") === "1") {
          finalStatus = ONBOARDING_STATUS.PENDING;
        }
      }

      setProfile(resolvedProfile);
      setStatus(finalStatus);
      setHydrated(true);

      if (finalStatus === ONBOARDING_STATUS.PENDING) {
        setPhase(ONBOARDING_PHASE.WELCOME);
      } else if (finalStatus === ONBOARDING_STATUS.IN_PROGRESS) {
        setPhase(ONBOARDING_PHASE.TOUR);
        setStepIndex(0);
      }
    };

    fetchStatus();
  }, [isAuthenticated, user, axiosInstance]);

  const start = useCallback(() => {
    setStepIndex(0);
    setPhase(ONBOARDING_PHASE.TOUR);
    setStatus(ONBOARDING_STATUS.IN_PROGRESS);
    persistStatus(ONBOARDING_STATUS.IN_PROGRESS);
  }, [persistStatus]);

  const next = useCallback(() => {
    setStepIndex((current) => {
      const lastIndex = TOUR_STEPS.length - 1;
      if (current >= lastIndex) {
        setPhase(ONBOARDING_PHASE.COMPLETION);
        return current;
      }
      return current + 1;
    });
  }, []);

  const back = useCallback(() => {
    setStepIndex((current) => Math.max(0, current - 1));
  }, []);

  const skip = useCallback(() => {
    setPhase(ONBOARDING_PHASE.IDLE);
    setStatus(ONBOARDING_STATUS.SKIPPED);
    persistStatus(ONBOARDING_STATUS.SKIPPED);
  }, [persistStatus]);

  const finish = useCallback(() => {
    setPhase(ONBOARDING_PHASE.IDLE);
    setStatus(ONBOARDING_STATUS.COMPLETED);
    persistStatus(ONBOARDING_STATUS.COMPLETED);
  }, [persistStatus]);

  const replay = useCallback(() => {
    setStepIndex(0);
    setPhase(ONBOARDING_PHASE.TOUR);
    setStatus(ONBOARDING_STATUS.IN_PROGRESS);
    persistStatus(ONBOARDING_STATUS.IN_PROGRESS);
  }, [persistStatus]);

  const jumpToStep = useCallback((index) => {
    setStepIndex(() => Math.max(0, Math.min(TOUR_STEPS.length - 1, index)));
  }, []);

  const value = useMemo(
    () => ({
      status,
      phase,
      stepIndex,
      stepCount: TOUR_STEPS.length,
      currentStep: TOUR_STEPS[stepIndex] || null,
      profile,
      hydrated,
      start,
      next,
      back,
      skip,
      finish,
      replay,
      jumpToStep,
    }),
    [
      status,
      phase,
      stepIndex,
      profile,
      hydrated,
      start,
      next,
      back,
      skip,
      finish,
      replay,
      jumpToStep,
    ]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    return {
      status: null,
      phase: ONBOARDING_PHASE.IDLE,
      stepIndex: 0,
      stepCount: 0,
      currentStep: null,
      profile: null,
      hydrated: false,
      start: () => {},
      next: () => {},
      back: () => {},
      skip: () => {},
      finish: () => {},
      replay: () => {},
      jumpToStep: () => {},
    };
  }
  return ctx;
};
