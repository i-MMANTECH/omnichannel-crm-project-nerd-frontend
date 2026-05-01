"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

const CompletionModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
    <div
      className="absolute inset-0 bg-[rgba(13,13,18,0.6)] backdrop-blur-sm"
      aria-hidden="true"
    />
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-completion-title"
      className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 shadow-[0_30px_80px_-12px_rgba(13,13,18,0.45)] border border-gray-100 dark:border-neutral-800 overflow-hidden"
    >
      <div className="px-7 pt-7 pb-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#3EBF0F]/10 flex items-center justify-center text-[#3EBF0F]">
          <CheckCircle2 size={22} strokeWidth={2.2} />
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#3EBF0F]">
            All set
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You&apos;re ready to go
          </p>
        </div>
      </div>

      <div className="px-7 pb-6">
        <h2
          id="onboarding-completion-title"
          className="text-2xl font-semibold leading-tight text-gray-900 dark:text-gray-50"
        >
          You&apos;re ready to roll.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          That&apos;s the quick lay of the land. Replay this tour any time from
          your profile menu, and reach out to support if you need a hand.
        </p>
      </div>

      <div className="px-7 py-4 bg-gray-50 dark:bg-neutral-950 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#3EBF0F] text-white shadow-sm hover:bg-[#34a60e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3EBF0F]/40"
        >
          Start using NativeTalk
        </button>
      </div>
    </div>
  </div>
);

export default CompletionModal;
