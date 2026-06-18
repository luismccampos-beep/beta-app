# EnhancedTravelPreferencesForm Refactoring Plan

## Data: 2026-06-18

## Problema
O ficheiro `EnhancedTravelPreferencesForm.tsx` tem **2152 linhas**, tornando difícil:
- Manutenção
- Reutilização de componentes
- Testes unitários
- Code review

## Estrutura Atual (6 Steps)

### Step 0 - Travel Style
- Travel styles (multi-select)
- Travel frequency
- Preferred destinations
- Travel purpose
- Nationality
- Preferred countries/continents

### Step 1 - Budget
- Budget range slider
- Currency selector
- Budget priority
- Daily budget profile selector

### Step 2 - Flight & Accommodation
- Accommodation type
- Cabin class
- Seat preference
- Meal preference
- Loyalty programs
- Hotel chain
- Room type
- Amenities
- Cruise options (condicional)

### Step 3 - Activities
- Activity types
- Pace preference
- Experience types
- Languages

### Step 4 - Special Requirements
- Sustainability level
- Eco preferences
- Carbon offset
- Dietary restrictions
- Accessibility
- Medical conditions

### Step 5 - Advanced Settings
- AI recommendations
- Data sharing
- Notifications
- Privacy level

## Plano de Fragmentação

### Componentes a Extrair

1. **TravelStyleSection** (Step 0)
   - Ficheiro: `components/travel/TravelStyleSection.tsx`
   - Responsabilidades: Travel styles, frequency, destinations, purpose, nationality

2. **BudgetSection** (Step 1)
   - Ficheiro: `components/travel/BudgetSection.tsx`
   - Responsabilidades: Budget range, currency, priority, daily profile

3. **FlightAccommodationSection** (Step 2)
   - Ficheiro: `components/travel/FlightAccommodationSection.tsx`
   - Responsabilidades: Flight prefs, accommodation, cruise options

4. **ActivitiesSection** (Step 3)
   - Ficheiro: `components/travel/ActivitiesSection.tsx`
   - Responsabilidades: Activity types, pace, experience, languages

5. **SpecialRequirementsSection** (Step 4)
   - Ficheiro: `components/travel/SpecialRequirementsSection.tsx`
   - Responsabilidades: Sustainability, eco, dietary, accessibility, medical

6. **AdvancedSettingsSection** (Step 5)
   - Ficheiro: `components/travel/AdvancedSettingsSection.tsx`
   - Responsabilidades: AI, data sharing, notifications, privacy

7. **MultiSelectCombobox** (Componente Reutilizável)
   - Ficheiro: `components/ui/MultiSelectCombobox.tsx`
   - Responsabilidades: Combobox com multi-seleção

8. **PreferencesNavigation** (Navegação)
   - Ficheiro: `components/travel/PreferencesNavigation.tsx`
   - Responsabilidades: Navegação entre steps, indicador de progresso

## Benefícios Esperados

- **Manutenibilidade**: Cada componente < 300 linhas
- **Reutilização**: Componentes podem ser usados em outros formulários
- **Testes**: Testes unitários mais fáceis
- **Performance**: Lazy loading de seções não visíveis
- **Code Review**: Reviews mais rápidos e focados

## Ordem de Implementação

1. Criar componentes UI reutilizáveis (MultiSelectCombobox)
2. Extrair seções uma por uma (começar pelas mais independentes)
3. Manter backwards compatibility (export default do componente principal)
4. Adicionar testes para cada componente extraído

## Notas

- Manter o componente `EnhancedTravelPreferencesForm` como wrapper principal
- Usar composition pattern para juntar as seções
- Manter todos os tipos e schemas Zod no ficheiro principal ou em `lib/travel/preferences.ts`