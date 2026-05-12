import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Plane,
  Hotel,
  UtensilsCrossed,
  Palmtree,
  Wallet,
  Users,
  Calendar,
  Globe,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Brain,
  Check,
  MapPin,
  Briefcase,
  Heart,
  Coffee,
  Mountain,
  Camera,
  Music,
  ShoppingBag,
  Utensils,
  Waves,
  Sunrise,
  Moon,
  Wind,
  Leaf,
  Lock,
  Bell,
  ChevronRight,
  ArrowLeft,
  Star,
  Award,
  Flag,
  Languages
} from 'lucide-react';
import { toast } from 'sonner';

type Language = 'en' | 'pt' | 'es' | 'fr';

interface Translations {
  [key: string]: {
    en: string;
    pt: string;
    es: string;
    fr: string;
  };
}

// Legacy inline translations (migrated into `src/messages/{locale}.json`).
// Kept temporarily to avoid a massive diff; safe to delete later.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const translations: Translations = {
  appTitle: {
    en: 'AKMLEVA',
    pt: 'AKMLEVA',
    es: 'AKMLEVA',
    fr: 'AKMLEVA'
  },
  appSubtitle: {
    en: 'Enterprise AI-Powered Travel Ecosystem',
    pt: 'Ecossistema de Viagens Empresarial com IA',
    es: 'Ecosistema de Viajes Empresarial con IA',
    fr: 'Écosystème de Voyage d\'Entreprise avec IA'
  },
  appFeatures: {
    en: 'Intelligent Travel Solutions • Global Scale • Multi-Currency Processing • CRM Integration',
    pt: 'Soluções Inteligentes de Viagem • Escala Global • Processamento Multi-Moeda • Integração CRM',
    es: 'Soluciones de Viaje Inteligentes • Escala Global • Procesamiento Multi-Moneda • Integración CRM',
    fr: 'Solutions de Voyage Intelligentes • Échelle Mondiale • Traitement Multi-Devises • Intégration CRM'
  },
  aiEnhanced: {
    en: 'AI-Enhanced',
    pt: 'Aprimorado por IA',
    es: 'Mejorado con IA',
    fr: 'Amélioré par IA'
  },
  multiCurrency: {
    en: 'Multi-Currency',
    pt: 'Multi-Moeda',
    es: 'Multi-Moneda',
    fr: 'Multi-Devises'
  },
  predictiveAnalytics: {
    en: 'Predictive Analytics',
    pt: 'Análise Preditiva',
    es: 'Análisis Predictivo',
    fr: 'Analytique Prédictive'
  },
  enterpriseSecurity: {
    en: 'Enterprise Security',
    pt: 'Segurança Empresarial',
    es: 'Seguridad Empresarial',
    fr: 'Sécurité d\'Entreprise'
  },
  realTimeProcessing: {
    en: 'Real-time Processing',
    pt: 'Processamento em Tempo Real',
    es: 'Procesamiento en Tiempo Real',
    fr: 'Traitement en Temps Réel'
  },
  aiIntelligenceScore: {
    en: 'AI Intelligence Score',
    pt: 'Pontuação de Inteligência IA',
    es: 'Puntuación de Inteligencia IA',
    fr: 'Score d\'Intelligence IA'
  },
  profileCompletion: {
    en: 'Profile Completion',
    pt: 'Conclusão do Perfil',
    es: 'Finalización del Perfil',
    fr: 'Achèvement du Profil'
  },
  travelerProfile: {
    en: 'Traveler Profile',
    pt: 'Perfil do Viajante',
    es: 'Perfil del Viajero',
    fr: 'Profil du Voyageur'
  },
  aiGeneratedClassification: {
    en: 'AI-Generated Classification',
    pt: 'Classificação Gerada por IA',
    es: 'Clasificación Generada por IA',
    fr: 'Classification Générée par IA'
  },
  sustainabilityScore: {
    en: 'Sustainability Score',
    pt: 'Pontuação de Sustentabilidade',
    es: 'Puntuación de Sostenibilidad',
    fr: 'Score de Durabilité'
  },
  ecoImpactRating: {
    en: 'Eco-Impact Rating',
    pt: 'Classificação de Impacto Ecológico',
    es: 'Calificación de Impacto Ecológico',
    fr: 'Évaluation d\'Impact Écologique'
  },
  stepLabel: {
    en: 'Step',
    pt: 'Etapa',
    es: 'Paso',
    fr: 'Étape'
  },
  of: {
    en: 'of',
    pt: 'de',
    es: 'de',
    fr: 'de'
  },
  profile: {
    en: 'Profile',
    pt: 'Perfil',
    es: 'Perfil',
    fr: 'Profil'
  },
  travelStyle: {
    en: 'Travel Style',
    pt: 'Estilo de Viagem',
    es: 'Estilo de Viaje',
    fr: 'Style de Voyage'
  },
  budget: {
    en: 'Budget',
    pt: 'Orçamento',
    es: 'Presupuesto',
    fr: 'Budget'
  },
  preferences: {
    en: 'Preferences',
    pt: 'Preferências',
    es: 'Preferencias',
    fr: 'Préférences'
  },
  activities: {
    en: 'Activities',
    pt: 'Atividades',
    es: 'Actividades',
    fr: 'Activités'
  },
  specialNeeds: {
    en: 'Special Needs',
    pt: 'Necessidades Especiais',
    es: 'Necesidades Especiales',
    fr: 'Besoins Spéciaux'
  },
  settings: {
    en: 'Settings',
    pt: 'Configurações',
    es: 'Configuración',
    fr: 'Paramètres'
  },
  personalProfile: {
    en: 'Personal Profile',
    pt: 'Perfil Pessoal',
    es: 'Perfil Personal',
    fr: 'Profil Personnel'
  },
  personalInfoDesc: {
    en: 'Your personal information is encrypted and secure. Used for booking and compliance only.',
    pt: 'Suas informações pessoais são criptografadas e seguras. Usadas apenas para reservas e conformidade.',
    es: 'Su información personal está cifrada y segura. Se utiliza solo para reservas y cumplimiento.',
    fr: 'Vos informations personnelles sont cryptées et sécurisées. Utilisées uniquement pour les réservations et la conformité.'
  },
  fullName: {
    en: 'Full Name',
    pt: 'Nome Completo',
    es: 'Nombre Completo',
    fr: 'Nom Complet'
  },
  emailAddress: {
    en: 'Email Address',
    pt: 'Endereço de Email',
    es: 'Dirección de Correo Electrónico',
    fr: 'Adresse Email'
  },
  phoneNumber: {
    en: 'Phone Number',
    pt: 'Número de Telefone',
    es: 'Número de Teléfono',
    fr: 'Numéro de Téléphone'
  },
  dateOfBirth: {
    en: 'Date of Birth',
    pt: 'Data de Nascimento',
    es: 'Fecha de Nacimiento',
    fr: 'Date de Naissance'
  },
  nationality: {
    en: 'Nationality',
    pt: 'Nacionalidade',
    es: 'Nacionalidad',
    fr: 'Nationalité'
  },
  passportNumber: {
    en: 'Passport Number',
    pt: 'Número do Passaporte',
    es: 'Número de Pasaporte',
    fr: 'Numéro de Passeport'
  },
  enterpriseGradeSecurity: {
    en: 'Enterprise-Grade Security',
    pt: 'Segurança de Nível Empresarial',
    es: 'Seguridad de Nivel Empresarial',
    fr: 'Sécurité de Niveau Entreprise'
  },
  securityDesc: {
    en: 'All data is encrypted with AES-256 encryption and compliant with GDPR, CCPA, and SOC 2 standards.',
    pt: 'Todos os dados são criptografados com criptografia AES-256 e compatíveis com os padrões GDPR, CCPA e SOC 2.',
    es: 'Todos los datos están cifrados con cifrado AES-256 y cumplen con los estándares GDPR, CCPA y SOC 2.',
    fr: 'Toutes les données sont cryptées avec le cryptage AES-256 et conformes aux normes GDPR, CCPA et SOC 2.'
  },
  travelStylePreferences: {
    en: 'Travel Style & Preferences',
    pt: 'Estilo e Preferências de Viagem',
    es: 'Estilo y Preferencias de Viaje',
    fr: 'Style et Préférences de Voyage'
  },
  travelStyleDesc: {
    en: 'Select all that apply - our AI will match you with perfect destinations',
    pt: 'Selecione tudo o que se aplica - nossa IA irá combiná-lo com destinos perfeitos',
    es: 'Seleccione todo lo que aplique - nuestra IA lo emparejará con destinos perfectos',
    fr: 'Sélectionnez tout ce qui s\'applique - notre IA vous associera à des destinations parfaites'
  },
  whatsYourTravelStyle: {
    en: 'What\'s Your Travel Style?',
    pt: 'Qual é o Seu Estilo de Viagem?',
    es: '¿Cuál es su Estilo de Viaje?',
    fr: 'Quel est Votre Style de Voyage?'
  },
  previous: {
    en: 'Previous',
    pt: 'Anterior',
    es: 'Anterior',
    fr: 'Précédent'
  },
  nextStep: {
    en: 'Next Step',
    pt: 'Próxima Etapa',
    es: 'Siguiente Paso',
    fr: 'Étape Suivante'
  },
  completeProfile: {
    en: 'Complete Profile',
    pt: 'Completar Perfil',
    es: 'Completar Perfil',
    fr: 'Compléter le Profil'
  },
  processingWithAI: {
    en: 'Processing with AI...',
    pt: 'Processando com IA...',
    es: 'Procesando con IA...',
    fr: 'Traitement avec IA...'
  },
  preferenceSavedSuccess: {
    en: 'Travel preferences saved successfully!',
    pt: 'Preferências de viagem salvas com sucesso!',
    es: '¡Preferencias de viaje guardadas con éxito!',
    fr: 'Préférences de voyage enregistrées avec succès!'
  },
  preferenceSavedDesc: {
    en: 'AI has analyzed your profile and generated personalized recommendations.',
    pt: 'A IA analisou seu perfil e gerou recomendações personalizadas.',
    es: 'La IA ha analizado su perfil y generado recomendaciones personalizadas.',
    fr: 'L\'IA a analysé votre profil et généré des recommandations personnalisées.'
  },
  luxury: {
    en: 'Luxury',
    pt: 'Luxo',
    es: 'Lujo',
    fr: 'Luxe'
  },
  adventure: {
    en: 'Adventure',
    pt: 'Aventura',
    es: 'Aventura',
    fr: 'Aventure'
  },
  cultural: {
    en: 'Cultural',
    pt: 'Cultural',
    es: 'Cultural',
    fr: 'Culturel'
  },
  relaxation: {
    en: 'Relaxation',
    pt: 'Relaxamento',
    es: 'Relajación',
    fr: 'Détente'
  },
  business: {
    en: 'Business',
    pt: 'Negócios',
    es: 'Negocios',
    fr: 'Affaires'
  },
  family: {
    en: 'Family',
    pt: 'Família',
    es: 'Familia',
    fr: 'Famille'
  },
  ecoTourism: {
    en: 'Eco-Tourism',
    pt: 'Ecoturismo',
    es: 'Ecoturismo',
    fr: 'Écotourisme'
  },
  foodie: {
    en: 'Foodie',
    pt: 'Gastronomia',
    es: 'Gastronomía',
    fr: 'Gastronomie'
  },
  budgetFinancialPreferences: {
    en: 'Budget & Financial Preferences',
    pt: 'Orçamento e Preferências Financeiras',
    es: 'Presupuesto y Preferencias Financieras',
    fr: 'Budget et Préférences Financières'
  },
  multiCurrencySupport: {
    en: 'Multi-currency support with real-time conversion rates',
    pt: 'Suporte multi-moeda com taxas de conversão em tempo real',
    es: 'Soporte multi-moneda con tasas de conversión en tiempo real',
    fr: 'Support multi-devises avec taux de conversion en temps réel'
  },
  preferredCurrency: {
    en: 'Preferred Currency',
    pt: 'Moeda Preferida',
    es: 'Moneda Preferida',
    fr: 'Devise Préférée'
  },
  travelFrequency: {
    en: 'Travel Frequency',
    pt: 'Frequência de Viagens',
    es: 'Frecuencia de Viajes',
    fr: 'Fréquence de Voyage'
  },
  howOftenTravel: {
    en: 'How often do you travel?',
    pt: 'Com que frequência você viaja?',
    es: '¿Con qué frecuencia viajas?',
    fr: 'À quelle fréquence voyagez-vous?'
  },
  preferredDestinations: {
    en: 'Preferred Destinations',
    pt: 'Destinos Preferidos',
    es: 'Destinos Preferidos',
    fr: 'Destinations Préférées'
  },
  travelPurpose: {
    en: 'Travel Purpose',
    pt: 'Propósito da Viagem',
    es: 'Propósito del Viaje',
    fr: 'Objectif du Voyage'
  },
  budgetRangePerTrip: {
    en: 'Budget Range per Trip',
    pt: 'Faixa de Orçamento por Viagem',
    es: 'Rango de Presupuesto por Viaje',
    fr: 'Fourchette de Budget par Voyage'
  },
  minimum: {
    en: 'Minimum',
    pt: 'Mínimo',
    es: 'Mínimo',
    fr: 'Minimum'
  },
  maximum: {
    en: 'Maximum',
    pt: 'Máximo',
    es: 'Máximo',
    fr: 'Maximum'
  },
  category: {
    en: 'Category',
    pt: 'Categoria',
    es: 'Categoría',
    fr: 'Catégorie'
  },
  budgetPriority: {
    en: 'Budget Priority',
    pt: 'Prioridade do Orçamento',
    es: 'Prioridad del Presupuesto',
    fr: 'Priorité du Budget'
  },
  budgetPriorityQuestion: {
    en: 'How do you prioritize your budget?',
    pt: 'Como você prioriza seu orçamento?',
    es: '¿Cómo priorizas tu presupuesto?',
    fr: 'Comment priorisez-vous votre budget?'
  },
  preferredFlightCabin: {
    en: 'Preferred Flight Cabin Class',
    pt: 'Classe de Cabine de Voo Preferida',
    es: 'Clase de Cabina de Vuelo Preferida',
    fr: 'Classe de Cabine de Vol Préférée'
  },
  flightAccommodationPreferences: {
    en: 'Flight & Accommodation Preferences',
    pt: 'Preferências de Voo e Acomodação',
    es: 'Preferencias de Vuelo y Alojamiento',
    fr: 'Préférences de Vol et d\'Hébergement'
  },
  fineTunePreferences: {
    en: 'Fine-tune your travel experience preferences',
    pt: 'Ajuste suas preferências de experiência de viagem',
    es: 'Ajusta tus preferencias de experiencia de viaje',
    fr: 'Affinez vos préférences d\'expérience de voyage'
  },
  flightPreferences: {
    en: 'Flight Preferences',
    pt: 'Preferências de Voo',
    es: 'Preferencias de Vuelo',
    fr: 'Préférences de Vol'
  },
  accommodation: {
    en: 'Accommodation',
    pt: 'Acomodação',
    es: 'Alojamiento',
    fr: 'Hébergement'
  },
  seatPreference: {
    en: 'Seat Preference',
    pt: 'Preferência de Assento',
    es: 'Preferencia de Asiento',
    fr: 'Préférence de Siège'
  },
  selectSeatPreference: {
    en: 'Select your seat preference',
    pt: 'Selecione sua preferência de assento',
    es: 'Selecciona tu preferencia de asiento',
    fr: 'Sélectionnez votre préférence de siège'
  },
  mealPreference: {
    en: 'In-Flight Meal Preference',
    pt: 'Preferência de Refeição a Bordo',
    es: 'Preferencia de Comida en Vuelo',
    fr: 'Préférence de Repas en Vol'
  },
  selectMealPreference: {
    en: 'Select meal preference',
    pt: 'Selecione preferência de refeição',
    es: 'Selecciona preferencia de comida',
    fr: 'Sélectionnez la préférence de repas'
  },
  loyaltyPrograms: {
    en: 'Loyalty Programs',
    pt: 'Programas de Fidelidade',
    es: 'Programas de Fidelidad',
    fr: 'Programmes de Fidélité'
  },
  accommodationType: {
    en: 'Accommodation Type',
    pt: 'Tipo de Acomodação',
    es: 'Tipo de Alojamiento',
    fr: 'Type d\'Hébergement'
  },
  roomType: {
    en: 'Room Type',
    pt: 'Tipo de Quarto',
    es: 'Tipo de Habitación',
    fr: 'Type de Chambre'
  },
  selectRoomType: {
    en: 'Select preferred room type',
    pt: 'Selecione o tipo de quarto preferido',
    es: 'Selecciona el tipo de habitación preferido',
    fr: 'Sélectionnez le type de chambre préféré'
  },
  requiredAmenities: {
    en: 'Required Amenities',
    pt: 'Comodidades Necessárias',
    es: 'Comodidades Requeridas',
    fr: 'Équipements Requis'
  },
  preferredHotelChains: {
    en: 'Preferred Hotel Chains',
    pt: 'Redes de Hotéis Preferidas',
    es: 'Cadenas de Hoteles Preferidas',
    fr: 'Chaînes d\'Hôtels Préférées'
  },
  activitiesExperiences: {
    en: 'Activities & Experiences',
    pt: 'Atividades e Experiências',
    es: 'Actividades y Experiencias',
    fr: 'Activités et Expériences'
  },
  aiCurateExperiences: {
    en: 'Let AI curate experiences that match your interests',
    pt: 'Deixe a IA selecionar experiências que correspondam aos seus interesses',
    es: 'Deja que la IA seleccione experiencias que coincidan con tus intereses',
    fr: 'Laissez l\'IA organiser des expériences correspondant à vos intérêts'
  },
  preferredActivities: {
    en: 'Preferred Activities',
    pt: 'Atividades Preferidas',
    es: 'Actividades Preferidas',
    fr: 'Activités Préférées'
  },
  travelPace: {
    en: 'Travel Pace',
    pt: 'Ritmo de Viagem',
    es: 'Ritmo de Viaje',
    fr: 'Rythme de Voyage'
  },
  selectPreferredPace: {
    en: 'Select your preferred pace',
    pt: 'Selecione seu ritmo preferido',
    es: 'Selecciona tu ritmo preferido',
    fr: 'Sélectionnez votre rythme préféré'
  },
  experienceTypes: {
    en: 'Experience Types',
    pt: 'Tipos de Experiência',
    es: 'Tipos de Experiencia',
    fr: 'Types d\'Expérience'
  },
  languagesYouSpeak: {
    en: 'Languages You Speak',
    pt: 'Idiomas que Você Fala',
    es: 'Idiomas que Hablas',
    fr: 'Langues que Vous Parlez'
  },
  specialRequirementsNeeds: {
    en: 'Special Requirements & Needs',
    pt: 'Requisitos e Necessidades Especiais',
    es: 'Requisitos y Necesidades Especiales',
    fr: 'Exigences et Besoins Spéciaux'
  },
  ensureSafeComfortable: {
    en: 'Ensure a safe, comfortable, and personalized travel experience',
    pt: 'Garanta uma experiência de viagem segura, confortável e personalizada',
    es: 'Garantiza una experiencia de viaje segura, cómoda y personalizada',
    fr: 'Garantissez une expérience de voyage sûre, confortable et personnalisée'
  },
  dietaryRestrictions: {
    en: 'Dietary Restrictions',
    pt: 'Restrições Alimentares',
    es: 'Restricciones Dietéticas',
    fr: 'Restrictions Alimentaires'
  },
  accessibilityRequirements: {
    en: 'Accessibility Requirements',
    pt: 'Requisitos de Acessibilidade',
    es: 'Requisitos de Accesibilidad',
    fr: 'Exigences d\'Accessibilité'
  },
  medicalConditionsNotes: {
    en: 'Medical Conditions / Special Notes',
    pt: 'Condições Médicas / Notas Especiais',
    es: 'Condiciones Médicas / Notas Especiales',
    fr: 'Conditions Médicales / Notes Spéciales'
  },
  medicalPlaceholder: {
    en: 'Please list any medical conditions, allergies, or special requirements we should be aware of...',
    pt: 'Por favor, liste quaisquer condições médicas, alergias ou requisitos especiais que devemos conhecer...',
    es: 'Por favor, enumera cualquier condición médica, alergia o requisito especial que debamos conocer...',
    fr: 'Veuillez énumérer toutes les conditions médicales, allergies ou exigences spéciales dont nous devrions être informés...'
  },
  confidentialEncrypted: {
    en: 'This information is confidential and encrypted',
    pt: 'Esta informação é confidencial e criptografada',
    es: 'Esta información es confidencial y cifrada',
    fr: 'Ces informations sont confidentielles et cryptées'
  },
  sustainabilityPreferences: {
    en: 'Sustainability Preferences',
    pt: 'Preferências de Sustentabilidade',
    es: 'Preferencias de Sostenibilidad',
    fr: 'Préférences de Durabilité'
  },
  helpEnvironmentallyResponsible: {
    en: 'Help us make your travel more environmentally responsible',
    pt: 'Ajude-nos a tornar sua viagem mais ecologicamente responsável',
    es: 'Ayúdanos a hacer tu viaje más responsable con el medio ambiente',
    fr: 'Aidez-nous à rendre votre voyage plus respectueux de l\'environnement'
  },
  sustainabilityPriority: {
    en: 'Sustainability Priority',
    pt: 'Prioridade de Sustentabilidade',
    es: 'Prioridad de Sostenibilidad',
    fr: 'Priorité de Durabilité'
  },
  ecoPreferences: {
    en: 'Eco Preferences',
    pt: 'Preferências Ecológicas',
    es: 'Preferencias Ecológicas',
    fr: 'Préférences Écologiques'
  },
  automaticCarbonOffset: {
    en: 'Automatic Carbon Offset',
    pt: 'Compensação Automática de Carbono',
    es: 'Compensación Automática de Carbono',
    fr: 'Compensation Carbone Automatique'
  },
  offsetCO2Flights: {
    en: 'Automatically offset CO2 emissions for all flights',
    pt: 'Compensar automaticamente emissões de CO2 para todos os voos',
    es: 'Compensar automáticamente las emisiones de CO2 de todos los vuelos',
    fr: 'Compenser automatiquement les émissions de CO2 pour tous les vols'
  },
  advancedSettingsAI: {
    en: 'Advanced Settings & AI Configuration',
    pt: 'Configurações Avançadas e Configuração de IA',
    es: 'Configuración Avanzada y Configuración de IA',
    fr: 'Paramètres Avancés et Configuration de l\'IA'
  },
  customizeAIExperience: {
    en: 'Customize your AI experience and privacy preferences',
    pt: 'Personalize sua experiência de IA e preferências de privacidade',
    es: 'Personaliza tu experiencia de IA y preferencias de privacidad',
    fr: 'Personnalisez votre expérience d\'IA et vos préférences de confidentialité'
  },
  aiPoweredFeatures: {
    en: 'AI-Powered Features',
    pt: 'Recursos Alimentados por IA',
    es: 'Funciones Impulsadas por IA',
    fr: 'Fonctionnalités Propulsées par l\'IA'
  },
  leverageEnterpriseAI: {
    en: 'Leverage enterprise-grade artificial intelligence for personalized travel experiences',
    pt: 'Aproveite a inteligência artificial de nível empresarial para experiências de viagem personalizadas',
    es: 'Aprovecha la inteligencia artificial de nivel empresarial para experiencias de viaje personalizadas',
    fr: 'Tirez parti de l\'intelligence artificielle de niveau entreprise pour des expériences de voyage personnalisées'
  },
  enableAIRecommendations: {
    en: 'Enable AI Recommendations',
    pt: 'Habilitar Recomendações de IA',
    es: 'Habilitar Recomendaciones de IA',
    fr: 'Activer les Recommandations IA'
  },
  aiRecommendationsDesc: {
    en: 'Get personalized travel suggestions based on your preferences, past behavior, and global travel trends',
    pt: 'Obtenha sugestões de viagens personalizadas com base em suas preferências, comportamento passado e tendências de viagens globais',
    es: 'Obtén sugerencias de viaje personalizadas basadas en tus preferencias, comportamiento pasado y tendencias de viaje globales',
    fr: 'Obtenez des suggestions de voyage personnalisées basées sur vos préférences, votre comportement passé et les tendances de voyage mondiales'
  },
  enhancedDataAnalysis: {
    en: 'Enhanced Data Analysis',
    pt: 'Análise de Dados Aprimorada',
    es: 'Análisis de Datos Mejorado',
    fr: 'Analyse de Données Améliorée'
  },
  enhancedDataDesc: {
    en: 'Allow anonymous data sharing to improve AI accuracy and recommendation quality across the platform',
    pt: 'Permitir compartilhamento de dados anônimos para melhorar a precisão da IA e a qualidade das recomendações na plataforma',
    es: 'Permitir el intercambio de datos anónimos para mejorar la precisión de la IA y la calidad de las recomendaciones en la plataforma',
    fr: 'Autoriser le partage de données anonymes pour améliorer la précision de l\'IA et la qualité des recommandations sur la plateforme'
  },
  dataAnonymized: {
    en: 'Your data is anonymized and encrypted • GDPR & CCPA Compliant',
    pt: 'Seus dados são anonimizados e criptografados • Compatível com GDPR e CCPA',
    es: 'Tus datos son anonimizados y cifrados • Cumple con GDPR y CCPA',
    fr: 'Vos données sont anonymisées et cryptées • Conforme RGPD et CCPA'
  },
  aiIntelligenceActivated: {
    en: 'AI Intelligence Activated',
    pt: 'Inteligência IA Ativada',
    es: 'Inteligencia IA Activada',
    fr: 'Intelligence IA Activée'
  },
  profileAnalyzed: {
    en: 'Your profile is being analyzed by our neural network to provide:',
    pt: 'Seu perfil está sendo analisado por nossa rede neural para fornecer:',
    es: 'Tu perfil está siendo analizado por nuestra red neuronal para proporcionar:',
    fr: 'Votre profil est analysé par notre réseau neuronal pour fournir:'
  },
  personalizedDestinations: {
    en: 'Personalized destination recommendations',
    pt: 'Recomendações de destinos personalizadas',
    es: 'Recomendaciones de destinos personalizadas',
    fr: 'Recommandations de destinations personnalisées'
  },
  dynamicPricing: {
    en: 'Dynamic pricing optimization',
    pt: 'Otimização de preços dinâmica',
    es: 'Optimización de precios dinámica',
    fr: 'Optimisation des prix dynamique'
  },
  predictivePlanning: {
    en: 'Predictive travel planning',
    pt: 'Planejamento de viagens preditivo',
    es: 'Planificación de viajes predictiva',
    fr: 'Planification de voyage prédictive'
  },
  realtimeAdjustments: {
    en: 'Real-time itinerary adjustments',
    pt: 'Ajustes de itinerário em tempo real',
    es: 'Ajustes de itinerario en tiempo real',
    fr: 'Ajustements d\'itinéraire en temps réel'
  },
  notificationPreferences: {
    en: 'Notification Preferences',
    pt: 'Preferências de Notificação',
    es: 'Preferencias de Notificación',
    fr: 'Préférences de Notification'
  },
  privacySecurity: {
    en: 'Privacy & Security',
    pt: 'Privacidade e Segurança',
    es: 'Privacidad y Seguridad',
    fr: 'Confidentialité et Sécurité'
  },
  privacyLevel: {
    en: 'Privacy Level',
    pt: 'Nível de Privacidade',
    es: 'Nivel de Privacidad',
    fr: 'Niveau de Confidentialité'
  },
  securityCertifications: {
    en: 'Security Certifications',
    pt: 'Certificações de Segurança',
    es: 'Certificaciones de Seguridad',
    fr: 'Certifications de Sécurité'
  },
  allDataEncrypted: {
    en: 'All data is encrypted using AES-256 encryption and stored in secure, geographically distributed data centers.',
    pt: 'Todos os dados são criptografados usando criptografia AES-256 e armazenados em centros de dados seguros e geograficamente distribuídos.',
    es: 'Todos los datos están cifrados con cifrado AES-256 y almacenados en centros de datos seguros y distribuidos geográficamente.',
    fr: 'Toutes les données sont cryptées à l\'aide du cryptage AES-256 et stockées dans des centres de données sécurisés et géographiquement distribués.'
  },
  aiGeneratedInsights: {
    en: 'AI-Generated Travel Insights',
    pt: 'Insights de Viagem Gerados por IA',
    es: 'Perspectivas de Viaje Generadas por IA',
    fr: 'Aperçus de Voyage Générés par l\'IA'
  },
  realtimeAnalysis: {
    en: 'Real-time analysis of your preferences using machine learning',
    pt: 'Análise em tempo real de suas preferências usando aprendizado de máquina',
    es: 'Análisis en tiempo real de tus preferencias usando aprendizaje automático',
    fr: 'Analyse en temps réel de vos préférences utilisant l\'apprentissage automatique'
  },
  travelerType: {
    en: 'Traveler Type',
    pt: 'Tipo de Viajante',
    es: 'Tipo de Viajero',
    fr: 'Type de Voyageur'
  },
  budgetCategory: {
    en: 'Budget Category',
    pt: 'Categoria de Orçamento',
    es: 'Categoría de Presupuesto',
    fr: 'Catégorie de Budget'
  },
  ecoScore: {
    en: 'Eco Score',
    pt: 'Pontuação Eco',
    es: 'Puntuación Eco',
    fr: 'Score Éco'
  },
  aiRecommendationsReady: {
    en: 'AI Recommendations Ready',
    pt: 'Recomendações de IA Prontas',
    es: 'Recomendaciones de IA Listas',
    fr: 'Recommandations IA Prêtes'
  },
  basedOnProfile: {
    en: 'Based on your profile, we recommend destinations like',
    pt: 'Com base no seu perfil, recomendamos destinos como',
    es: 'Según tu perfil, recomendamos destinos como',
    fr: 'Selon votre profil, nous recommandons des destinations comme'
  },
  activitiesInCategory: {
    en: 'activities in the',
    pt: 'atividades na categoria',
    es: 'actividades en la categoría',
    fr: 'activités dans la catégorie'
  },
  accommodationsInRange: {
    en: 'category, and accommodations in the',
    pt: 'e acomodações na faixa',
    es: 'y alojamientos en el rango',
    fr: 'et hébergements dans la gamme'
  },
  range: {
    en: 'range',
    pt: '',
    es: '',
    fr: ''
  }
};

