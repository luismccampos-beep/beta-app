'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, MapPin, Star, Lock, User, Sparkles, Eye, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Input } from './input';
import { Label } from './label';
import { RippleButton } from './ripple-button';
import { Progress } from './progress';
import { GlobeIllustration, MapIllustration } from './FeatureIllustrations';

/* ── Types ── */
type SandboxDayActivity = { period: string; emoji: string; items: string[] };

type SandboxResult = {
  ok: true;
  destination: {
    nome: string;
    pais: string;
    paisCode: string;
    continente: string | null;
    tipo: string | null;
    descricao: string | null;
    imagemUrl: string | null;
    slug: string;
    iata: string | null;
  };
  day1: {
    title: string;
    activities: SandboxDayActivity[];
    meal: string;
    estimatedDailyCost: number;
    estimatedAccommodation: number;
  };
  stats: {
    totalHotels: number;
    cheapestHotel: number | null;
  };
  totalDays: number;
};

type SandboxState = 'form' | 'loading' | 'result' | 'error';

/* ── Budget chips ── */
const BUDGET_CHIPS = [
  { id: 'economico', label: 'Económico', range: '€', min: 500, max: 2000 },
  { id: 'conforto', label: 'Conforto', range: '€€', min: 2000, max: 5000 },
  { id: 'premium', label: 'Premium', range: '€€€', min: 5000, max: 15000 },
  { id: 'luxo', label: 'Luxo', range: '€€€€', min: 15000, max: 50000 },
];

/* ── Loading messages ── */
const LOADING_MESSAGES = [
  'A analisar o destino...',
  'A pesquisar hotéis disponíveis...',
  'A calcular orçamento estimado...',
  'A gerar itinerário personalizado...',
  'Quase lá! A refinar detalhes...',
];

/* ── Props ── */
interface SandboxPreviewProps {
  /** Called when user clicks register after seeing preview */
  onRegister: () => void;
  /** Current locale for API requests */
  locale?: string;
  /** Custom translations */
  texts?: {
    title?: string;
    subtitle?: string;
    destinationLabel?: string;
    destinationPlaceholder?: string;
    checkInLabel?: string;
    checkOutLabel?: string;
    budgetLabel?: string;
    generateLabel?: string;
    generatingLabel?: string;
    errorMessage?: string;
    errorTitle?: string;
    tryAgainLabel?: string;
    newSearchLabel?: string;
    day1Title?: string;
    estimatedCost?: string;
    accommodation?: string;
    mealsActivities?: string;
    totalDay?: string;
    mealTip?: string;
    totalHotels?: string;
    cheapestHotel?: string;
    lockedTitle?: string;
    lockedDesc?: string;
    registerCta?: string;
    viewFullCta?: string;
    noAccountNote?: string;
  };
}

