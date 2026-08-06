'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    /* As cores das variantes do toast vivem em globals.css — o sonner injeta
       o CSS dele no <head> em runtime, depois da nossa folha, então só um
       seletor mais específico vence. Ver "SONNER" lá. */
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-[hsl(var(--surface-1))] group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-elev-2 group-[.toaster]:rounded-[var(--radius-surface)]',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