export interface TravelPreferences {
  // Personal Info
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  
  // Travel Style
  travelStyles: string[];
  travelFrequency: string;
  preferredDestinations: string[];
  travelPurpose: string[];
  
  // Budget
  budgetRange: number[];
  currency: string;
  budgetPriority: string;
  
  // Flight Preferences
  accommodationType: string[];
  cabinClass: string;
  seatPreference: string;
  mealPreference: string;
  loyaltyPrograms: string[];
  
  // Accommodation
  hotelChain: string[];
  roomType: string;
  amenities: string[];
  
  // Activities
  activityTypes: string[];
  pacePreference: string;
  experienceTypes: string[];
  
  // Languages
  languages: { language: string; proficiency: string }[];
  
  // Sustainability
  sustainabilityLevel: string;
  ecoPreferences: string[];
  carbonOffset: boolean;
  
  // Special Requirements
  dietaryRestrictions: string[];
  accessibility: string[];
  medicalConditions: string;
  
  // Advanced Settings
  aiRecommendations: boolean;
  dataSharing: boolean;
  notifications: string[];
  privacyLevel: string;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'SGD', symbol: '$', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', flag: '🇲🇽' },
];

const getTravelStylesData = (t: (key: string) => string) => [
  { id: 'luxury', label: t('luxury'), icon: Star, color: 'from-yellow-500 to-amber-600' },
  { id: 'adventure', label: t('adventure'), icon: Mountain, color: 'from-green-500 to-emerald-600' },
  { id: 'cultural', label: t('cultural'), icon: Camera, color: 'from-teal-500 to-cyan-600' },
  { id: 'relaxation', label: t('relaxation'), icon: Sunrise, color: 'from-orange-500 to-red-600' },
  { id: 'business', label: t('business'), icon: Briefcase, color: 'from-teal-600 to-blue-600' },
  { id: 'family', label: t('family'), icon: Heart, color: 'from-pink-500 to-rose-600' },
  { id: 'ecotourism', label: t('ecoTourism'), icon: Leaf, color: 'from-lime-500 to-green-600' },
  { id: 'foodie', label: t('foodie'), icon: Utensils, color: 'from-orange-600 to-amber-600' },
];