export function SandboxPreview({ onRegister, locale = 'pt', texts }: SandboxPreviewProps) {
  const [state, setState] = useState<SandboxState>('form');
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [budget, setBudget] = useState('conforto');
  const [progress, setProgress] = useState(0);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [result, setResult] = useState<SandboxResult | null>(null);
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const t = (key: string) => {
    const map: Record<string, string | undefined> = texts ?? {};
    return map[key as keyof typeof map] || key;
  };

  const handleSubmit = useCallback(async () => {
    if (!destination.trim()) return;
    setState('loading');
    setProgress(0);
    setLoadingMsgIdx(0);
    setError('');

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const chip = BUDGET_CHIPS.find((c) => c.id === budget);
    const budgetVal = chip ? Math.round((chip.min + chip.max) / 2) : 3500;
    const params = new URLSearchParams({
      q: destination.trim(),
      budget: String(budgetVal),
      lang: locale,
    });
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);

    const msgInterval = setInterval(() => {
      setLoadingMsgIdx((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, 2000);

    const startTime = Date.now();
    const MIN_LOADING_MS = 6000;

    try {
      const res = await fetch(`/api/travel/v1/sandbox?${params}`, {
        signal: controller.signal,
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Erro ao gerar pré-visualização');
      }

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed);

      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 3, 92));
      }, 150);

      await new Promise((r) => setTimeout(r, remaining));

      clearInterval(progressInterval);
      clearInterval(msgInterval);
      setProgress(100);
      await new Promise((r) => setTimeout(r, 400));

      setResult(data as SandboxResult);
      setState('result');
    } catch (err: unknown) {
      clearInterval(msgInterval);
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Erro inesperado');
      setState('error');
    }
  }, [destination, checkIn, checkOut, budget, locale]);

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setState('form');
    setResult(null);
    setError('');
    setProgress(0);
  }, []);

  /* ── Form ── */
  if (state === 'form') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="overflow-hidden border-2 border-primary-200/50 dark:border-gray-700 shadow-2xl">
          <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 p-8 sm:p-12">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-bold text-white/80 uppercase tracking-widest">
                AI Preview
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black mb-2 tracking-tighter bg-gradient-to-r from-green-400 to-orange-400 bg-clip-text text-transparent">
              {t('title') || 'Experimente grátis'}
            </h3>
            <p className="text-lg font-medium max-w-xl bg-gradient-to-r from-green-400/90 to-orange-400/90 bg-clip-text text-transparent">
              {t('subtitle') || 'Veja um roteiro de IA para o seu destino em segundos — sem registo.'}
            </p>
          </div>

          <CardContent className="p-8 sm:p-12 bg-white dark:bg-gray-900">
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {/* Destination */}
              <div className="sm:col-span-2">
                <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                  {t('destinationLabel') || 'Para onde vamos?'}
                </Label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={t('destinationPlaceholder') || 'Ex: Lisboa, Paris, Tóquio...'}
                    className="pl-12 h-14 text-lg font-medium border-2 border-gray-200 dark:border-gray-700 focus:border-primary dark:focus:border-primary rounded-xl"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                </div>
              </div>

              {/* Check-in */}
              <div>
                <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                  {t('checkInLabel') || 'Check-in'}
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="pl-12 h-14 text-base font-medium border-2 border-gray-200 dark:border-gray-700 focus:border-primary dark:focus:border-primary rounded-xl"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div>
                <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                  {t('checkOutLabel') || 'Check-out'}
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="pl-12 h-14 text-base font-medium border-2 border-gray-200 dark:border-gray-700 focus:border-primary dark:focus:border-primary rounded-xl"
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="sm:col-span-2">
                <Label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">
                  {t('budgetLabel') || 'Orçamento total'}
                </Label>
                <div className="flex gap-3 flex-wrap">
                  {BUDGET_CHIPS.map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setBudget(chip.id)}
                      className={`px-5 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                        budget === chip.id
                          ? 'border-primary bg-primary/10 text-primary dark:border-primary-400 dark:text-primary-300 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                      }`}
                    >
                      <span className="block text-base">{chip.range}</span>
                      <span className="block text-xs font-medium opacity-80">{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <RippleButton
              onClick={handleSubmit}
              variant="brand"
              size="lg"
              className="w-full gap-3 text-xl py-8 h-auto rounded-2xl shadow-glow-primary font-black tracking-tight"
              disabled={!destination.trim()}
            >
              <Sparkles className="w-7 h-7" />
              {t('generateLabel') || '✨ Gerar Pré-visualização'}
            </RippleButton>

            <p className="text-center text-sm text-gray-400 mt-4 font-medium">
              {t('noAccountNote') || 'Sem necessidade de registo • Dados reais • Resultados em segundos'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  /* ── Loading ── */
  if (state === 'loading') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <Card className="border-2 border-primary-200/50 dark:border-gray-700 shadow-2xl p-12">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 mx-auto mb-8"
          >
            <GlobeIllustration className="w-full h-full" />
          </motion.div>

          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            {t('generatingLabel') || 'A preparar a sua viagem...'}
          </h3>

          <AnimatePresence mode="wait">
            <motion.p
              key={loadingMsgIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg text-gray-500 dark:text-gray-400 font-medium mb-8"
            >
              {LOADING_MESSAGES[loadingMsgIdx]}
            </motion.p>
          </AnimatePresence>

          <Progress value={progress} className="h-3 rounded-full bg-gray-200 dark:bg-gray-800" />

          <p className="text-sm text-gray-400 mt-4 font-medium">
            {Math.min(progress, 99)}% concluído
          </p>
        </Card>
      </motion.div>
    );
  }

  /* ── Error ── */
  if (state === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto text-center"
      >
        <Card className="border-2 border-red-200 dark:border-red-900 shadow-2xl p-12">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
            {t('errorTitle') || 'Não encontrei esse destino'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            {error || (t('errorMessage') || 'Tente outro nome de cidade ou destino.')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              {t('tryAgainLabel') || 'Tentar novamente'}
            </Button>
            <RippleButton variant="brand" onClick={handleReset} className="gap-2">
              <Sparkles className="w-4 h-4" />
              {t('newSearchLabel') || 'Nova pesquisa'}
            </RippleButton>
          </div>
        </Card>
      </motion.div>
    );
  }

  /* ── Result ── */
  if (!result) return null;

  const budgetChip = BUDGET_CHIPS.find((c) => c.id === budget);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Destination header */}
      <Card className="overflow-hidden border-2 border-primary-200/50 dark:border-gray-700 shadow-2xl">
        <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-white/70" />
                <span className="text-sm font-bold text-white/70 uppercase tracking-widest">
                  {result.destination.pais} · {result.destination.continente || ''}
                </span>
              </div>
              <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                {result.destination.nome}
              </h3>
              {result.destination.descricao && (
                <p className="text-lg text-white/80 mt-2 max-w-xl font-medium line-clamp-2">
                  {result.destination.descricao}
                </p>
              )}
            </div>
            <Badge className="self-start bg-white/20 text-white border-white/30 text-base px-5 py-2 font-bold">
              {budgetChip?.range || '€€'} {budgetChip?.label || 'Conforto'}
            </Badge>
          </div>
        </div>

        <CardContent className="p-8 sm:p-10 bg-white dark:bg-gray-900">
          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mb-10 pb-8 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <MapIllustration className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  {result.stats.totalHotels}
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {t('totalHotels') || 'Hotéis disponíveis'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 dark:bg-accent/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-accent dark:text-accent-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  {result.stats.cheapestHotel ? `€${result.stats.cheapestHotel}` : '—'}
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {t('cheapestHotel') || 'Hotel mais barato/noite'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  ~€{result.day1.estimatedDailyCost}
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {t('estimatedCost') || 'Custo estimado/dia'}
                </div>
              </div>
            </div>
          </div>

          {/* Day 1 - Full visible */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-lg">
                1
              </div>
              <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {result.day1.title}
              </h4>
            </div>

            <div className="space-y-4 ml-14">
              {result.day1.activities.map((act, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                >
                  <div className="text-2xl">{act.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                      {act.period}
                    </div>
                    <ul className="space-y-1">
                      {act.items.map((item, j) => (
                        <li key={j} className="text-gray-700 dark:text-gray-300 font-medium flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900"
              >
                <div className="text-2xl">🍽️</div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-1">
                    {t('mealTip') || 'Sugestão de refeição'}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{result.day1.meal}</p>
                </div>
              </motion.div>
            </div>

            {/* Daily cost summary */}
            <div className="mt-6 ml-14 p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-200/50 dark:border-primary-800">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-gray-600 dark:text-gray-400">
                  {t('accommodation') || 'Alojamento'}:
                </span>
                <span className="font-black text-gray-900 dark:text-white">
                  ~€{result.day1.estimatedAccommodation}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="font-bold text-gray-600 dark:text-gray-400">
                  {t('mealsActivities') || 'Refeições + Atividades'}:
                </span>
                <span className="font-black text-gray-900 dark:text-white">
                  ~€{Math.max(0, result.day1.estimatedDailyCost - result.day1.estimatedAccommodation)}
                </span>
              </div>
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white">
                  {t('totalDay') || 'Total dia 1'}:
                </span>
                <span className="font-black text-lg text-primary dark:text-primary-400">
                  ~€{result.day1.estimatedDailyCost}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Days 2-5 locked */}
      <Card className="overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 shadow-xl">
        <CardContent className="p-8 sm:p-12 text-center bg-gray-50/50 dark:bg-gray-900/50">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <Lock className="w-7 h-7 text-white" />
          </motion.div>

          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
            {t('lockedTitle') || 'Gostou do Dia 1? Veja o roteiro completo!'}
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8 font-medium">
            {t('lockedDesc') || 'Crie uma conta gratuita para desbloquear o itinerário completo de 5 dias com recomendações personalizadas de hotéis, voos e atividades.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <RippleButton
              onClick={onRegister}
              variant="brand"
              size="lg"
              className="gap-3 text-lg px-10 py-6 h-auto rounded-2xl shadow-glow-primary font-black tracking-tight"
            >
              <User className="w-6 h-6" />
              {t('registerCta') || '📝 Registar Gratuitamente'}
              <ChevronRight className="w-5 h-5" />
            </RippleButton>
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="gap-2 text-base px-8 py-6 h-auto rounded-2xl"
            >
              <Eye className="w-5 h-5" />
              {t('newSearchLabel') || 'Pesquisar outro destino'}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-8 flex-wrap text-sm text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> Sem compromisso
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Itinerário personalizado
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4" /> Recomendações IA
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
