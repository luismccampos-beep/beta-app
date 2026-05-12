import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
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
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface TravelPreferences {
  // Personal Info
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  
  // Travel Preferences
  travelFrequency: string;
  preferredDestinations: string[];
  travelPurpose: string[];
  accommodationType: string[];
  budgetRange: number[];
  currency: string;
  
  // Flight Preferences
  seatPreference: string;
  mealPreference: string;
  loyaltyPrograms: string[];
  cabinClass: string;
  
  // Accommodation Preferences
  hotelChain: string[];
  roomType: string;
  amenities: string[];
  
  // Activity Preferences
  activityTypes: string[];
  pacePreference: string;
  
  // Special Requirements
  dietaryRestrictions: string[];
  accessibility: string[];
  medicalConditions: string;
  
  // AI Insights
  aiRecommendations: boolean;
  dataSharing: boolean;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'SGD', symbol: '$', name: 'Singapore Dollar' },
];

const destinations = [
  'Europe', 'Asia', 'North America', 'South America', 
  'Africa', 'Oceania', 'Middle East', 'Caribbean'
];

const activityTypes = [
  'Adventure Sports', 'Cultural Tours', 'Beach Relaxation', 'City Exploration',
  'Mountain Hiking', 'Wildlife Safari', 'Food & Wine', 'Shopping',
  'Historical Sites', 'Photography', 'Water Sports', 'Nightlife'
];

const amenities = [
  'WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar',
  'Room Service', 'Concierge', 'Business Center', 'Parking'
];