const activityTypesData = [
  { id: 'adventure', label: 'Adventure Sports', icon: Mountain },
  { id: 'cultural', label: 'Cultural Tours', icon: Camera },
  { id: 'beach', label: 'Beach Relaxation', icon: Waves },
  { id: 'city', label: 'City Exploration', icon: MapPin },
  { id: 'hiking', label: 'Mountain Hiking', icon: Mountain },
  { id: 'wildlife', label: 'Wildlife Safari', icon: Palmtree },
  { id: 'food', label: 'Food & Wine', icon: Utensils },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'historical', label: 'Historical Sites', icon: Flag },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'water', label: 'Water Sports', icon: Waves },
  { id: 'nightlife', label: 'Nightlife', icon: Moon },
];

const languagesData = [
  '🇺🇸 English', '🇪🇸 Spanish', '🇫🇷 French', '🇩🇪 German', 
  '🇮🇹 Italian', '🇵🇹 Portuguese', '🇨🇳 Mandarin', '🇯🇵 Japanese',
  '🇰🇷 Korean', '🇷🇺 Russian', '🇦🇪 Arabic', '🇮🇳 Hindi'
];

interface TravelCatalogResponse {
  configured: { duffel: boolean; hotelbeds: boolean };
  duffelCabinClasses: { value: string; label: string }[];
  loyaltyProgrammes: { id: string; label: string }[];
  airports: { iataCode: string; label: string; country: string | null }[];
  accommodations: { code: string; label: string }[];
  chains: { code: string; label: string }[];
  facilities: { code: string; label: string }[];
  errors: { source: string; message: string }[];
}

