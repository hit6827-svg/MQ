import React, { memo, useEffect, useRef } from 'react';

interface MathJaxRendererProps {
  math: string;
  className?: string;
  inline?: boolean;
  autoWrap?: boolean;
}

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements?: (HTMLElement | null)[]) => Promise<void>;
      typesetClear?: (elements?: (HTMLElement | null)[]) => void;
      startup?: {
        promise?: Promise<void>;
      };
    };
  }
}

/**
 * Prepares LaTeX string ensuring MathJax delimiters ($ or $$) are present.
 */
function prepareMathString(raw: string, inline: boolean, autoWrap: boolean): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  // Check if delimiters already exist
  const hasDelimiters =
    trimmed.includes('$') ||
    trimmed.includes('\\(') ||
    trimmed.includes('\\[') ||
    trimmed.startsWith('\\begin{');

  if (hasDelimiters || !autoWrap) {
    return trimmed;
  }

  // Auto-wrap bare LaTeX commands or expressions
  if (inline) {
    return `$${trimmed}$`;
  }
  return `$$${trimmed}$$`;
}

const MathJaxRendererBase: React.FC<MathJaxRendererProps> = ({
  math,
  className = '',
  inline = false,
  autoWrap = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isCancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    const container = containerRef.current;
    if (!container) return;

    const formattedMath = prepareMathString(math, inline, autoWrap);

    // Set raw text into the container so MathJax can parse fresh delimiters
    container.textContent = formattedMath;

    const renderMath = () => {
      if (isCancelled || !container) return;

      if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        if (typeof window.MathJax.typesetClear === 'function') {
          window.MathJax.typesetClear([container]);
        }

        window.MathJax.typesetPromise([container]).catch((err: unknown) => {
          if (!isCancelled) {
            console.warn('MathJax typesetting error:', err);
          }
        });
      } else {
        retryTimer = setTimeout(renderMath, 100);
      }
    };

    renderMath();

    return () => {
      isCancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [math, inline, autoWrap]);

  if (inline) {
    return (
      <span
        ref={containerRef}
        className={`math-rendered inline-block ${className}`}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`math-rendered overflow-x-auto no-scrollbar max-w-full my-2 text-white/95 leading-relaxed ${className}`}
    />
  );
};

export const MathJaxRenderer = memo(MathJaxRendererBase);
