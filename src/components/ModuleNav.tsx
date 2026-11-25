import { useEffect, useRef, useState } from "react";
import type { Module } from "../content/types";
import { stepLabel } from "../content/label";
import { useT } from "../lib/i18n";
import Icon from "./Icon";

interface Props {
  modules: Module[];
  currentId: string;
  done: string[];
  open: boolean;
  onSelect: (id: string) => void;
  onReset: () => void;
  onClose: () => void;
}

// Course contents: docked on wide screens, a drawer below xl.
export default function ModuleNav({ modules, currentId, done, open, onSelect, onReset, onClose }: Props) {
  const t = useT();
  const currentRef = useRef<HTMLButtonElement>(null);
  const currentModule = modules.find((m) => m.steps.some((s) => s.id === currentId))?.id;
  // Chapters fold open/closed; the current one is always opened when you reach it.
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(currentModule ? [currentModule] : []));
  useEffect(() => {
    if (currentModule) setOpenIds((s) => (s.has(currentModule) ? s : new Set(s).add(currentModule)));
  }, [currentModule]);
  const toggle = (id: string) =>
    setOpenIds((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  useEffect(() => {
    currentRef.current?.scrollIntoView?.({ block: "nearest" });
  }, [currentId]);

  const total = modules.reduce((n, m) => n + m.steps.length, 0);
  const doneCount = modules.reduce((n, m) => n + m.steps.filter((s) => done.includes(s.id)).length, 0);
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/50 xl:hidden" aria-hidden="true" onClick={onClose} />}
      <nav
        id="module-nav"
        aria-label={t("contents")}
        className={`fixed inset-y-0 start-0 z-40 flex w-80 max-w-[85vw] flex-col bg-white shadow-xl transition-transform duration-200 xl:sticky xl:top-3 xl:bottom-auto xl:z-auto xl:max-h-[calc(100dvh-5.5rem)] xl:max-w-none xl:shrink-0 xl:translate-x-0 xl:self-start xl:rounded-2xl xl:border xl:border-[var(--line)] xl:shadow-none xl:w-auto ${
          open ? "translate-x-0" : "max-xl:invisible max-xl:ltr:-translate-x-full max-xl:rtl:translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <span className="text-sm font-bold text-[var(--ink)]">{t("contents")}</span>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--ink-3)] hover:bg-[var(--brand-50)] xl:hidden" aria-label={t("closeMenu")} onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>

        {/* Overall progress */}
        <div className="mx-3 mb-2 rounded-xl bg-[var(--brand-50)] px-3 py-2">
          <div className="flex items-center justify-between text-[0.7rem] font-semibold text-[var(--brand)]">
            <span>{t("progress")}</span>
            <span dir="ltr">{pct}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-[var(--violet)] transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1 text-[0.68rem] text-[var(--ink-3)]">
            {doneCount} {t("of")} {total} {t("stepsDone")}
          </div>
        </div>

        <ol className="flex-1 overflow-y-auto px-2 pb-2">
          {modules.map((m, mi) => {
            const isOpen = openIds.has(m.id);
            const panelId = `nav-ch-${m.id}`;
            return (
              <li key={m.id} className="border-b border-[var(--line)] last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggle(m.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-start hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
                >
                  <span className="flex-1 text-[0.8rem] font-bold leading-snug text-[var(--ink)]">
                    <span className="text-[var(--ink-3)]">{mi + 1}. </span>
                    {m.title}
                  </span>
                  <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 text-[var(--ink-3)] transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <ol id={panelId} hidden={!isOpen} className="space-y-0.5 pb-2">
                  {m.steps.map((s) => {
                    const isCurrent = s.id === currentId;
                    const isDone = done.includes(s.id);
                    return (
                      <li key={s.id}>
                        <button
                          type="button"
                          ref={isCurrent ? currentRef : undefined}
                          aria-current={isCurrent ? "step" : undefined}
                          onClick={() => onSelect(s.id)}
                          className={`flex min-h-8 w-full items-center gap-2 rounded-lg px-2 py-1 text-start text-[0.78rem] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--brand)] ${
                            isCurrent ? "bg-[var(--brand-50)] font-semibold text-[var(--brand)]" : "text-[var(--ink-2)] hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.6rem] ${
                              isDone
                                ? "border border-[var(--violet)] text-[var(--violet)]"
                                : isCurrent
                                  ? "bg-[var(--brand)] text-white"
                                  : "bg-slate-100 text-[var(--ink-3)]"
                            }`}
                            aria-hidden="true"
                          >
                            {isDone ? <Icon name="check" className="h-3 w-3" /> : stepLabel(s.id)}
                          </span>
                          <span className="flex-1">{s.title}</span>
                          {isDone && <span className="sr-only">({t("completed")})</span>}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </li>
            );
          })}
        </ol>
        <div className="border-t border-[var(--line)] px-4 py-2 text-center">
          <button type="button" onClick={onReset} className="min-h-8 text-xs text-[var(--ink-3)] underline-offset-2 hover:text-[var(--brand)] hover:underline">
            {t("resetProgress")}
          </button>
        </div>
      </nav>
    </>
  );
}
