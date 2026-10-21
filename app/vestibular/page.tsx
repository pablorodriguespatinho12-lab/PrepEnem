'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GraduationCap, BookOpen, ClipboardList, AlertCircle, BarChart3, ArrowRight, Construction } from 'lucide-react';
import { abrirComTeclado } from '@/lib/teclado';

const features = [
  {
    label: 'Treino Vestibular',
    description: 'Questões de bancas como FUVEST, UNICAMP, UERJ, UNESP e mais',
    icon: BookOpen,
    href: '/treino?mode=vestibular',
    available: false,
  },
  {
    label: 'Simulado Vestibular',
    description: 'Simule provas completas de vestibulares específicos',
    icon: ClipboardList,
    href: '/simulado?mode=vestibular',
    available: false,
  },
  {
    label: 'Caderno de Erros',
    description: 'Erros específicos de questões de vestibular',
    icon: AlertCircle,
    href: '/caderno-erros?mode=vestibular',
    available: false,
  },
  {
    label: 'Progresso Vestibular',
    description: 'Acompanhe seu desempenho em questões de outras bancas',
    icon: BarChart3,
    href: '/progresso?mode=vestibular',
    available: false,
  },
];

export default function VestibularPage() {
  const router = useRouter();

  return (
    <div className="px-4 py-6 md:px-8 md:py-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-7 h-7 text-primary-text" />
          <h1 className="font-display type-headline font-bold">Modo Vestibular</h1>
        </div>
        <p className="type-meta text-muted-foreground mb-8">
          Treine com questões de vestibulares como FUVEST, UNICAMP, UERJ, UNESP e outras bancas
        </p>

        {/* Coming soon banner */}
        <div className="bg-primary/5 border border-primary/10 rounded-[var(--radius-surface)] p-6 mb-8 text-center">
          <Construction className="w-10 h-10 text-primary-text mx-auto mb-3" />
          <h2 className="font-display type-lead font-bold mb-2">Em Construção</h2>
          <p className="type-meta text-muted-foreground max-w-md mx-auto">
            O modo Vestibular está sendo preparado! Em breve você poderá importar PDFs de provas de outras bancas
            e treinar com questões específicas de cada vestibular.
          </p>
        </div>

        {/* Feature cards (preview) */}
        <div className="space-y-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`surface-1 rounded-[var(--radius-surface)] p-5 t-lift ${
                  feature.available ? 'hover:shadow-elev-2 hover:-translate-y-px cursor-pointer' : 'opacity-80'
                }`}
                role={feature.available ? 'button' : undefined}
                tabIndex={feature.available ? 0 : undefined}
                onKeyDown={(e) => feature.available && abrirComTeclado(e, () => router.push(feature.href))}
                onClick={() => feature.available && router.push(feature.href)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[var(--radius-control)] flex items-center justify-center bg-muted text-muted-foreground flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold type-body">{feature.label}</h3>
                      {!feature.available && (
                        <span className="type-caption px-2 py-0.5 rounded-[var(--radius-data)] bg-muted text-muted-foreground">Em breve</span>
                      )}
                    </div>
                    <p className="type-meta text-muted-foreground">{feature.description}</p>
                  </div>
                  {feature.available && <ArrowRight className="w-5 h-5 text-muted-foreground" />}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