function cabinClassEmoji(value: string): string {
  switch (value) {
    case 'economy':
      return '💺';
    case 'premium_economy':
      return '✈️';
    case 'business':
      return '🥂';
    case 'first':
      return '👑';
    default:
      return '✈️';
  }
}

interface EnhancedTravelPreferencesFormProps {
  onComplete?: (preferences: TravelPreferences) => void;
  onBack?: () => void;
}

export function EnhancedTravelPreferencesForm({ onComplete, onBack }: EnhancedTravelPreferencesFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('enhancedTravelPreferencesForm');
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiScore, setAiScore] = useState(0);
  const setLocale = (nextLocale: string) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/dashboard');
  }, [onBack, router]);

  const [preferences, setPreferences] = useState<TravelPreferences>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    travelStyles: [],
    travelFrequency: '',
    preferredDestinations: [],
    travelPurpose: [],
    budgetRange: [5000, 15000],
    currency: 'USD',
    budgetPriority: 'balanced',
    accommodationType: [],
    cabinClass: '',
    seatPreference: '',
    mealPreference: '',
    loyaltyPrograms: [],
    hotelChain: [],
    roomType: '',
    amenities: [],
    activityTypes: [],
    pacePreference: 'moderate',
    experienceTypes: [],
    languages: [],
    sustainabilityLevel: 'medium',
    ecoPreferences: [],
    carbonOffset: false,
    dietaryRestrictions: [],
    accessibility: [],
    medicalConditions: '',
    aiRecommendations: true,
    dataSharing: false,
    notifications: ['email'],
    privacyLevel: 'standard',
  });

  const [travelCatalog, setTravelCatalog] = useState<TravelCatalogResponse | null>(null);
  const [travelCatalogLoading, setTravelCatalogLoading] = useState(true);
  const [travelCatalogError, setTravelCatalogError] = useState<string | null>(null);

  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [aiInsightsError, setAiInsightsError] = useState<string | null>(null);
  const [aiInsightsText, setAiInsightsText] = useState<string | null>(null);

  const aiInsightsEnabled = useMemo(() => preferences.aiRecommendations && aiScore > 50, [preferences.aiRecommendations, aiScore]);

  useEffect(() => {
    let cancelled = false;
    setTravelCatalogLoading(true);
    setTravelCatalogError(null);
    fetch(`/api/travel/catalog?locale=${encodeURIComponent(locale)}`)
      .then(async (res) => {
        const raw: unknown = await res.json().catch(() => null);
        if (!res.ok) {
          const msg =
            raw &&
            typeof raw === 'object' &&
            'message' in raw &&
            typeof (raw as { message: unknown }).message === 'string'
              ? (raw as { message: string }).message
              : `HTTP ${res.status}`;
          throw new Error(msg);
        }
        if (!raw || typeof raw !== 'object') throw new Error('Failed to load travel catalogue');
        return raw as TravelCatalogResponse;
      })
      .then((data) => {
        if (cancelled) return;
        setTravelCatalog(data);
        if (data.errors?.length) {
          setTravelCatalogError(data.errors.map((e) => `${e.source}: ${e.message}`).join(' · '));
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setTravelCatalog(null);
          setTravelCatalogError(e instanceof Error ? e.message : 'Failed to load travel catalogue');
        }
      })
      .finally(() => {
        if (!cancelled) setTravelCatalogLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    if (!aiInsightsEnabled) {
      setAiInsightsText(null);
      setAiInsightsError(null);
      return;
    }

    let cancelled = false;
    setAiInsightsLoading(true);
    setAiInsightsError(null);
    fetch('/api/ai/preferences-insights', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ preferences, locale }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; answer?: string; message?: string };
        if (!res.ok || data.ok === false) throw new Error(data.message || 'Failed to generate AI insights');
        return data.answer ?? '';
      })
      .then((answer) => {
        if (!cancelled) setAiInsightsText(answer || null);
      })
      .catch((e: unknown) => {
        if (!cancelled) setAiInsightsError(e instanceof Error ? e.message : 'Failed to generate AI insights');
      })
      .finally(() => {
        if (!cancelled) setAiInsightsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [aiInsightsEnabled, locale, preferences]);

  const updatePreference = (key: keyof TravelPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    // Simulate AI score calculation
    setAiScore(prev => Math.min(100, prev + Math.random() * 3));
  };

  const toggleArrayValue = (key: keyof TravelPreferences, value: string) => {
    const currentArray = preferences[key] as string[];
    if (currentArray.includes(value)) {
      updatePreference(key, currentArray.filter(item => item !== value));
    } else {
      updatePreference(key, [...currentArray, value]);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);

    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ preferences }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to save preferences');
      }

      // Keep the AI-feel but only after successful save
      await new Promise((resolve) => setTimeout(resolve, 600));

      setAiScore(100);
      toast.success(t('preferenceSavedSuccess'), {
        description: t('preferenceSavedDesc'),
      });

      if (onComplete) {
        setTimeout(() => {
          onComplete(preferences);
        }, 900);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 'profile', label: t('profile'), icon: Users },
    { id: 'style', label: t('travelStyle'), icon: Sparkles },
    { id: 'budget', label: t('budget'), icon: Wallet },
    { id: 'preferences', label: t('preferences'), icon: Heart },
    { id: 'activities', label: t('activities'), icon: Palmtree },
    { id: 'special', label: t('specialNeeds'), icon: Shield },
    { id: 'settings', label: t('settings'), icon: Zap },
  ];

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Calculate traveler insights
  const getTravelerType = () => {
    const key = preferences.travelStyles.includes('luxury')
      ? 'luxury'
      : preferences.travelStyles.includes('business')
        ? 'business'
        : preferences.travelStyles.includes('adventure')
          ? 'adventure'
          : preferences.travelStyles.includes('family')
            ? 'family'
            : 'default';
    return t(`travelerType.${key}`);
  };

  const getBudgetCategory = () => {
    const max = preferences.budgetRange[1];
    if (max > 30000) return t('budgetCategory.ultraLuxury');
    if (max > 20000) return t('budgetCategory.luxury');
    if (max > 10000) return t('budgetCategory.premium');
    return t('budgetCategory.standard');
  };

  const getSustainabilityScore = () => {
    let score = 0;
    if (preferences.sustainabilityLevel === 'high') score += 40;
    if (preferences.sustainabilityLevel === 'medium') score += 20;
    if (preferences.carbonOffset) score += 30;
    score += preferences.ecoPreferences.length * 10;
    return Math.min(100, score);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {travelCatalogError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          <p className="font-medium">{t('catalogPartialBanner')}</p>
          <p className="mt-1 text-xs opacity-90">{travelCatalogError}</p>
        </div>
      ) : null}
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-start">
          <Button variant="outline" onClick={handleBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </Button>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <Brain className="w-12 h-12 text-teal-700" />
            <Sparkles className="w-5 h-5 text-orange-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-700 via-teal-600 to-orange-500 bg-clip-text text-transparent">
            {t('appTitle')}
          </h1>
        </div>
        <p className="text-xl text-gray-700">
          {t('appSubtitle')}
        </p>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
          {t('appFeatures')}
        </p>

        {/* Language Selector */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <Languages className="w-4 h-4 text-teal-700" />
          <div className="inline-flex rounded-lg border border-teal-200 bg-white p-1 shadow-sm">
            {[
              { code: 'en', label: '🇺🇸 EN', name: 'English' },
              { code: 'pt', label: '🇵🇹 PT', name: 'Português' },
              { code: 'es', label: '🇪🇸 ES', name: 'Español' },
              { code: 'fr', label: '🇫🇷 FR', name: 'Français' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLocale(lang.code)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-all
                  ${locale === lang.code
                    ? 'bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                title={lang.name}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-teal-300 text-teal-700">
            <Sparkles className="w-3.5 h-3.5" /> {t('aiEnhanced')}
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-teal-300 text-teal-700">
            <Globe className="w-3.5 h-3.5" /> {t('multiCurrency')}
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-orange-300 text-orange-700">
            <TrendingUp className="w-3.5 h-3.5" /> {t('predictiveAnalytics')}
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-orange-300 text-orange-700">
            <Shield className="w-3.5 h-3.5" /> {t('enterpriseSecurity')}
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-teal-300 text-teal-700">
            <Zap className="w-3.5 h-3.5" /> {t('realTimeProcessing')}
          </Badge>
        </div>
      </div>

      {/* AI Intelligence Dashboard */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-teal-700" />
                <CardTitle className="text-base">{t('aiIntelligenceScore')}</CardTitle>
              </div>
              <span className="text-2xl font-bold text-teal-700">{Math.round(aiScore)}%</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={aiScore} className="h-2" />
            <p className="text-xs text-gray-600 mt-2">{t('profileCompletion')}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-base">{t('travelerProfile')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-orange-900">{getTravelerType()}</p>
            <p className="text-xs text-gray-600 mt-1">{t('aiGeneratedClassification')}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <CardTitle className="text-base">{t('sustainabilityScore')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Progress value={getSustainabilityScore()} className="h-2 flex-1" />
              <span className="text-sm font-semibold text-green-600">{getSustainabilityScore()}%</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">{t('ecoImpactRating')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Steps */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center relative mb-2">
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-teal-600 to-orange-500 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative
                    ${isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg' :
                      isActive ? 'bg-gradient-to-br from-teal-600 to-orange-500 text-white scale-110 shadow-xl' :
                      'bg-gray-200 text-gray-400 group-hover:bg-gray-300'}
                  `}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    {isActive && (
                      <span className="absolute inset-0 rounded-full bg-teal-600 animate-ping opacity-20" />
                    )}
                  </div>
                  <span className={`text-xs whitespace-nowrap hidden md:block ${
                    isActive ? 'font-semibold text-teal-700' :
                    isCompleted ? 'font-medium text-green-600' :
                    'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {t('stepLabel')} {currentStep + 1} {t('of')} {totalSteps}: <span className="font-semibold text-gray-900">{steps[currentStep].label}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card className="shadow-lg">
        <CardContent className="p-6 md:p-8">
          {/* Step 0: Profile */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Users className="w-6 h-6 text-teal-700" /> {t('personalProfile')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('personalInfoDesc')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-semibold">
                    {t('fullName')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="John Smith"
                    value={preferences.fullName}
                    onChange={(e) => updatePreference('fullName', e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    {t('emailAddress')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.smith@company.com"
                    value={preferences.email}
                    onChange={(e) => updatePreference('email', e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold">
                    {t('phoneNumber')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={preferences.phone}
                    onChange={(e) => updatePreference('phone', e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm font-semibold">
                    {t('dateOfBirth')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={preferences.dateOfBirth}
                    onChange={(e) => updatePreference('dateOfBirth', e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality" className="text-sm font-semibold">
                    {t('nationality')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nationality"
                    placeholder="United States"
                    value={preferences.nationality}
                    onChange={(e) => updatePreference('nationality', e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passportNumber" className="text-sm font-semibold">
                    {t('passportNumber')}
                  </Label>
                  <Input
                    id="passportNumber"
                    placeholder="123456789"
                    value={preferences.passportNumber}
                    onChange={(e) => updatePreference('passportNumber', e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-3 bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-teal-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-teal-900">{t('enterpriseGradeSecurity')}</p>
                    <p className="text-xs text-teal-700">{t('securityDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Travel Style */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-orange-600" /> {t('travelStylePreferences')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('travelStyleDesc')}
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">{t('whatsYourTravelStyle')}</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {getTravelStylesData(t).map((style) => {
                    const Icon = style.icon;
                    const isSelected = preferences.travelStyles.includes(style.id);

                    return (
                      <button
                        key={style.id}
                        onClick={() => toggleArrayValue('travelStyles', style.id)}
                        className={`
                          relative overflow-hidden rounded-xl p-4 transition-all duration-300
                          border-2 hover:scale-105 hover:shadow-xl
                          ${isSelected
                            ? 'border-transparent shadow-lg'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }
                        `}
                      >
                        {isSelected && (
                          <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-90`} />
                        )}
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                          <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                            {style.label}
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="absolute top-2 right-2 w-5 h-5 text-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="travelFrequency" className="text-base font-semibold">{t('travelFrequency')}</Label>
                <Select value={preferences.travelFrequency} onValueChange={(value: string) => updatePreference('travelFrequency', value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t('howOftenTravel')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">🚀 Weekly Traveler (50+ trips/year)</SelectItem>
                    <SelectItem value="monthly">✈️ Monthly Traveler (12-50 trips/year)</SelectItem>
                    <SelectItem value="quarterly">🗓️ Quarterly Traveler (4-12 trips/year)</SelectItem>
                    <SelectItem value="yearly">🏖️ Occasional Traveler (1-3 trips/year)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">{t('preferredDestinations')}</Label>
                {travelCatalogLoading ? (
                  <p className="text-sm text-gray-500">{t('catalogLoading')}</p>
                ) : (travelCatalog?.airports?.length ?? 0) === 0 ? (
                  <p className="text-sm text-amber-700">
                    {travelCatalog?.configured?.duffel === false
                      ? t('catalogDuffelMissing')
                      : t('catalogAirportsEmpty')}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                    {travelCatalog!.airports.map((a) => (
                      <div
                        key={a.iataCode}
                        className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                      >
                        <Checkbox
                          id={`dest-${a.iataCode}`}
                          checked={preferences.preferredDestinations.includes(a.label)}
                          onCheckedChange={() => toggleArrayValue('preferredDestinations', a.label)}
                        />
                        <Label htmlFor={`dest-${a.iataCode}`} className="cursor-pointer text-sm font-medium flex-1">
                          {a.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">{t('travelPurpose')}</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'business', label: 'Business', icon: Briefcase },
                    { id: 'leisure', label: 'Leisure', icon: Palmtree },
                    { id: 'conference', label: 'Conference/Events', icon: Users },
                    { id: 'family', label: 'Family Visit', icon: Heart }
                  ].map(purpose => {
                    const Icon = purpose.icon;
                    const isSelected = preferences.travelPurpose.includes(purpose.id);
                    
                    return (
                      <button
                        key={purpose.id}
                        onClick={() => toggleArrayValue('travelPurpose', purpose.id)}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                          ${isSelected
                            ? 'border-teal-600 bg-teal-50 text-teal-900'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-teal-600' : 'text-gray-600'}`} />
                        <span className="text-sm font-medium">{purpose.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Budget */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-teal-700" /> {t('budgetFinancialPreferences')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('multiCurrencySupport')}
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      {t('preferredCurrency')}
                    </Label>
                  </div>
                  <Select value={preferences.currency} onValueChange={(value: string) => updatePreference('currency', value)}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(curr => (
                        <SelectItem key={curr.code} value={curr.code}>
                          <span className="flex items-center gap-2">
                            <span className="text-lg">{curr.flag}</span>
                            <span>{curr.symbol} {curr.code}</span>
                            <span className="text-gray-500">- {curr.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">{t('budgetRangePerTrip')}</Label>
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 space-y-4">
                    <Slider
                      min={1000}
                      max={50000}
                      step={500}
                      value={preferences.budgetRange}
                      onValueChange={(value: number[]) => updatePreference('budgetRange', value)}
                      className="w-full"
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-center bg-white rounded-lg px-4 py-3 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">{t('minimum')}</p>
                        <p className="text-xl font-bold text-green-600">
                          {currencies.find(c => c.code === preferences.currency)?.symbol}
                          {preferences.budgetRange[0].toLocaleString()}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                      <div className="text-center bg-white rounded-lg px-4 py-3 shadow-sm">
                        <p className="text-xs text-gray-600 mb-1">{t('maximum')}</p>
                        <p className="text-xl font-bold text-blue-600">
                          {currencies.find(c => c.code === preferences.currency)?.symbol}
                          {preferences.budgetRange[1].toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-center pt-2">
                      <Badge variant="secondary" className="text-sm px-4 py-1">
                        {t('category')}: {getBudgetCategory()}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="budgetPriority" className="text-base font-semibold">{t('budgetPriority')}</Label>
                  <Select value={preferences.budgetPriority} onValueChange={(value: string) => updatePreference('budgetPriority', value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder={t('budgetPriorityQuestion')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maximum-savings">💰 Maximum Savings - Best deals only</SelectItem>
                      <SelectItem value="value">⚖️ Value-Focused - Balance of quality and price</SelectItem>
                      <SelectItem value="balanced">🎯 Balanced - Quality matters, price flexible</SelectItem>
                      <SelectItem value="premium">⭐ Premium - High quality, price less important</SelectItem>
                      <SelectItem value="luxury">💎 Luxury - Best available, budget unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="cabinClass" className="text-base font-semibold">{t('preferredFlightCabin')}</Label>
                  <p className="text-xs text-gray-500">{t('cabinDuffelNote')}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(travelCatalog?.duffelCabinClasses?.length
                      ? travelCatalog.duffelCabinClasses
                      : [
                          { value: 'economy', label: 'Economy' },
                          { value: 'premium_economy', label: 'Premium Economy' },
                          { value: 'business', label: 'Business' },
                          { value: 'first', label: 'First' },
                        ]
                    ).map((cabin) => (
                      <button
                        key={cabin.value}
                        type="button"
                        onClick={() => updatePreference('cabinClass', cabin.value)}
                        className={`
                          p-4 rounded-lg border-2 transition-all text-center
                          ${preferences.cabinClass === cabin.value
                            ? 'border-teal-600 bg-teal-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                          }
                        `}
                      >
                        <div className="text-2xl mb-2">{cabinClassEmoji(cabin.value)}</div>
                        <div className="text-sm font-semibold">{cabin.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-600" /> {t('flightAccommodationPreferences')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('fineTunePreferences')}
                </p>
              </div>

              <Tabs defaultValue="flight" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger value="flight" className="gap-2">
                    <Plane className="w-4 h-4" />
                    {t('flightPreferences')}
                  </TabsTrigger>
                  <TabsTrigger value="accommodation" className="gap-2">
                    <Hotel className="w-4 h-4" />
                    {t('accommodation')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="flight" className="space-y-6 mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="seatPreference" className="text-base font-semibold">{t('seatPreference')}</Label>
                      <Select value={preferences.seatPreference} onValueChange={(value: string) => updatePreference('seatPreference', value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t('selectSeatPreference')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="window">🪟 Window - Enjoy the view</SelectItem>
                          <SelectItem value="aisle">🚶 Aisle - Easy access</SelectItem>
                          <SelectItem value="middle">📦 Middle - Don't mind</SelectItem>
                          <SelectItem value="any">🎲 No Preference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="mealPreference" className="text-base font-semibold">{t('mealPreference')}</Label>
                      <Select value={preferences.mealPreference} onValueChange={(value: string) => updatePreference('mealPreference', value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t('selectMealPreference')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular">🍽️ Regular</SelectItem>
                          <SelectItem value="vegetarian">🥗 Vegetarian</SelectItem>
                          <SelectItem value="vegan">🌱 Vegan</SelectItem>
                          <SelectItem value="halal">🕌 Halal</SelectItem>
                          <SelectItem value="kosher">✡️ Kosher</SelectItem>
                          <SelectItem value="gluten-free">🌾 Gluten-Free</SelectItem>
                          <SelectItem value="low-sodium">🧂 Low Sodium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">{t('loyaltyPrograms')}</Label>
                    {travelCatalogLoading ? (
                      <p className="text-sm text-gray-500">{t('catalogLoading')}</p>
                    ) : (travelCatalog?.loyaltyProgrammes?.length ?? 0) === 0 ? (
                      <p className="text-sm text-amber-700">
                        {travelCatalog?.configured?.duffel === false
                          ? t('catalogDuffelMissing')
                          : t('catalogLoyaltyEmpty')}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                        {travelCatalog!.loyaltyProgrammes.map((program) => (
                          <div
                            key={program.id}
                            className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                          >
                            <Checkbox
                              id={`loyalty-${program.id}`}
                              checked={preferences.loyaltyPrograms.includes(program.id)}
                              onCheckedChange={() => toggleArrayValue('loyaltyPrograms', program.id)}
                            />
                            <Label htmlFor={`loyalty-${program.id}`} className="cursor-pointer text-sm font-medium flex-1">
                              {program.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="accommodation" className="space-y-6 mt-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">{t('accommodationType')}</Label>
                    {travelCatalogLoading ? (
                      <p className="text-sm text-gray-500">{t('catalogLoading')}</p>
                    ) : (travelCatalog?.accommodations?.length ?? 0) === 0 ? (
                      <p className="text-sm text-amber-700">
                        {travelCatalog?.configured?.hotelbeds === false
                          ? t('catalogHotelbedsMissing')
                          : t('catalogHotelbedsEmpty')}
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                        {travelCatalog!.accommodations.map((type) => (
                          <div
                            key={type.code}
                            className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                          >
                            <Checkbox
                              id={`accom-${type.code}`}
                              checked={preferences.accommodationType.includes(type.code)}
                              onCheckedChange={() => toggleArrayValue('accommodationType', type.code)}
                            />
                            <Label htmlFor={`accom-${type.code}`} className="cursor-pointer text-sm font-medium">
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="roomType" className="text-base font-semibold">{t('roomType')}</Label>
                    <Select value={preferences.roomType} onValueChange={(value: string) => updatePreference('roomType', value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={t('selectRoomType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">🛏️ Single Room</SelectItem>
                        <SelectItem value="double">🛏️🛏️ Double Room</SelectItem>
                        <SelectItem value="twin">👥 Twin Room</SelectItem>
                        <SelectItem value="suite">🏰 Suite</SelectItem>
                        <SelectItem value="executive">💼 Executive Suite</SelectItem>
                        <SelectItem value="presidential">👑 Presidential Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">{t('requiredAmenities')}</Label>
                    <p className="text-xs text-gray-500">{t('amenitiesHotelbedsNote')}</p>
                    {travelCatalogLoading ? (
                      <p className="text-sm text-gray-500">{t('catalogLoading')}</p>
                    ) : (travelCatalog?.facilities?.length ?? 0) === 0 ? (
                      <p className="text-sm text-amber-700">
                        {travelCatalog?.configured?.hotelbeds === false
                          ? t('catalogHotelbedsMissing')
                          : t('catalogHotelbedsEmpty')}
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                        {travelCatalog!.facilities.map((amenity) => (
                          <div
                            key={amenity.code}
                            className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                          >
                            <Checkbox
                              id={`amenity-${amenity.code}`}
                              checked={preferences.amenities.includes(amenity.code)}
                              onCheckedChange={() => toggleArrayValue('amenities', amenity.code)}
                            />
                            <Label htmlFor={`amenity-${amenity.code}`} className="cursor-pointer text-sm font-medium">
                              {amenity.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">{t('preferredHotelChains')}</Label>
                    {travelCatalogLoading ? (
                      <p className="text-sm text-gray-500">{t('catalogLoading')}</p>
                    ) : (travelCatalog?.chains?.length ?? 0) === 0 ? (
                      <p className="text-sm text-amber-700">
                        {travelCatalog?.configured?.hotelbeds === false
                          ? t('catalogHotelbedsMissing')
                          : t('catalogHotelbedsEmpty')}
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
                        {travelCatalog!.chains.map((chain) => (
                          <div
                            key={chain.code}
                            className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                          >
                            <Checkbox
                              id={`chain-${chain.code}`}
                              checked={preferences.hotelChain.includes(chain.code)}
                              onCheckedChange={() => toggleArrayValue('hotelChain', chain.code)}
                            />
                            <Label htmlFor={`chain-${chain.code}`} className="cursor-pointer text-sm font-medium">
                              {chain.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 4: Activities */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Palmtree className="w-6 h-6 text-green-600" /> {t('activitiesExperiences')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('aiCurateExperiences')}
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">{t('preferredActivities')}</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {activityTypesData.map((activity) => {
                    const Icon = activity.icon;
                    const isSelected = preferences.activityTypes.includes(activity.id);
                    
                    return (
                      <button
                        key={activity.id}
                        onClick={() => toggleArrayValue('activityTypes', activity.id)}
                        className={`
                          p-4 rounded-lg border-2 transition-all hover:scale-105
                          ${isSelected 
                            ? 'border-green-600 bg-green-50 shadow-lg' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }
                        `}
                      >
                        <Icon className={`w-6 h-6 mb-2 mx-auto ${isSelected ? 'text-green-600' : 'text-gray-600'}`} />
                        <span className={`text-xs font-semibold block ${isSelected ? 'text-green-900' : 'text-gray-900'}`}>
                          {activity.label}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-green-600 mx-auto mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="pacePreference" className="text-base font-semibold">{t('travelPace')}</Label>
                <Select value={preferences.pacePreference} onValueChange={(value: string) => updatePreference('pacePreference', value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t('selectPreferredPace')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relaxed">🧘 Relaxed - Minimal activities, maximum relaxation</SelectItem>
                    <SelectItem value="moderate">⚖️ Moderate - Balanced mix of activities and downtime</SelectItem>
                    <SelectItem value="active">🏃 Active - Packed schedule with multiple activities</SelectItem>
                    <SelectItem value="adventure">🚀 Adventure - High-energy, thrill-seeking experiences</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">{t('experienceTypes')}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Guided Tours', 'Self-Guided', 'Group Activities', 'Private Experiences',
                    'Local Immersion', 'Luxury Experiences', 'Budget-Friendly', 'Off-the-beaten-path'
                  ].map(experience => (
                    <div key={experience} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <Checkbox
                        id={`experience-${experience}`}
                        checked={preferences.experienceTypes.includes(experience)}
                        onCheckedChange={() => toggleArrayValue('experienceTypes', experience)}
                      />
                      <Label htmlFor={`experience-${experience}`} className="cursor-pointer text-sm font-medium">
                        {experience}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {t('languagesYouSpeak')}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {languagesData.map(language => {
                    const isSelected = preferences.languages.some(l => l.language === language);
                    
                    return (
                      <button
                        key={language}
                        onClick={() => {
                          if (isSelected) {
                            updatePreference('languages', preferences.languages.filter(l => l.language !== language));
                          } else {
                            updatePreference('languages', [...preferences.languages, { language, proficiency: 'intermediate' }]);
                          }
                        }}
                        className={`
                          p-3 rounded-lg border-2 transition-all text-sm font-medium
                          ${isSelected
                            ? 'border-teal-600 bg-teal-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }
                        `}
                      >
                        {language}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Special Requirements */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-red-600" /> {t('specialRequirementsNeeds')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('ensureSafeComfortable')}
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">{t('dietaryRestrictions')}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Lactose-Free', 'Nut Allergy', 'Seafood Allergy', 'Dairy-Free', 'Low Carb', 'Diabetic', 'No Restrictions'].map(diet => (
                      <div key={diet} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <Checkbox
                          id={`diet-${diet}`}
                          checked={preferences.dietaryRestrictions.includes(diet)}
                          onCheckedChange={() => toggleArrayValue('dietaryRestrictions', diet)}
                        />
                        <Label htmlFor={`diet-${diet}`} className="cursor-pointer text-sm font-medium">
                          {diet}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">{t('accessibilityRequirements')}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Wheelchair Access', 'Visual Assistance', 'Hearing Assistance', 'Mobility Support', 'Service Animal', 'Special Equipment'].map(access => (
                      <div key={access} className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <Checkbox
                          id={`access-${access}`}
                          checked={preferences.accessibility.includes(access)}
                          onCheckedChange={() => toggleArrayValue('accessibility', access)}
                        />
                        <Label htmlFor={`access-${access}`} className="cursor-pointer text-sm font-medium">
                          {access}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="medicalConditions" className="text-base font-semibold">
                    {t('medicalConditionsNotes')}
                  </Label>
                  <Textarea
                    id="medicalConditions"
                    placeholder={t('medicalPlaceholder')}
                    value={preferences.medicalConditions}
                    onChange={(e) => updatePreference('medicalConditions', e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500">{t('confidentialEncrypted')}</p>
                </div>

                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-600" />
                      {t('sustainabilityPreferences')}
                    </CardTitle>
                    <CardDescription>{t('helpEnvironmentallyResponsible')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="sustainabilityLevel" className="text-base font-semibold">{t('sustainabilityPriority')}</Label>
                      <Select value={preferences.sustainabilityLevel} onValueChange={(value: string) => updatePreference('sustainabilityLevel', value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Not a priority</SelectItem>
                          <SelectItem value="medium">Medium - Important but flexible</SelectItem>
                          <SelectItem value="high">High - Essential consideration</SelectItem>
                          <SelectItem value="essential">Essential - Top priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-semibold">{t('ecoPreferences')}</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Carbon Offsetting', 'Eco-Certified Hotels', 'Public Transportation', 'Local Businesses', 'Plastic-Free', 'Sustainable Tours'].map(eco => (
                          <div key={eco} className="flex items-center space-x-2 bg-white rounded-lg p-3 hover:bg-green-50 transition-colors">
                            <Checkbox
                              id={`eco-${eco}`}
                              checked={preferences.ecoPreferences.includes(eco)}
                              onCheckedChange={() => toggleArrayValue('ecoPreferences', eco)}
                            />
                            <Label htmlFor={`eco-${eco}`} className="cursor-pointer text-sm font-medium">
                              {eco}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white rounded-lg p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="carbonOffset" className="font-semibold">{t('automaticCarbonOffset')}</Label>
                        <p className="text-xs text-gray-600">{t('offsetCO2Flights')}</p>
                      </div>
                      <Switch
                        id="carbonOffset"
                        checked={preferences.carbonOffset}
                        onCheckedChange={(checked: boolean) => updatePreference('carbonOffset', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 6: Advanced Settings */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-600" /> {t('advancedSettingsAI')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('customizeAIExperience')}
                </p>
              </div>

              <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 via-cyan-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Brain className="w-6 h-6 text-teal-700" />
                    {t('aiPoweredFeatures')}
                  </CardTitle>
                  <CardDescription>
                    {t('leverageEnterpriseAI')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                    <div className="space-y-1 flex-1">
                      <Label htmlFor="aiRecommendations" className="font-semibold text-base">
                        {t('enableAIRecommendations')}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {t('aiRecommendationsDesc')}
                      </p>
                      <div className="flex gap-2 pt-2">
                        <Badge variant="secondary" className="text-xs">Predictive Analytics</Badge>
                        <Badge variant="secondary" className="text-xs">Machine Learning</Badge>
                        <Badge variant="secondary" className="text-xs">Real-time Optimization</Badge>
                      </div>
                    </div>
                    <Switch
                      id="aiRecommendations"
                      checked={preferences.aiRecommendations}
                      onCheckedChange={(checked: boolean) => updatePreference('aiRecommendations', checked)}
                      className="ml-4"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                    <div className="space-y-1 flex-1">
                      <Label htmlFor="dataSharing" className="font-semibold text-base">
                        {t('enhancedDataAnalysis')}
                      </Label>
                      <p className="text-sm text-gray-600">
                        {t('enhancedDataDesc')}
                      </p>
                      <p className="text-xs text-gray-500 pt-1">
                        {t('dataAnonymized')}
                      </p>
                    </div>
                    <Switch
                      id="dataSharing"
                      checked={preferences.dataSharing}
                      onCheckedChange={(checked: boolean) => updatePreference('dataSharing', checked)}
                      className="ml-4"
                    />
                  </div>

                  {preferences.aiRecommendations && (
                    <div className="bg-gradient-to-r from-teal-100 to-orange-100 rounded-lg p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-teal-900">{t('aiIntelligenceActivated')}</p>
                          <p className="text-sm text-teal-800 mt-1">
                            {t('profileAnalyzed')}
                          </p>
                          <ul className="text-sm text-teal-800 mt-2 space-y-1 ml-4">
                            <li>• {t('personalizedDestinations')}</li>
                            <li>• {t('dynamicPricing')}</li>
                            <li>• {t('predictivePlanning')}</li>
                            <li>• {t('realtimeAdjustments')}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-600" />
                    {t('notificationPreferences')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { id: 'email', label: 'Email Notifications', desc: 'Booking confirmations, itinerary updates' },
                    { id: 'sms', label: 'SMS Alerts', desc: 'Flight changes, urgent travel updates' },
                    { id: 'push', label: 'Push Notifications', desc: 'Real-time travel alerts' },
                    { id: 'whatsapp', label: 'WhatsApp Messages', desc: 'Travel documents and reminders' }
                  ].map(notif => (
                    <div key={notif.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                      <Checkbox
                        id={`notif-${notif.id}`}
                        checked={preferences.notifications.includes(notif.id)}
                        onCheckedChange={() => toggleArrayValue('notifications', notif.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`notif-${notif.id}`} className="cursor-pointer font-medium">
                          {notif.label}
                        </Label>
                        <p className="text-xs text-gray-600">{notif.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-gray-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-600" />
                    {t('privacySecurity')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="privacyLevel" className="text-base font-semibold">{t('privacyLevel')}</Label>
                    <Select value={preferences.privacyLevel} onValueChange={(value: string) => updatePreference('privacyLevel', value)}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal - Maximum data usage for best experience</SelectItem>
                        <SelectItem value="standard">Standard - Balanced privacy and functionality</SelectItem>
                        <SelectItem value="high">High - Enhanced privacy, limited data sharing</SelectItem>
                        <SelectItem value="maximum">Maximum - Strict privacy, minimal data collection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                      <Shield className="w-4 h-4 text-green-600" />
                      {t('securityCertifications')}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">SOC 2 Type II</Badge>
                      <Badge variant="outline">ISO 27001</Badge>
                      <Badge variant="outline">GDPR Compliant</Badge>
                      <Badge variant="outline">CCPA Compliant</Badge>
                      <Badge variant="outline">PCI DSS</Badge>
                    </div>
                    <p className="text-xs text-gray-600 pt-2">
                      {t('allDataEncrypted')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              size="lg"
              className="gap-2"
            >
              ← {t('previous')}
            </Button>

            {currentStep < totalSteps - 1 ? (
              <Button
                onClick={() => setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1))}
                size="lg"
                className="gap-2 bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600"
              >
                {t('nextStep')} →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                size="lg"
                className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isProcessing ? (
                  <>
                    <Brain className="w-5 h-5 animate-pulse" />
                    {t('processingWithAI')}
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    {t('completeProfile')}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Panel */}
      <Card className="border-2 border-teal-300 bg-gradient-to-br from-teal-50 via-cyan-50 to-orange-50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-orange-600" />
            {t('aiGeneratedInsights')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('realtimeAnalysis')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">{t('travelerType.label')}</p>
              <p className="font-bold text-lg text-teal-900">{getTravelerType()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">{t('budgetCategory.label')}</p>
              <p className="font-bold text-lg text-orange-900">{getBudgetCategory()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">{t('travelStyle')}</p>
              <p className="font-bold text-lg text-teal-900">
                {preferences.travelStyles.length > 0
                  ? getTravelStylesData(t).find(s => s.id === preferences.travelStyles[0])?.label
                  : 'Not Set'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">{t('ecoScore')}</p>
              <p className="font-bold text-lg text-emerald-900">{getSustainabilityScore()}%</p>
            </div>
          </div>

          {aiInsightsEnabled && (
            <div className="mt-4 bg-gradient-to-r from-teal-100 via-cyan-100 to-orange-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-teal-700 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-teal-900 mb-2">{t('aiRecommendationsReady')}</p>
                  {aiInsightsLoading ? (
                    <p className="text-sm text-teal-800">{t('processingWithAI')}</p>
                  ) : aiInsightsError ? (
                    <p className="text-sm text-red-700">{aiInsightsError}</p>
                  ) : aiInsightsText ? (
                    <p className="text-sm text-teal-800 whitespace-pre-line">{aiInsightsText}</p>
                  ) : (
                    <p className="text-sm text-teal-800">
                      {t('basedOnProfile')} {preferences.preferredDestinations[0] || 'Europe'}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center gap-8 flex-wrap text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span>SOC 2 Certified</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-teal-700" />
          <span>256-bit Encryption</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-700" />
          <span>GDPR Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-orange-600" />
          <span>ISO 27001</span>
        </div>
      </div>
    </div>
  );
}
