import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLocale, useTranslations } from 'next-intl';
import {
  mergeDashboardProfileFromSources,
  profileFieldsFromMeUser,
  type MeUserProfile,
} from '../../../lib/user/account-profile';
import {
  User,
  Plane,
  Calendar,
  MapPin,
  CreditCard,
  Settings,
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  Save,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Palmtree,
  Hotel,
  Utensils,
} from 'lucide-react';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { AppHeader } from '../AppHeader';

type TabType = 'bookings' | 'history' | 'profile' | 'preferences';

type SavedPreferences = {
  budgetRange?: number[];
  currency?: string;
  preferredDestinations?: string[];
  travelStyles?: string[];
  accommodationType?: string[];
  activityTypes?: string[];
  dietaryRestrictions?: string[];
};

interface DashboardPageProps {
  onBack: () => void;
  onNewBooking?: () => void;
  initialTab?: TabType;
}

interface Booking {
  id: string;
  destination: string;
  dates: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: string;
  type: string;
  bookingDate: string;
}

interface TravelHistory {
  id: string;
  destination: string;
  dates: string;
  rating: number;
  type: string;
}

export function DashboardPage({ onBack, onNewBooking, initialTab }: DashboardPageProps) {
  const locale = useLocale();
  const t = useTranslations('dashboard');
  const [activeTab, setActiveTab] = useState<TabType>(initialTab ?? 'bookings');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savedPreferences, setSavedPreferences] = useState<SavedPreferences | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [hbAccommodationLabels, setHbAccommodationLabels] = useState<Record<string, string>>({});

  const [avatarReady, setAvatarReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAvatarReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    nationalIdNumber: '',
    taxIdNumber: '',
    address: '',
  });

  useEffect(() => {
    if (activeTab !== 'preferences') return;
    fetch(`/api/travel/catalog?locale=${encodeURIComponent(locale)}`)
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as {
          accommodations?: { code: string; label: string }[];
        };
        if (!res.ok) return;
        const map: Record<string, string> = {};
        for (const row of data.accommodations ?? []) {
          if (row.code && row.label) map[row.code] = row.label;
        }
        setHbAccommodationLabels(map);
      })
      .catch(() => setHbAccommodationLabels({}));
  }, [activeTab, locale]);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingPreferences(true);
    setIsLoadingProfile(true);
    Promise.all([
      fetch('/api/auth/me', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/user/preferences', { credentials: 'include' }).then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as {
          authenticated?: boolean;
          preference?: { aiSettings?: unknown };
        };
        if (!res.ok || data.authenticated === false) return null;
        return data.preference?.aiSettings ?? null;
      }),
    ])
      .then(([me, aiSettings]) => {
        if (cancelled) return;
        const user =
          me &&
          typeof me === 'object' &&
          (me as { authenticated?: boolean }).authenticated === true &&
          (me as { user?: unknown }).user &&
          typeof (me as { user: unknown }).user === 'object'
            ? ((me as { user: MeUserProfile }).user)
            : null;
        const account = profileFieldsFromMeUser(user);
        setProfileData(mergeDashboardProfileFromSources(account, aiSettings));
        setSavedPreferences(
          aiSettings && typeof aiSettings === 'object' ? (aiSettings as SavedPreferences) : null,
        );
      })
      .catch(() => {
        if (!cancelled) setSavedPreferences(null);
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingProfile(false);
          setIsLoadingPreferences(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Bookings and history are not yet connected to a live API.
  // Show empty state with a clear "coming soon" message.
  const mockBookings: Booking[] = [];

  const mockHistory: TravelHistory[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700';
      case 'pending':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-orange-500' : 'text-gray-300 dark:text-gray-600'}>
        ★
      </span>
    ));
  };

  const skeletonCls = 'h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse';

  const initials = profileData.name
    ? profileData.name
        .split(/\s+/)
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <AppHeader showBack onBack={onBack} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-24 sm:pb-12">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center shadow-xl text-white text-lg sm:text-xl font-bold">
                <span className={`transition-opacity duration-700 ${avatarReady ? 'opacity-100' : 'opacity-0'}`}>
                  {initials}
                </span>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                  {t('title')}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
              </div>
            </div>
            {onNewBooking && (
              <Button
                onClick={onNewBooking}
                className="bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 gap-2 max-sm:w-full max-sm:mt-4"
              >
                <Plane className="w-4 h-4" />
                {t('newBooking')}
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max sm:min-w-0 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'bookings' as TabType, label: t('tabBookings'), icon: Calendar },
              { id: 'history' as TabType, label: t('tabHistory'), icon: Clock },
              { id: 'profile' as TabType, label: t('tabProfile'), icon: User },
              { id: 'preferences' as TabType, label: t('tabPreferences'), icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-6 py-3 font-medium transition-all flex items-center gap-2 whitespace-nowrap text-sm sm:text-base border-b-2 ${
                    activeTab === tab.id
                      ? 'border-teal-600 dark:border-orange-500 text-teal-700 dark:text-orange-400 bg-teal-50/30 dark:bg-gray-800/50'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 bg-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('activeBookings')}</h2>
              {mockBookings.length === 0 ? (
                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardContent className="p-12 text-center">
                    <Plane className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{t('noBookings')}</p>
                    <Button
                      onClick={onNewBooking}
                      className="bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600"
                    >
                      {t('bookNow')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {mockBookings.map((booking) => (
                    <Card key={booking.id} className="border-2 border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all shadow-lg dark:bg-gray-800">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                              <CardTitle className="text-xl dark:text-white">{booking.destination}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>{booking.dates}</span>
                            </div>
                          </div>
                          <Badge className={`gap-1.5 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status === 'confirmed'
                              ? t('confirmed')
                              : booking.status === 'pending'
                                ? t('pending')
                                : t('cancelled')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{booking.type}</span>
                          <span className="font-bold text-lg text-teal-700 dark:text-teal-400">{booking.price}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {t('bookingDate')}: {booking.bookingDate}
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button variant="outline" className="flex-1 border-teal-300 dark:border-gray-600 hover:bg-teal-50 dark:hover:bg-gray-700 dark:text-gray-200">
                            {t('viewDetails')}
                          </Button>
                          {booking.status !== 'cancelled' && (
                            <Button variant="outline" className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                              {t('cancelBooking')}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('pastTrips')}</h2>
              {mockHistory.length === 0 ? (
                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardContent className="p-12 text-center">
                    <Clock className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-400">{t('noHistory')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockHistory.map((trip) => (
                    <Card key={trip.id} className="border-2 border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all shadow-lg dark:bg-gray-800">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                          <CardTitle className="text-lg dark:text-white">{trip.destination}</CardTitle>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{trip.dates}</div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Badge variant="outline" className="text-xs">{trip.type}</Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{t('rating')}:</span>
                          <div className="text-lg">{renderStars(trip.rating)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('personalInfo')}</h2>
                <Button
                  onClick={async () => {
                    if (isEditingProfile) {
                      setIsSavingProfile(true);
                      try {
                        const res = await fetch('/api/auth/me', {
                          method: 'PUT',
                          credentials: 'include',
                          headers: { 'content-type': 'application/json' },
                          body: JSON.stringify({ user: profileData }),
                        });
                        if (!res.ok) {
                          throw new Error(t('profileSaveError') || 'Failed to save profile');
                        }
                        toast.success(t('profileSaved') || 'Profile saved successfully');
                        setIsEditingProfile(false);
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : t('profileSaveError') || 'Failed to save profile');
                      } finally {
                        setIsSavingProfile(false);
                      }
                    } else {
                      setIsEditingProfile(true);
                    }
                  }}
                  disabled={isSavingProfile || isLoadingProfile}
                  className={isEditingProfile ? 'bg-gradient-to-r from-teal-600 to-orange-500' : ''}
                  variant={isEditingProfile ? 'default' : 'outline'}
                >
                  {isSavingProfile ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('saving') || 'Saving...'}
                    </>
                  ) : isEditingProfile ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {t('saveProfile')}
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      {t('editProfile')}
                    </>
                  )}
                </Button>
              </div>

              <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                <CardContent className="p-6 sm:p-8">
                  {isLoadingProfile ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className={`space-y-2 ${i === 8 ? 'sm:col-span-2' : ''}`}>
                          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                          <div className={skeletonCls} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('name')}
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            disabled={!isEditingProfile}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('email')}
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            disabled={!isEditingProfile}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('phone')}
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            disabled={!isEditingProfile}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('dateOfBirth')}
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                            disabled={!isEditingProfile}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('nationality')}
                        </label>
                        <div className="relative">
                          <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="text"
                            value={profileData.nationality}
                            onChange={(e) => setProfileData({ ...profileData, nationality: e.target.value })}
                            disabled={!isEditingProfile}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('passportNumber')}
                        </label>
                        <div className="relative">
                          <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="text"
                            value={profileData.passportNumber}
                            onChange={(e) => setProfileData({ ...profileData, passportNumber: e.target.value })}
                            disabled={!isEditingProfile}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('nationalIdNumber')}
                        </label>
                        <div className="relative">
                          <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="text"
                            value={profileData.nationalIdNumber}
                            onChange={(e) => setProfileData({ ...profileData, nationalIdNumber: e.target.value })}
                            disabled={!isEditingProfile}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('taxIdNumber')}
                        </label>
                        <div className="relative">
                          <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="text"
                            value={profileData.taxIdNumber}
                            onChange={(e) => setProfileData({ ...profileData, taxIdNumber: e.target.value })}
                            disabled={!isEditingProfile}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('address')}
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input
                            type="text"
                            value={profileData.address}
                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                            disabled={!isEditingProfile}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('travelPreferences')}</h2>
                <Button
                  onClick={() => (window.location.href = '/preferences/edit')}
                  className="bg-gradient-to-r from-teal-600 to-orange-500 hover:from-teal-700 hover:to-orange-600 gap-2"
                  size="sm"
                >
                  <Edit className="w-4 h-4" />
                  {t('editProfile')}
                </Button>
              </div>

              <div className="grid gap-6">
                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Briefcase className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      {t('budgetRange')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingPreferences ? (
                      <Badge variant="outline">Loading…</Badge>
                    ) : savedPreferences?.budgetRange ? (
                      <Badge className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-700">
                        {(savedPreferences.currency ?? 'USD')}{' '}
                        {savedPreferences.budgetRange[0]?.toLocaleString?.() ?? savedPreferences.budgetRange[0]} -{' '}
                        {(savedPreferences.currency ?? 'USD')}{' '}
                        {savedPreferences.budgetRange[1]?.toLocaleString?.() ?? savedPreferences.budgetRange[1]}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not set</Badge>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      {t('preferredDestinations')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {isLoadingPreferences ? (
                        <Badge variant="outline">Loading…</Badge>
                      ) : (savedPreferences?.preferredDestinations?.length ?? 0) > 0 ? (
                        savedPreferences!.preferredDestinations!.slice(0, 8).map((d) => (
                          <Badge key={d} variant="outline">
                            {d}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">Not set</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Palmtree className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      {t('travelStyle')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {isLoadingPreferences ? (
                        <Badge variant="outline">Loading…</Badge>
                      ) : (savedPreferences?.travelStyles?.length ?? 0) > 0 ? (
                        savedPreferences!.travelStyles!.slice(0, 8).map((s) => (
                          <Badge key={s} variant="outline">
                            {s}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">Not set</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Hotel className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      {t('accommodation')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {isLoadingPreferences ? (
                        <Badge variant="outline">Loading…</Badge>
                      ) : (savedPreferences?.accommodationType?.length ?? 0) > 0 ? (
                        savedPreferences!.accommodationType!.slice(0, 8).map((a) => (
                          <Badge key={a} variant="outline">
                            {hbAccommodationLabels[a] ?? a}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">Not set</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Heart className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      {t('activities')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {isLoadingPreferences ? (
                        <Badge variant="outline">Loading…</Badge>
                      ) : (savedPreferences?.activityTypes?.length ?? 0) > 0 ? (
                        savedPreferences!.activityTypes!.slice(0, 10).map((a) => (
                          <Badge key={a} variant="outline">
                            {a}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">Not set</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-xl dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                      <Utensils className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      {t('dietary')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {isLoadingPreferences ? (
                        <Badge variant="outline">Loading…</Badge>
                      ) : (savedPreferences?.dietaryRestrictions?.length ?? 0) > 0 ? (
                        savedPreferences!.dietaryRestrictions!.slice(0, 10).map((d) => (
                          <Badge key={d} variant="outline">
                            {d}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline">Not set</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
