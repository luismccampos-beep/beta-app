import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { useLocale, useTranslations } from 'next-intl';

type CheckedState = boolean | 'indeterminate';
import {
  Mail,
  Lock,
  User,
  Globe,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Languages,
  Moon,
  Sun
} from 'lucide-react';
import { toast } from 'sonner';

type Language = 'en' | 'pt' | 'es' | 'fr';

interface AuthTranslations {
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
const translations: AuthTranslations = {
  hero: {
    en: 'Discover Your Perfect Trip with AI',
    pt: 'Descubra a Sua Viagem Perfeita com IA',
    es: 'Descubre Tu Viaje Perfecto con IA',
    fr: 'Découvrez Votre Voyage Parfait avec l\'IA'
  },
  heroDesc: {
    en: 'Experience personalized travel recommendations with artificial intelligence',
    pt: 'Experimente recomendações de viagem personalizadas com inteligência artificial',
    es: 'Experimenta recomendaciones de viaje personalizadas con inteligencia artificial',
    fr: 'Découvrez des recommandations de voyage personnalisées avec l\'intelligence artificielle'
  },
  welcomeBack: {
    en: 'Welcome Back',
    pt: 'Bem-vindo de Volta',
    es: 'Bienvenido de Nuevo',
    fr: 'Bon Retour'
  },
  loginDesc: {
    en: 'Sign in to access your personalized travel dashboard',
    pt: 'Entre para acessar seu painel de viagens personalizado',
    es: 'Inicia sesión para acceder a tu panel de viajes personalizado',
    fr: 'Connectez-vous pour accéder à votre tableau de bord de voyage personnalisé'
  },
  createAccount: {
    en: 'Create Account',
    pt: 'Criar Conta',
    es: 'Crear Cuenta',
    fr: 'Créer un Compte'
  },
  registerDesc: {
    en: 'Join thousands of travelers using AI-powered travel planning',
    pt: 'Junte-se a milhares de viajantes usando planejamento de viagens com IA',
    es: 'Únete a miles de viajeros usando planificación de viajes con IA',
    fr: 'Rejoignez des milliers de voyageurs utilisant la planification de voyage avec IA'
  },
  login: {
    en: 'Login',
    pt: 'Entrar',
    es: 'Iniciar Sesión',
    fr: 'Connexion'
  },
  register: {
    en: 'Register',
    pt: 'Registrar',
    es: 'Registrarse',
    fr: 'S\'inscrire'
  },
  email: {
    en: 'Email',
    pt: 'Email',
    es: 'Correo Electrónico',
    fr: 'Email'
  },
  emailPlaceholder: {
    en: 'your.email@example.com',
    pt: 'seu.email@exemplo.com',
    es: 'tu.email@ejemplo.com',
    fr: 'votre.email@exemple.com'
  },
  password: {
    en: 'Password',
    pt: 'Senha',
    es: 'Contraseña',
    fr: 'Mot de Passe'
  },
  passwordPlaceholder: {
    en: 'Enter your password',
    pt: 'Digite sua senha',
    es: 'Ingresa tu contraseña',
    fr: 'Entrez votre mot de passe'
  },
  confirmPassword: {
    en: 'Confirm Password',
    pt: 'Confirmar Senha',
    es: 'Confirmar Contraseña',
    fr: 'Confirmer le Mot de Passe'
  },
  confirmPasswordPlaceholder: {
    en: 'Re-enter your password',
    pt: 'Digite sua senha novamente',
    es: 'Vuelve a ingresar tu contraseña',
    fr: 'Ressaisissez votre mot de passe'
  },
  fullName: {
    en: 'Full Name',
    pt: 'Nome Completo',
    es: 'Nombre Completo',
    fr: 'Nom Complet'
  },
  fullNamePlaceholder: {
    en: 'John Smith',
    pt: 'João Silva',
    es: 'Juan García',
    fr: 'Jean Dupont'
  },
  phoneNumber: {
    en: 'Phone Number',
    pt: 'Número de Telefone',
    es: 'Número de Teléfono',
    fr: 'Numéro de Téléphone'
  },
  phonePlaceholder: {
    en: '+1 (555) 123-4567',
    pt: '+351 912 345 678',
    es: '+34 612 345 678',
    fr: '+33 6 12 34 56 78'
  },
  rememberMe: {
    en: 'Remember me',
    pt: 'Lembrar-me',
    es: 'Recuérdame',
    fr: 'Se souvenir de moi'
  },
  forgotPassword: {
    en: 'Forgot password?',
    pt: 'Esqueceu a senha?',
    es: '¿Olvidaste tu contraseña?',
    fr: 'Mot de passe oublié?'
  },
  signIn: {
    en: 'Sign In',
    pt: 'Entrar',
    es: 'Iniciar Sesión',
    fr: 'Se Connecter'
  },
  signUp: {
    en: 'Sign Up',
    pt: 'Cadastrar',
    es: 'Registrarse',
    fr: 'S\'inscrire'
  },
  dontHaveAccount: {
    en: "Don't have an account?",
    pt: 'Não tem uma conta?',
    es: '¿No tienes una cuenta?',
    fr: 'Vous n\'avez pas de compte?'
  },
  alreadyHaveAccount: {
    en: 'Already have an account?',
    pt: 'Já tem uma conta?',
    es: '¿Ya tienes una cuenta?',
    fr: 'Vous avez déjà un compte?'
  },
  signInHere: {
    en: 'Sign in here',
    pt: 'Entre aqui',
    es: 'Inicia sesión aquí',
    fr: 'Connectez-vous ici'
  },
  createOne: {
    en: 'Create one',
    pt: 'Criar uma',
    es: 'Crear una',
    fr: 'En créer un'
  },
  agreeToTerms: {
    en: 'I agree to the Terms of Service and Privacy Policy',
    pt: 'Concordo com os Termos de Serviço e Política de Privacidade',
    es: 'Acepto los Términos de Servicio y la Política de Privacidad',
    fr: 'J\'accepte les Conditions d\'utilisation et la Politique de confidentialité'
  },
  continueWith: {
    en: 'Or continue with',
    pt: 'Ou continue com',
    es: 'O continúa con',
    fr: 'Ou continuez avec'
  },
  loginSuccess: {
    en: 'Login successful! Welcome back.',
    pt: 'Login bem-sucedido! Bem-vindo de volta.',
    es: 'Inicio de sesión exitoso! Bienvenido de nuevo.',
    fr: 'Connexion réussie! Bon retour.'
  },
  registerSuccess: {
    en: 'Account created successfully! Welcome to AKMLEVA.',
    pt: 'Conta criada com sucesso! Bem-vindo ao AKMLEVA.',
    es: 'Cuenta creada con éxito! Bienvenido a AKMLEVA.',
    fr: 'Compte créé avec succès! Bienvenue sur AKMLEVA.'
  },
  emailRequired: {
    en: 'Please enter your email',
    pt: 'Por favor, insira seu email',
    es: 'Por favor, ingresa tu correo electrónico',
    fr: 'Veuillez entrer votre email'
  },
  passwordRequired: {
    en: 'Please enter your password',
    pt: 'Por favor, insira sua senha',
    es: 'Por favor, ingresa tu contraseña',
    fr: 'Veuillez entrer votre mot de passe'
  },
  passwordsMatch: {
    en: 'Passwords do not match',
    pt: 'As senhas não coincidem',
    es: 'Las contraseñas no coinciden',
    fr: 'Les mots de passe ne correspondent pas'
  },
  termsRequired: {
    en: 'You must accept the terms and conditions',
    pt: 'Você deve aceitar os termos e condições',
    es: 'Debes aceptar los términos y condiciones',
    fr: 'Vous devez accepter les termes et conditions'
  },
  secureLogin: {
    en: 'Secure Login',
    pt: 'Login Seguro',
    es: 'Inicio de Sesión Seguro',
    fr: 'Connexion Sécurisée'
  },
  encryptedConnection: {
    en: '256-bit encrypted connection',
    pt: 'Conexão criptografada de 256 bits',
    es: 'Conexión cifrada de 256 bits',
    fr: 'Connexion cryptée 256 bits'
  },
  enterpriseSecurity: {
    en: 'Enterprise-grade security',
    pt: 'Segurança de nível empresarial',
    es: 'Seguridad de nivel empresarial',
    fr: 'Sécurité de niveau entreprise'
  },
  countriesSupported: {
    en: '190+ countries supported',
    pt: '190+ países suportados',
    es: '190+ países soportados',
    fr: '190+ pays pris en charge'
  },
  aiRecommendations: {
    en: 'AI-powered recommendations',
    pt: 'Recomendações com IA',
    es: 'Recomendaciones con IA',
    fr: 'Recommandations IA'
  },
  freeAccount: {
    en: 'Free account',
    pt: 'Conta gratuita',
    es: 'Cuenta gratis',
    fr: 'Compte gratuit'
  },
  aiPoweredRecommendations: {
    en: 'AI-powered recommendations',
    pt: 'Recomendações com IA',
    es: 'Recomendaciones con IA',
    fr: 'Recommandations IA'
  },
  accessDestinations: {
    en: 'Access to 190+ destinations',
    pt: 'Acesso a 190+ destinos',
    es: 'Acceso a 190+ destinos',
    fr: 'Accès à 190+ destinations'
  }
};

interface AuthPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
  onNavigateToLegal?: (pageType: 'terms' | 'privacy' | 'gdpr' | 'cancellations') => void;
}

