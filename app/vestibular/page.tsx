'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GraduationCap, BookOpen, ClipboardList, AlertCircle, BarChart3, ArrowRight, Construction } from 'lucide-react';

const features = [
  {
    label: 'Treino Vestibular',
    description: 'Questões de bancas como FUVEST, UNICAMP, UERJ, UNESP e mais',
    icon: BookOpen,
    color: 'bg-blue-500/10 text-blue-600',
    href: '/treino?mode=vestibular',
    available: false,
  },
  {
    label: 'Simulado Vestibular',
    description: 'Simule provas completas de vestibulares específicos',
    icon: ClipboardList,
    color: 'bg-red-500/10 text-red-600',
    href: '/simulado?mode=vestibular',
    available: false,
  },
  {
    label: 'Caderno de Erros',
    description: 'Erros específicos de questões de vestibular',
    icon: AlertCircle,
    color: 'bg-orange-500/10 text-orange-600',
    href: '/caderno-erros?mode=vestibular',
    available: false,
  },
  {
    label: 'Progresso Vestibular',
    description: 'Acompanhe seu desempenho em questões de outras bancas',
    icon: BarChart3,
    color: 'bg-green-500/10 text-green-600',
    href: '/progresso?mode=vestibular',
    available: false,
  },
];

export default function VestibularPage() {
  const router = useRouter();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-7 h-7 text-primary" />
          <h1 className="font-display text-2xl font-bold tracking-tight">Modo Vestibular</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Treine com questões de vestibulares como FUVEST, UNICAMP, UERJ, UNESP e outras bancas
        </p>

        {/* Coming soon banner */}
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 mb-8 text-center">
          <Construction className="w-10 h-10 text-primary mx-auto mb-3" />
          <h2 className="font-display text-lg font-bold mb-2">Em Construção</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
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
                className={`bg-card rounded-xl p-5 border border-border shadow-sm ${
                  feature.available ? 'hover:shadow-md hover:border-primary/30 cursor-pointer' : 'opacity-80'
                } transition`}
                onClick={() => feature.available && router.push(feature.href)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-base">{feature.label}</h3>
                      {!feature.available && (
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">Em breve</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
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