export function TravelPreferencesForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiScore, setAiScore] = useState(0);
  
  const [preferences, setPreferences] = useState<TravelPreferences>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    travelFrequency: '',
    preferredDestinations: [],
    travelPurpose: [],
    accommodationType: [],
    budgetRange: [5000, 15000],
    currency: 'USD',
    seatPreference: '',
    mealPreference: '',
    loyaltyPrograms: [],
    cabinClass: '',
    hotelChain: [],
    roomType: '',
    amenities: [],
    activityTypes: [],
    pacePreference: '',
    dietaryRestrictions: [],
    accessibility: [],
    medicalConditions: '',
    aiRecommendations: true,
    dataSharing: false,
  });

  const updatePreference = (key: keyof TravelPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    // Simulate AI score calculation
    setAiScore(prev => Math.min(100, prev + Math.random() * 5));
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
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    toast.success('Travel preferences saved successfully!', {
      description: 'AI has analyzed your preferences and will provide personalized recommendations.',
    });
  };

  const steps = [
    { id: 'personal', label: 'Personal Info', icon: Users },
    { id: 'travel', label: 'Travel Details', icon: Plane },
    { id: 'accommodation', label: 'Accommodation', icon: Hotel },
    { id: 'activities', label: 'Activities', icon: Palmtree },
    { id: 'special', label: 'Special Needs', icon: Shield },
  ];

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Brain className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AKMLEVA
          </h1>
        </div>
        <p className="text-lg text-gray-600">
          AI-Powered Travel Ecosystem - Intelligent Preference Optimization
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="outline" className="gap-1">
            <Sparkles className="w-3 h-3" /> AI-Enhanced
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Globe className="w-3 h-3" /> Multi-Currency
          </Badge>
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="w-3 h-3" /> Predictive Analytics
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Zap className="w-3 h-3" /> Real-time Processing
          </Badge>
        </div>
      </div>

      {/* AI Intelligence Score */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">AI Intelligence Score</CardTitle>
            </div>
            <span className="text-2xl font-bold text-blue-600">{Math.round(aiScore)}%</span>
          </div>
          <CardDescription>
            Our AI analyzes your preferences in real-time to provide optimal recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={aiScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="flex justify-between items-center relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${isCompleted ? 'bg-green-600 text-white' : 
                  isActive ? 'bg-blue-600 text-white scale-110' : 
                  'bg-gray-200 text-gray-400'}
              `}>
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs ${isActive ? 'font-semibold text-blue-600' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Step 0: Personal Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" /> Personal Information
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Provide your personal details for seamless travel booking and compliance
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="John Smith"
                    value={preferences.fullName}
                    onChange={(e) => updatePreference('fullName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.smith@company.com"
                    value={preferences.email}
                    onChange={(e) => updatePreference('email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={preferences.phone}
                    onChange={(e) => updatePreference('phone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={preferences.dateOfBirth}
                    onChange={(e) => updatePreference('dateOfBirth', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Input
                    id="nationality"
                    placeholder="United States"
                    value={preferences.nationality}
                    onChange={(e) => updatePreference('nationality', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passportNumber">Passport Number</Label>
                  <Input
                    id="passportNumber"
                    placeholder="123456789"
                    value={preferences.passportNumber}
                    onChange={(e) => updatePreference('passportNumber', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Travel Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Plane className="w-5 h-5" /> Travel Preferences
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Help our AI understand your travel style and preferences
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="travelFrequency">Travel Frequency</Label>
                  <Select value={preferences.travelFrequency} onValueChange={(value: string) => updatePreference('travelFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly (50+ trips/year)</SelectItem>
                      <SelectItem value="monthly">Monthly (12-50 trips/year)</SelectItem>
                      <SelectItem value="quarterly">Quarterly (4-12 trips/year)</SelectItem>
                      <SelectItem value="yearly">Yearly (1-3 trips/year)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Destinations</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {destinations.map(destination => (
                      <div key={destination} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dest-${destination}`}
                          checked={preferences.preferredDestinations.includes(destination)}
                          onCheckedChange={() => toggleArrayValue('preferredDestinations', destination)}
                        />
                        <Label htmlFor={`dest-${destination}`} className="cursor-pointer">
                          {destination}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Travel Purpose</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Business', 'Leisure', 'Conference/Events', 'Family Visit'].map(purpose => (
                      <div key={purpose} className="flex items-center space-x-2">
                        <Checkbox
                          id={`purpose-${purpose}`}
                          checked={preferences.travelPurpose.includes(purpose)}
                          onCheckedChange={() => toggleArrayValue('travelPurpose', purpose)}
                        />
                        <Label htmlFor={`purpose-${purpose}`} className="cursor-pointer">
                          {purpose}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Budget Range per Trip
                    </Label>
                    <div className="flex items-center gap-2">
                      <Select value={preferences.currency} onValueChange={(value: string) => updatePreference('currency', value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map(curr => (
                            <SelectItem key={curr.code} value={curr.code}>
                              {curr.symbol} {curr.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      min={1000}
                      max={50000}
                      step={500}
                      value={preferences.budgetRange}
                      onValueChange={(value: number[]) => updatePreference('budgetRange', value)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{currencies.find(c => c.code === preferences.currency)?.symbol}{preferences.budgetRange[0].toLocaleString()}</span>
                      <span>{currencies.find(c => c.code === preferences.currency)?.symbol}{preferences.budgetRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cabinClass">Preferred Cabin Class</Label>
                  <Select value={preferences.cabinClass} onValueChange={(value: string) => updatePreference('cabinClass', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cabin class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium-economy">Premium Economy</SelectItem>
                      <SelectItem value="business">Business Class</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="seatPreference">Seat Preference</Label>
                    <Select value={preferences.seatPreference} onValueChange={(value: string) => updatePreference('seatPreference', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="window">Window</SelectItem>
                        <SelectItem value="aisle">Aisle</SelectItem>
                        <SelectItem value="middle">Middle</SelectItem>
                        <SelectItem value="any">No Preference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mealPreference">Meal Preference</Label>
                    <Select value={preferences.mealPreference} onValueChange={(value: string) => updatePreference('mealPreference', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="halal">Halal</SelectItem>
                        <SelectItem value="kosher">Kosher</SelectItem>
                        <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Accommodation */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Hotel className="w-5 h-5" /> Accommodation Preferences
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Define your ideal accommodation settings and amenities
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Accommodation Type</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Hotel', 'Resort', 'Apartment', 'Villa', 'Boutique', 'Hostel'].map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`accom-${type}`}
                          checked={preferences.accommodationType.includes(type)}
                          onCheckedChange={() => toggleArrayValue('accommodationType', type)}
                        />
                        <Label htmlFor={`accom-${type}`} className="cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roomType">Room Type</Label>
                  <Select value={preferences.roomType} onValueChange={(value: string) => updatePreference('roomType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Room</SelectItem>
                      <SelectItem value="double">Double Room</SelectItem>
                      <SelectItem value="twin">Twin Room</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="executive">Executive Suite</SelectItem>
                      <SelectItem value="presidential">Presidential Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Hotel Chains</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Marriott', 'Hilton', 'Hyatt', 'IHG', 'Accor', 'Independent'].map(chain => (
                      <div key={chain} className="flex items-center space-x-2">
                        <Checkbox
                          id={`chain-${chain}`}
                          checked={preferences.hotelChain.includes(chain)}
                          onCheckedChange={() => toggleArrayValue('hotelChain', chain)}
                        />
                        <Label htmlFor={`chain-${chain}`} className="cursor-pointer">
                          {chain}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Required Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenities.map(amenity => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={preferences.amenities.includes(amenity)}
                          onCheckedChange={() => toggleArrayValue('amenities', amenity)}
                        />
                        <Label htmlFor={`amenity-${amenity}`} className="cursor-pointer">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Activities */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Palmtree className="w-5 h-5" /> Activity & Experience Preferences
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Let AI curate experiences that match your interests
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Preferred Activities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {activityTypes.map(activity => (
                      <div key={activity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`activity-${activity}`}
                          checked={preferences.activityTypes.includes(activity)}
                          onCheckedChange={() => toggleArrayValue('activityTypes', activity)}
                        />
                        <Label htmlFor={`activity-${activity}`} className="cursor-pointer text-sm">
                          {activity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pacePreference">Travel Pace</Label>
                  <Select value={preferences.pacePreference} onValueChange={(value: string) => updatePreference('pacePreference', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred pace" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relaxed">Relaxed - Minimal activities, maximum relaxation</SelectItem>
                      <SelectItem value="moderate">Moderate - Balanced mix of activities and downtime</SelectItem>
                      <SelectItem value="active">Active - Packed schedule with multiple activities</SelectItem>
                      <SelectItem value="adventure">Adventure - High-energy, thrill-seeking experiences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Loyalty Programs</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Airlines Miles', 'Hotel Points', 'Credit Card Rewards', 'Travel Memberships'].map(program => (
                      <div key={program} className="flex items-center space-x-2">
                        <Checkbox
                          id={`loyalty-${program}`}
                          checked={preferences.loyaltyPrograms.includes(program)}
                          onCheckedChange={() => toggleArrayValue('loyaltyPrograms', program)}
                        />
                        <Label htmlFor={`loyalty-${program}`} className="cursor-pointer">
                          {program}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Special Requirements */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Special Requirements & AI Settings
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Help us ensure a safe and comfortable travel experience
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Dietary Restrictions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Lactose-Free', 'Nut Allergy', 'Seafood Allergy'].map(diet => (
                      <div key={diet} className="flex items-center space-x-2">
                        <Checkbox
                          id={`diet-${diet}`}
                          checked={preferences.dietaryRestrictions.includes(diet)}
                          onCheckedChange={() => toggleArrayValue('dietaryRestrictions', diet)}
                        />
                        <Label htmlFor={`diet-${diet}`} className="cursor-pointer text-sm">
                          {diet}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Accessibility Requirements</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Wheelchair Access', 'Visual Assistance', 'Hearing Assistance', 'Mobility Support'].map(access => (
                      <div key={access} className="flex items-center space-x-2">
                        <Checkbox
                          id={`access-${access}`}
                          checked={preferences.accessibility.includes(access)}
                          onCheckedChange={() => toggleArrayValue('accessibility', access)}
                        />
                        <Label htmlFor={`access-${access}`} className="cursor-pointer">
                          {access}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalConditions">Medical Conditions / Special Notes</Label>
                  <Textarea
                    id="medicalConditions"
                    placeholder="Please list any medical conditions or special requirements we should be aware of..."
                    value={preferences.medicalConditions}
                    onChange={(e) => updatePreference('medicalConditions', e.target.value)}
                    rows={4}
                  />
                </div>

                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-600" />
                      AI-Powered Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="aiRecommendations" className="font-medium">
                          Enable AI Recommendations
                        </Label>
                        <p className="text-sm text-gray-600">
                          Get personalized travel suggestions based on your preferences and behavior
                        </p>
                      </div>
                      <Switch
                        id="aiRecommendations"
                        checked={preferences.aiRecommendations}
                        onCheckedChange={(checked: boolean) => updatePreference('aiRecommendations', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dataSharing" className="font-medium">
                          Enhanced Data Analysis
                        </Label>
                        <p className="text-sm text-gray-600">
                          Allow anonymous data sharing to improve AI accuracy and recommendations
                        </p>
                      </div>
                      <Switch
                        id="dataSharing"
                        checked={preferences.dataSharing}
                        onCheckedChange={(checked: boolean) => updatePreference('dataSharing', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep < totalSteps - 1 ? (
              <Button
                onClick={() => setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1))}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="gap-2"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Processing with AI...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Complete Profile
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Panel */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Real-time analysis of your travel preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Traveler Type</p>
              <p className="font-semibold text-lg">
                {preferences.travelPurpose.includes('Business') ? 'Business Professional' : 'Leisure Explorer'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Budget Category</p>
              <p className="font-semibold text-lg">
                {preferences.budgetRange[1] > 30000 ? 'Luxury' : preferences.budgetRange[1] > 15000 ? 'Premium' : 'Standard'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Travel Style</p>
              <p className="font-semibold text-lg">
                {preferences.activityTypes.length > 6 ? 'Adventure Seeker' : preferences.pacePreference === 'relaxed' ? 'Relaxation Focused' : 'Balanced'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
