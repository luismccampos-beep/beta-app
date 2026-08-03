'use client'

import { useState, useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  MapPin, Globe, Star, Clock, ArrowLeft, Compass,
  Hotel, Loader2, Sparkles, ArrowRight,
  Languages, FileText, TrendingUp,
} from 'lucide-react'
import { fadeInUp, staggerContainer } from '@/lib/animations'
import { useReducedMotion } from '@/lib/use-reduced-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface DestinationDetailPageProps {
  slug: string
  locale: string
  onBack: () => void
}

interface DestinationData {
  id: string
  slug: string
  nome: string
  pais: string
  descricao?: string
  imageUrl?: string
  rating?: number
  continent?: string
  bestTimeToVisit?: string
  primaryLanguage?: string
  visaRequirements?: string
  videos?: Array<{
    url: string
    thumbUrl?: string
    posterUrl?: string
    width?: number
    height?: number
    durationSec?: number
    author?: string
    license?: string
    sourceUrl?: string
    isVerified?: boolean
  }>
}

/**
 * Full destination detail page with parallax hero, glass morphism sidebar,
 * animated entrances, and premium styling.
 * Fetches destination data from the API on mount.
 */
export function DestinationDetailPage({ slug, locale, onBack }: DestinationDetailPageProps) {
  const [dest, setDest] = useState<DestinationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showVideo, setShowVideo] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ['0%', '0%'] : ['0%', '40%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], prefersReducedMotion ? [1, 1] : [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1, 1.15])

  const hasVerifiedVideo = (dest?.videos?.length ?? 0) > 0 && dest?.videos?.some(v => v.isVerified)
  const activeVideo = hasVerifiedVideo && dest?.videos ? dest.videos.find(v => v.isVerified) : null

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setShowVideo(false)

    fetch(`/api/travel/v1/destinations/${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json() as Record<string, unknown>
        return ((data?.item as DestinationData) ?? data) as DestinationData
      })
      .then((data) => {
        if (!cancelled) {
          setDest(data)
          // Auto-show video se houver vídeo verificado
          const videos = data.videos as Array<{ isVerified?: boolean }> | undefined
          if (videos?.some((v) => v.isVerified)) {
            setShowVideo(true)
          }
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load destination')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
            <Loader2 className="w-10 h-10 animate-spin text-primary relative z-10" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium animate-pulse">A carregar destino…</p>
        </div>
      </div>
    )
  }

  if (error || !dest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <button onClick={onBack} className="text-sm text-primary hover:text-primary-700 mb-6 inline-flex items-center gap-1.5 font-medium transition-colors" >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos destinos
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
              <Compass className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Destino não encontrado</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
              {error || 'Não foi possível carregar este destino. Tente novamente mais tarde.'}
            </p>
            <Button asChild variant="brand" className="gap-2">
              <Link to="/destinations">
                <Compass className="w-4 h-4" />
                Explorar destinos
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  const quickFacts = [
    { icon: Star, label: 'Avaliação', value: dest.rating ? `${dest.rating}/5` : null, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { icon: Globe, label: 'Continente', value: dest.continent, color: 'text-primary', bg: 'bg-primary-50 dark:bg-primary-950/30' },
    { icon: Clock, label: 'Melhor época', value: dest.bestTimeToVisit, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30' },
    { icon: Languages, label: 'Língua principal', value: dest.primaryLanguage, color: 'text-accent', bg: 'bg-accent-50 dark:bg-accent-950/30' },
  ].filter(f => f.value)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-accent-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors">
      {/* ── Parallax Hero ── */}
      <div ref={heroRef} className="relative h-[60vh] min-h-[400px] sm:h-[70vh] overflow-hidden">
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          {showVideo && activeVideo ? (
            <video
              src={activeVideo.url}
              poster={activeVideo.posterUrl ?? activeVideo.thumbUrl ?? dest.imageUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLVideoElement).style.display = 'none'
                setShowVideo(false)
              }}
            />
          ) : dest.imageUrl ? (
            <img
              src={dest.imageUrl}
              alt={dest.nome}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary via-accent-600 to-orange" />
          )}
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        {/* Video/Foto toggle */}
        {hasVerifiedVideo && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <button
              onClick={() => setShowVideo(v => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white text-sm font-medium transition-all"
            >
              {showVideo ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                  Ver foto
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Ver vídeo
                </>
              )}
            </button>
          </div>
        )}

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-14"
        >
          <div className="max-w-5xl mx-auto">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-4 font-medium transition-colors backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-lg border border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Todos os destinos
            </button>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-3 tracking-tighter drop-shadow-2xl"
            >
              {dest.nome}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="flex items-center gap-2 text-lg sm:text-xl text-white/90 font-medium"
            >
              <MapPin className="w-5 h-5 text-orange" />
              {dest.pais}{dest.continent ? ` · ${dest.continent}` : ''}
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About section */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <Card className="glass dark:bg-gray-900/60 border-primary-100/50 dark:border-gray-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-gray via-orange to-green" />
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                      Sobre {dest.nome}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-base">
                    {dest.descricao || `Descubra tudo o que ${dest.nome} tem para oferecer. Da cultura local às paisagens deslumbrantes, cada canto conta uma história única.`}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* CTA section */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="relative overflow-hidden rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-600 to-accent" />
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
              <div className="relative p-8 sm:p-10 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="w-6 h-6 text-white/80" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Planeie a sua viagem</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black mb-3 tracking-tight">
                  Pronto para explorar {dest.nome}?
                </h3>
                <p className="text-white/80 mb-6 max-w-lg leading-relaxed">
                  Crie um roteiro personalizado com recomendações de hotéis, voos e atividades baseadas nas suas preferências.
                </p>
                <Button
                  asChild
                  className="bg-white text-primary hover:bg-white/90 font-bold gap-2 shadow-xl"
                >
                  <Link to="/preferences/quick">
                    <Sparkles className="w-4 h-4" />
                    Planear viagem
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="space-y-6"
          >
            {/* Quick facts card */}
            <motion.div variants={fadeInUp}>
              <Card className="glass dark:bg-gray-900/60 border-primary-100/50 dark:border-gray-800 shadow-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Factos rápidos</h3>
                  </div>
                  <div className="space-y-3">
                    {quickFacts.map((fact, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${fact.bg} shrink-0`}>
                          <fact.icon className={`w-4 h-4 ${fact.color}`} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{fact.value}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{fact.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick links card */}
            <motion.div variants={fadeInUp}>
              <Card className="glass dark:bg-gray-900/60 border-primary-100/50 dark:border-gray-800 shadow-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-orange flex items-center justify-center">
                      <Compass className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Explorar</h3>
                  </div>
                  <div className="space-y-2">
                    <Link
                      to="/results"
                      search={{ destinations: slug, mode: 'hotels' }}
                      className="group flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-300 transition-all p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-transparent hover:border-primary-100 dark:hover:border-primary-800/50"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Hotel className="w-4 h-4 text-primary group-hover:text-white" />
                      </span>
                      <span className="flex-1">Hotéis em {dest.nome}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                    <Link
                      to="/results"
                      search={{ destinations: slug, mode: 'flights' }}
                      className="group flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-300 transition-all p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-transparent hover:border-primary-100 dark:hover:border-primary-800/50"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-50 dark:bg-accent-900/30 group-hover:bg-accent group-hover:text-white transition-colors">
                        <Globe className="w-4 h-4 text-accent group-hover:text-white" />
                      </span>
                      <span className="flex-1">Voos para {dest.nome}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Visa info card */}
            {dest.visaRequirements && (
              <motion.div variants={fadeInUp}>
                <Card className="glass dark:bg-gray-900/60 border-primary-100/50 dark:border-gray-800 shadow-xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Vistos</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{dest.visaRequirements}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
