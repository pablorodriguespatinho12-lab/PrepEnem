'use client';
import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathTextProps {
  text: string;
  className?: string;
}

// Parse text with LaTeX delimiters and render math
export default function MathText({ text, className = '' }: MathTextProps) {
  const rendered = useMemo(() => {
    if (!text) return '';

    // Replace display math $$...$$ first, then inline $...$
    let result = text;

    // Handle display math: $$...$$
    result = result.replace(/\$\$([^$]+?)\$\$/g, (_match, latex) => {
      try {
        return katex.renderToString(latex.trim(), { displayMode: true, throwOnError: false, trust: true });
      } catch {
        return `<span class="text-red-500">${latex}</span>`;
      }
    });

    // Handle inline math: $...$  (but not $$)
    result = result.replace(/(?<!\$)\$(?!\$)([^$\n]+?)\$/g, (_match, latex) => {
      try {
        return katex.renderToString(latex.trim(), { displayMode: false, throwOnError: false, trust: true });
      } catch {
        return `<span class="text-red-500">${latex}</span>`;
      }
    });

    // Handle \( ... \) inline math
    result = result.replace(/\\\((.+?)\\\)/g, (_match, latex) => {
      try {
        return katex.renderToString(latex.trim(), { displayMode: false, throwOnError: false, trust: true });
      } catch {
        return `<span class="text-red-500">${latex}</span>`;
      }
    });

    // Handle \[ ... \] display math
    result = result.replace(/\\\[(.+?)\\\]/gs, (_match, latex) => {
      try {
        return katex.renderToString(latex.trim(), { displayMode: true, throwOnError: false, trust: true });
      } catch {
        return `<span class="text-red-500">${latex}</span>`;
      }
    });

    // Convert markdown-style bold **...** to <strong>
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Convert markdown headers ### to styled divs
    result = result.replace(/^### (.+)$/gm, '<div class="text-base font-bold mt-4 mb-2">$1</div>');
    result = result.replace(/^## (.+)$/gm, '<div class="text-lg font-bold mt-4 mb-2">$1</div>');
    // Convert bullet points
    result = result.replace(/^[\-\*] (.+)$/gm, '<div class="ml-4 flex gap-2"><span>•</span><span>$1</span></div>');
    // Convert newlines to <br>
    result = result.replace(/\n/g, '<br/>');

    return result;
  }, [text]);

  return (
    <div
      className={`math-text prose prose-sm dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}
