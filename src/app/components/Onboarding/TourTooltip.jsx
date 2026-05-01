"use client";

import React from "react";

const TourTooltip = ({
  step,
  stepIndex,
  stepCount,
  onNext,
  onBack,
  onSkip,
  isFirst,
  isLast,
}) => {
  if (!step) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-labelledby="onboarding-tour-title"
      className="w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-neutral-900 shadow-[0_20px_50px_-12px_rgba(13,13,18,0.35)] border border-gray-100 dark:border-neutral-800 overflow-hidden"
    >
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#3EBF0F]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3EBF0F]" aria-hidden="true" />
          NativeTalk Tour
        </span>
        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 tabular-nums">
          {stepIndex + 1} of {stepCount}
        </span>
      </div>

      <div className="px-5 pb-4">
        <h3
          id="onboarding-tour-title"
          className="text-[16px] leading-snug font-semibold text-gray-900 dark:text-gray-50"
        >
          {step.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {step.body}
        </p>
      </div>

      <div className="h-1 w-full bg-gray-100 dark:bg-neutral-800">
        <div
          className="h-full bg-[#3EBF0F] transition-all duration-300 ease-out"
          style={{ width: `${((stepIndex + 1) / stepCount) * 100}%` }}
        />
      </div>

      <div className="px-5 py-3 flex items-center justify-between gap-2 bg-gray-50 dark:bg-neutral-950">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          Skip tour
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            disabled={isFirst}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-4 py-1.5 text-xs font-semibold rounded-md bg-[#3EBF0F] text-white shadow-sm hover:bg-[#34a60e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3EBF0F]/40"
          >
            {isLast ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourTooltip;
