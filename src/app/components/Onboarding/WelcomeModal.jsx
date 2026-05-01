"use client";

import React from "react";
import Image from "next/image";

const WelcomeModal = ({ firstName, onStart, onSkip, stepCount }) => {
  const greetingName = firstName ? firstName : "there";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-[rgba(13,13,18,0.6)] backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-welcome-title"
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 shadow-[0_30px_80px_-12px_rgba(13,13,18,0.45)] border border-gray-100 dark:border-neutral-800 overflow-hidden"
      >
        <div className="px-7 pt-7 pb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3EBF0F]/10 flex items-center justify-center">
            <Image
              src="/assets/nativetalk-logo.svg"
              alt="NativeTalk"
              width={28}
              height={28}
            />
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#3EBF0F]">
              Welcome
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              A quick tour of NativeTalk
            </p>
          </div>
        </div>

        <div className="px-7 pt-3 pb-6">
          <h2
            id="onboarding-welcome-title"
            className="text-2xl font-semibold leading-tight text-gray-900 dark:text-gray-50"
          >
            Hi {greetingName}, welcome to NativeTalk.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            We&apos;ll walk you through the platform in about a minute — your
            metrics, your inbox, your team, and everything in between. You can
            skip ahead any time.
          </p>

          <div className="mt-5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3EBF0F]" />
              {stepCount} quick stops
            </span>
            <span aria-hidden="true">•</span>
            <span>~60 seconds</span>
            <span aria-hidden="true">•</span>
            <span>Skippable any time</span>
          </div>
        </div>

        <div className="px-7 py-4 bg-gray-50 dark:bg-neutral-950 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={onStart}
            autoFocus
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#3EBF0F] text-white shadow-sm hover:bg-[#34a60e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3EBF0F]/40"
          >
            Show me around
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