export function AuthPage({ onLoginSuccess, onBackToHome, onNavigateToLegal }: AuthPageProps) {
  const locale = useLocale();
  const t = useTranslations('auth');
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const setLocale = (nextLocale: string) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail) {
      toast.error(t('emailRequired'));
      return;
    }
    if (!loginPassword) {
      toast.error(t('passwordRequired'));
      return;
    }

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
        if (!res.ok || data.success === false) {
          throw new Error(data.message || 'Login failed');
        }
        toast.success(t('loginSuccess'));
        onLoginSuccess();
      })
      .catch((err: unknown) => {
        toast.error(err instanceof Error ? err.message : 'Login failed');
      });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerEmail) {
      toast.error(t('emailRequired'));
      return;
    }
    if (!registerPassword) {
      toast.error(t('passwordRequired'));
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      toast.error(t('passwordsMatch'));
      return;
    }
    if (!agreeToTerms) {
      toast.error(t('termsRequired'));
      return;
    }

    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: registerEmail,
        password: registerPassword,
        name: registerName,
        phone: registerPhone,
        agreeToTerms,
      }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
        if (!res.ok || data.success === false) {
          throw new Error(data.message || 'Registration failed');
        }
        toast.success(t('registerSuccess'));
        onLoginSuccess();
      })
      .catch((err: unknown) => {
        toast.error(err instanceof Error ? err.message : 'Registration failed');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors flex items-center justify-center p-4">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="text-2xl font-bold bg-gradient-to-r from-teal-700 via-teal-600 to-orange-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              AKMLEVA
            </button>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg border border-teal-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors"
                title={isDark ? t('header.lightMode') : t('header.darkMode')}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-orange-500" />
                ) : (
                  <Moon className="w-5 h-5 text-teal-700" />
                )}
              </button>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <div className="inline-flex rounded-lg border border-teal-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-1 shadow-sm">
                  {[
                    { code: 'en', label: '🇺🇸', name: 'English' },
                    { code: 'pt', label: '🇵🇹', name: 'Português' },
                    { code: 'es', label: '🇪🇸', name: 'Español' },
                    { code: 'fr', label: '🇫🇷', name: 'Français' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLocale(lang.code)}
                      className={`
                        px-3 py-1.5 text-sm font-medium rounded-md transition-all
                        ${locale === lang.code
                          ? 'bg-gradient-to-r from-teal-600 to-orange-500 text-white shadow-md'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                      title={lang.name}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto mt-20 grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-teal-200 dark:border-gray-600 rounded-full px-4 py-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-teal-900 dark:text-teal-300">AI-Powered Travel</span>
            </div>

            <h1 className="text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('hero')}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('heroDesc')}
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Shield, key: 'enterpriseSecurity' },
              { icon: Globe, key: 'countriesSupported' },
              { icon: Sparkles, key: 'aiRecommendations' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t(item.key)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-2xl dark:bg-gray-800">
          <CardHeader>
            <Tabs
              value={activeTab}
              onValueChange={(v: string) => {
                if (v === 'login' || v === 'register') setActiveTab(v);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="login" className="text-base">
                  {t('login')}
                </TabsTrigger>
                <TabsTrigger value="register" className="text-base">
                  {t('register')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2 text-center pb-4">
                  <CardTitle className="text-2xl dark:text-white">{t('welcomeBack')}</CardTitle>
                  <CardDescription className="dark:text-gray-400">{t('loginDesc')}</CardDescription>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="dark:text-gray-200">{t('email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="dark:text-gray-200">{t('password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('passwordPlaceholder')}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked: CheckedState) => setRememberMe(checked === true)}
                      />
                      <Label htmlFor="remember" className="text-sm cursor-pointer dark:text-gray-300">
                        {t('rememberMe')}
                      </Label>
                    </div>
                    <button type="button" className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium">
                      {t('forgotPassword')}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 text-base gap-2"
                >
                  {t('signIn')}
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">{t('continueWith')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button type="button" variant="outline" className="h-11 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button type="button" variant="outline" className="h-11 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>

                <div className="bg-teal-50 dark:bg-gray-700 border border-teal-200 dark:border-gray-600 rounded-lg p-3 flex items-start gap-2">
                  <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-teal-900 dark:text-teal-300">{t('secureLogin')}</p>
                    <p className="text-xs text-teal-700 dark:text-teal-400">{t('encryptedConnection')}</p>
                  </div>
                </div>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2 text-center pb-4">
                  <CardTitle className="text-2xl dark:text-white">{t('createAccount')}</CardTitle>
                  <CardDescription className="dark:text-gray-400">{t('registerDesc')}</CardDescription>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="dark:text-gray-200">{t('fullName')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder={t('fullNamePlaceholder')}
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="pl-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="dark:text-gray-200">{t('email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder={t('emailPlaceholder')}
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone" className="dark:text-gray-200">{t('phoneNumber')}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder={t('phonePlaceholder')}
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        className="pl-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="dark:text-gray-200">{t('password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('passwordPlaceholder')}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="dark:text-gray-200">{t('confirmPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t('confirmPasswordPlaceholder')}
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked: CheckedState) => setAgreeToTerms(checked === true)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer dark:text-gray-300 leading-relaxed">
                      I agree to the{' '}
                      {onNavigateToLegal ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onNavigateToLegal('terms')}
                            className="text-teal-600 dark:text-teal-400 hover:underline"
                          >
                            Terms of Service
                          </button>
                          {' '}and{' '}
                          <button
                            type="button"
                            onClick={() => onNavigateToLegal('privacy')}
                            className="text-teal-600 dark:text-teal-400 hover:underline"
                          >
                            Privacy Policy
                          </button>
                        </>
                      ) : (
                        t('agreeToTerms')
                      )}
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 text-base gap-2"
                >
                  {t('signUp')}
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <div className="bg-teal-50 dark:bg-gray-700 border border-teal-200 dark:border-gray-600 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs text-gray-700 dark:text-gray-300">✓ {t('freeAccount')}</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300">✓ {t('aiPoweredRecommendations')}</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300">✓ {t('accessDestinations')}</p>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
