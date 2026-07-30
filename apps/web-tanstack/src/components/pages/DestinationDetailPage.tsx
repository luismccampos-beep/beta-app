'use client'

import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  MapPin, Globe, Star, Clock, Users, ArrowLeft, Compass,
  Hotel, Utensils, Camera, Loader2,
} from 'lucide-react'
import { fadeInUp } from '@/lib/animations'

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
}

/**
 * Full destination detail page with hero image, description, stats, and CTA.
 * Fetches destination data from the API on mount.
 */
export function DestinationDetailPage({ slug, locale, onBack }: DestinationDetailPageProps) {
  const [dest, setDest] = useState<DestinationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/travel/v1/destinations/${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json() as Record<string, unknown>
        return ((data?.item as DestinationData) ?? data) as DestinationData
      })
      .then((data) => {
        if (!cancelled) setDest(data)
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !dest) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <button onClick={onBack} className="text-sm text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Voltar aos destinos
          </button>
          <div className="text-center py-20">
            <Compass className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Destino não encontrado</h1>
            <p className="text-gray-500 dark:text-gray-400">
              {error || 'Não foi possível carregar este destino. Tente novamente mais tarde.'}
            </p>
            <Link
              to="/destinations"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Compass className="w-4 h-4" />
              Explorar destinos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        {dest.imageUrl ? (
          <img
            src={dest.imageUrl}
            alt={dest.nome}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <button onClick={onBack} className="text-white/80 hover:text-white text-sm mb-3 inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Todos os destinos
          </button>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">{dest.nome}</h1>
          <p className="text-white/80 flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5" />
            {dest.pais}{dest.continent ? ` · ${dest.continent}` : ''}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2">
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sobre {dest.nome}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {dest.descricao || `Descubra tudo o que ${dest.nome} tem para oferecer. Da cultura local às paisagens deslumbrantes, cada canto conta uma história única.`}
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-3">Pronto para explorar {dest.nome}?</h3>
              <p className="text-blue-100 mb-6">
                Crie um roteiro personalizado com recomendações de hotéis, voos e atividades baseadas nas suas preferências.
              </p>
              <Link
                to="/preferences/quick"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Compass className="w-5 h-5" />
                Planear viagem
              </Link>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
            {/* Quick facts */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Factos rápidos</h3>
              <div className="space-y-4">
                {dest.rating != null && dest.rating > 0 && (
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{dest.rating}/5</p>
                      <p className="text-xs text-gray-500">Avaliação</p>
                    </div>
                  </div>
                )}
                {dest.continent && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{dest.continent}</p>
                      <p className="text-xs text-gray-500">Continente</p>
                    </div>
                  </div>
                )}
                {dest.bestTimeToVisit && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{dest.bestTimeToVisit}</p>
                      <p className="text-xs text-gray-500">Melhor época</p>
                    </div>
                  </div>
                )}
                {dest.primaryLanguage && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{dest.primaryLanguage}</p>
                      <p className="text-xs text-gray-500">Língua principal</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Explorar</h3>
              <div className="space-y-2">
                <Link to="/results" search={{ destinations: slug, mode: 'hotels' }} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <Hotel className="w-4 h-4" />
                  Hotéis em {dest.nome}
                </Link>
                <Link to="/results" search={{ destinations: slug, mode: 'flights' }} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <Globe className="w-4 h-4" />
                  Voos para {dest.nome}
                </Link>
              </div>
            </div>

            {/* Visa info if available */}
            {dest.visaRequirements && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Vistos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{dest.visaRequirements}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
