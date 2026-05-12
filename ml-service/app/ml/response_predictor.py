"""
Response Prediction Engine
Predicts optimal AI responses based on user preferences
"""

import asyncio
import logging
import hashlib
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from pydantic import BaseModel
import numpy as np
from collections import defaultdict

from app.core.config import settings
from app.core.logger import logger
from app.ml.preference_analytics import preference_analytics_service

class ResponsePrediction(BaseModel):
    """Response prediction model"""
    budget_level: str
    response_style: str
    recommended_services: List[str]
    confidence_score: float
    reasoning: str
    personalization_factors: List[str]

class SearchOptimization(BaseModel):
    """Search optimization model"""
    query_weights: Dict[str, float]
    result_ranking_factors: List[str]
    personalization_level: str
    expected_improvement: float

class UserPersona(BaseModel):
    """User persona model"""
    type: str
    characteristics: Dict[str, Any]
    communication_style: str
    decision_factors: List[str]
    price_sensitivity: str

class ResponsePredictor:
    """Service for predicting optimal responses based on preferences"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self._setup_logging()
        
        # Budget level thresholds (EUR)
        self.budget_thresholds = {
            'economy': (0, 2000),
            'moderate': (2000, 5000),
            'premium': (5000, 10000),
            'luxury': (10000, float('inf'))
        }
        
        # Response styles for different budget levels
        self.response_styles = {
            'economy': 'concise',
            'moderate': 'balanced',
            'premium': 'detailed',
            'luxury': 'luxury'
        }
        
        # Service recommendations by budget level
        self.service_recommendations = {
            'economy': [
                'hostels', 'budget-hotels', 'public-transport', 
                'free-activities', 'street-food', 'group-tours'
            ],
            'moderate': [
                'mid-range-hotels', 'car-rental', 'guided-tours',
                'museums', 'local-restaurants', 'day-trips'
            ],
            'premium': [
                'boutique-hotels', 'private-transfers', 'experiences',
                'fine-dining', 'spa-services', 'exclusive-tours'
            ],
            'luxury': [
                'luxury-resorts', 'private-jets', 'concierge',
                'michelin-restaurants', 'private-yachts', 'vip-experiences'
            ]
        }
        
    def _setup_logging(self):
        """Setup logging configuration"""
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
            self.logger.setLevel(logging.INFO)
    
    async def predict_response(
        self, 
        user_preferences: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None
    ) -> ResponsePrediction:
        """Predict optimal response based on user preferences"""
        try:
            # Extract budget information
            budget_info = user_preferences.get('budget', {})
            budget_level = self._determine_budget_level(budget_info)
            
            # Determine response style
            response_style = self._determine_response_style(
                budget_level, 
                user_preferences, 
                context
            )
            
            # Get recommended services
            recommended_services = self._get_recommended_services(
                budget_level, 
                user_preferences
            )
            
            # Calculate confidence score
            confidence_score = self._calculate_confidence_score(
                user_preferences, 
                budget_level
            )
            
            # Generate reasoning
            reasoning = self._generate_reasoning(
                budget_level, 
                response_style, 
                user_preferences
            )
            
            # Identify personalization factors
            personalization_factors = self._identify_personalization_factors(
                user_preferences
            )
            
            return ResponsePrediction(
                budget_level=budget_level,
                response_style=response_style,
                recommended_services=recommended_services,
                confidence_score=confidence_score,
                reasoning=reasoning,
                personalization_factors=personalization_factors
            )
            
        except Exception as e:
            self.logger.error(f"Error predicting response: {str(e)}")
            # Return fallback prediction
            return ResponsePrediction(
                budget_level='moderate',
                response_style='balanced',
                recommended_services=self.service_recommendations['moderate'],
                confidence_score=0.5,
                reasoning="Fallback prediction due to error",
                personalization_factors=[]
            )
    
    def _determine_budget_level(self, budget_info: Dict[str, Any]) -> str:
        """Determine budget level from budget information"""
        max_budget = budget_info.get('max', 0)
        
        for level, (min_budget, max_threshold) in self.budget_thresholds.items():
            if min_budget <= max_budget < max_threshold:
                return level
        
        return 'luxury'  # Default to luxury if very high budget
    
    def _determine_response_style(
        self, 
        budget_level: str, 
        user_preferences: Dict[str, Any],
        context: Optional[Dict[str, Any]]
    ) -> str:
        """Determine optimal response style"""
        base_style = self.response_styles.get(budget_level, 'balanced')
        
        # Adjust based on user preferences
        personalization = user_preferences.get('personalization', {})
        
        # Check if user prefers detailed responses
        if personalization.get('detailed_itineraries', False):
            return 'detailed'
        
        # Check if user prefers concise responses
        if personalization.get('concise_responses', False):
            return 'concise'
        
        # Adjust based on context
        if context:
            # Mobile users might prefer shorter responses
            if context.get('device_type') == 'mobile':
                if base_style == 'detailed':
                    return 'balanced'
                elif base_style == 'luxury':
                    return 'detailed'
            
            # First-time users might need more guidance
            if context.get('is_first_time', False):
                if base_style == 'concise':
                    return 'balanced'
        
        return base_style
    
    def _get_recommended_services(
        self, 
        budget_level: str, 
        user_preferences: Dict[str, Any]
    ) -> List[str]:
        """Get recommended services based on budget and preferences"""
        base_services = self.service_recommendations.get(budget_level, [])
        
        # Filter based on user preferences
        travel_preferences = user_preferences.get('travel', {})
        
        # Remove services that don't match user preferences
        filtered_services = []
        
        for service in base_services:
            include_service = True
            
            # Check accommodation preferences
            accommodation_prefs = travel_preferences.get('accommodation', [])
            if accommodation_prefs and 'hotels' in service:
                if not any(pref in service for pref in accommodation_prefs):
                    include_service = False
            
            # Check transportation preferences
            transport_prefs = travel_preferences.get('transportation', [])
            if transport_prefs and any(transport in service for transport in ['transport', 'jets', 'transfers']):
                if not any(pref in service for pref in transport_prefs):
                    include_service = False
            
            if include_service:
                filtered_services.append(service)
        
        return filtered_services[:6]  # Limit to top 6 recommendations
    
    def _calculate_confidence_score(
        self, 
        user_preferences: Dict[str, Any], 
        budget_level: str
    ) -> float:
        """Calculate confidence score for the prediction"""
        confidence = 0.5  # Base confidence
        
        # Increase confidence if we have budget information
        if 'budget' in user_preferences and user_preferences['budget'].get('max'):
            confidence += 0.2
        
        # Increase confidence if we have travel preferences
        if 'travel' in user_preferences:
            confidence += 0.1
        
        # Increase confidence if we have personalization settings
        if 'personalization' in user_preferences:
            confidence += 0.1
        
        # Adjust based on budget level clarity
        budget_info = user_preferences.get('budget', {})
        max_budget = budget_info.get('max', 0)
        
        if max_budget > 0:
            # Clear budget levels have higher confidence
            if max_budget < 2000 or max_budget > 10000:
                confidence += 0.1
            elif 2000 <= max_budget <= 5000 or 5000 <= max_budget <= 10000:
                confidence += 0.05
        
        return min(confidence, 0.95)  # Cap at 95%
    
    def _generate_reasoning(
        self, 
        budget_level: str, 
        response_style: str, 
        user_preferences: Dict[str, Any]
    ) -> str:
        """Generate reasoning for the prediction"""
        reasoning_parts = []
        
        # Budget reasoning
        budget_info = user_preferences.get('budget', {})
        max_budget = budget_info.get('max', 0)
        
        if max_budget > 0:
            reasoning_parts.append(
                f"Budget of €{max_budget:,} indicates {budget_level} travel preferences"
            )
        
        # Response style reasoning
        style_reasons = {
            'concise': "User prefers quick, to-the-point information",
            'balanced': "User wants comprehensive but not overwhelming information",
            'detailed': "User appreciates comprehensive information and options",
            'luxury': "User expects premium, detailed service information"
        }
        
        reasoning_parts.append(style_reasons.get(response_style, ""))
        
        # Personalization reasoning
        personalization = user_preferences.get('personalization', {})
        
        if personalization.get('detailed_itineraries'):
            reasoning_parts.append("User prefers detailed planning information")
        
        if personalization.get('include_local_tips'):
            reasoning_parts.append("User values local insights and recommendations")
        
        return ". ".join([part for part in reasoning_parts if part])
    
    def _identify_personalization_factors(
        self, 
        user_preferences: Dict[str, Any]
    ) -> List[str]:
        """Identify key personalization factors"""
        factors = []
        
        # Budget factors
        budget_info = user_preferences.get('budget', {})
        if budget_info.get('max'):
            factors.append(f"budget_conscious_{self._determine_budget_level(budget_info)}")
        
        # Travel style factors
        travel_prefs = user_preferences.get('travel', {})
        if travel_prefs.get('style'):
            factors.append(f"travel_style_{travel_prefs['style']}")
        
        # Personalization factors
        personalization = user_preferences.get('personalization', {})
        if personalization.get('detailed_itineraries'):
            factors.append("detailed_planner")
        
        if personalization.get('include_local_tips'):
            factors.append("local_explorer")
        
        if personalization.get('include_budget_breakdown'):
            factors.append("budget_focused")
        
        # Activity preferences
        activities = travel_prefs.get('activities', [])
        if activities:
            factors.append(f"activity_focused_{activities[0]}")
        
        return factors[:5]  # Limit to top 5 factors
    
    async def optimize_search(
        self, 
        user_preferences: Dict[str, Any],
        search_query: str
    ) -> SearchOptimization:
        """Optimize search results based on user preferences"""
        try:
            # Determine personalization level
            personalization_level = self._determine_search_personalization_level(
                user_preferences
            )
            
            # Calculate query weights
            query_weights = self._calculate_query_weights(
                user_preferences, 
                search_query
            )
            
            # Determine ranking factors
            ranking_factors = self._determine_ranking_factors(user_preferences)
            
            # Estimate improvement
            expected_improvement = self._estimate_search_improvement(
                personalization_level, 
                user_preferences
            )
            
            return SearchOptimization(
                query_weights=query_weights,
                result_ranking_factors=ranking_factors,
                personalization_level=personalization_level,
                expected_improvement=expected_improvement
            )
            
        except Exception as e:
            self.logger.error(f"Error optimizing search: {str(e)}")
            return SearchOptimization(
                query_weights={},
                result_ranking_factors=[],
                personalization_level="none",
                expected_improvement=0.0
            )
    
    def _determine_search_personalization_level(
        self, 
        user_preferences: Dict[str, Any]
    ) -> str:
        """Determine level of search personalization"""
        if not user_preferences:
            return "none"
        
        preference_count = len([
            key for key, value in user_preferences.items() 
            if value and isinstance(value, (dict, list, str))
        ])
        
        if preference_count >= 3:
            return "high"
        elif preference_count >= 2:
            return "medium"
        else:
            return "low"
    
    def _calculate_query_weights(
        self, 
        user_preferences: Dict[str, Any], 
        search_query: str
    ) -> Dict[str, float]:
        """Calculate weights for different aspects of the search query"""
        weights = {
            'price_relevance': 0.3,
            'location_relevance': 0.3,
            'activity_relevance': 0.2,
            'style_relevance': 0.2
        }
        
        # Adjust based on user preferences
        budget_info = user_preferences.get('budget', {})
        if budget_info.get('max'):
            weights['price_relevance'] = 0.4
            weights['style_relevance'] = 0.1
        
        travel_prefs = user_preferences.get('travel', {})
        if travel_prefs.get('activities'):
            weights['activity_relevance'] = 0.3
            weights['location_relevance'] = 0.2
        
        if travel_prefs.get('style'):
            weights['style_relevance'] = 0.3
            weights['activity_relevance'] = 0.1
        
        return weights
    
    def _determine_ranking_factors(self, user_preferences: Dict[str, Any]) -> List[str]:
        """Determine factors to use in ranking search results"""
        factors = ['relevance_score', 'popularity']
        
        # Add budget-based ranking
        budget_info = user_preferences.get('budget', {})
        if budget_info.get('max'):
            factors.append('price_match')
        
        # Add activity-based ranking
        travel_prefs = user_preferences.get('travel', {})
        if travel_prefs.get('activities'):
            factors.append('activity_match')
        
        # Add style-based ranking
        if travel_prefs.get('style'):
            factors.append('style_match')
        
        # Add personalization-based ranking
        if user_preferences.get('personalization'):
            factors.append('personalization_score')
        
        return factors
    
    def _estimate_search_improvement(
        self, 
        personalization_level: str, 
        user_preferences: Dict[str, Any]
    ) -> float:
        """Estimate expected improvement in search relevance"""
        improvement_map = {
            'none': 0.0,
            'low': 0.1,
            'medium': 0.25,
            'high': 0.4
        }
        
        base_improvement = improvement_map.get(personalization_level, 0.0)
        
        # Add bonus for specific preferences
        if user_preferences.get('budget', {}).get('max'):
            base_improvement += 0.05
        
        if user_preferences.get('travel', {}).get('activities'):
            base_improvement += 0.03
        
        return min(base_improvement, 0.5)  # Cap at 50% improvement
    
    async def create_user_persona(
        self, 
        user_preferences: Dict[str, Any],
        events: List[Dict[str, Any]]
    ) -> UserPersona:
        """Create a user persona based on preferences and behavior"""
        try:
            # Determine persona type
            persona_type = self._determine_persona_type(user_preferences, events)
            
            # Extract characteristics
            characteristics = self._extract_persona_characteristics(
                user_preferences, 
                events
            )
            
            # Determine communication style
            communication_style = self._determine_communication_style(
                user_preferences, 
                events
            )
            
            # Identify decision factors
            decision_factors = self._identify_decision_factors(user_preferences)
            
            # Determine price sensitivity
            price_sensitivity = self._determine_price_sensitivity(user_preferences)
            
            return UserPersona(
                type=persona_type,
                characteristics=characteristics,
                communication_style=communication_style,
                decision_factors=decision_factors,
                price_sensitivity=price_sensitivity
            )
            
        except Exception as e:
            self.logger.error(f"Error creating user persona: {str(e)}")
            return UserPersona(
                type="unknown",
                characteristics={},
                communication_style="balanced",
                decision_factors=[],
                price_sensitivity="medium"
            )
    
    def _determine_persona_type(
        self, 
        user_preferences: Dict[str, Any], 
        events: List[Dict[str, Any]]
    ) -> str:
        """Determine the type of user persona"""
        budget_info = user_preferences.get('budget', {})
        max_budget = budget_info.get('max', 0)
        
        # Count preset vs custom selections
        preset_count = sum(1 for event in events if event.get('action') == 'preset-select')
        custom_count = sum(1 for event in events if event.get('action') == 'custom-input')
        
        # Determine persona based on budget and behavior
        if max_budget > 10000:
            if custom_count > preset_count:
                return "luxury_explorer"
            else:
                return "luxury_seeker"
        elif max_budget > 5000:
            if custom_count > preset_count:
                return "premium_planner"
            else:
                return "comfort_traveler"
        elif max_budget > 2000:
            if custom_count > preset_count:
                return "value_hunter"
            else:
                return "balanced_traveler"
        else:
            if custom_count > preset_count:
                return "budget_planner"
            else:
                return "economy_traveler"
    
    def _extract_persona_characteristics(
        self, 
        user_preferences: Dict[str, Any], 
        events: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Extract characteristics for the persona"""
        characteristics = {}
        
        # Budget characteristics
        budget_info = user_preferences.get('budget', {})
        characteristics['budget_level'] = self._determine_budget_level(budget_info)
        characteristics['budget_flexibility'] = self._calculate_budget_flexibility(budget_info)
        
        # Behavior characteristics
        preset_count = sum(1 for event in events if event.get('action') == 'preset-select')
        total_actions = len(events)
        characteristics['prefers_presets'] = (preset_count / max(total_actions, 1)) > 0.5
        
        # Travel characteristics
        travel_prefs = user_preferences.get('travel', {})
        characteristics['travel_style'] = travel_prefs.get('style', 'unknown')
        characteristics['activity_preference'] = travel_prefs.get('activities', [])
        
        return characteristics
    
    def _calculate_budget_flexibility(self, budget_info: Dict[str, Any]) -> str:
        """Calculate budget flexibility"""
        min_budget = budget_info.get('min', 0)
        max_budget = budget_info.get('max', 0)
        
        if max_budget == 0:
            return "unknown"
        
        range_percentage = ((max_budget - min_budget) / max_budget) * 100
        
        if range_percentage > 50:
            return "flexible"
        elif range_percentage > 20:
            return "moderate"
        else:
            return "strict"
    
    def _determine_communication_style(
        self, 
        user_preferences: Dict[str, Any], 
        events: List[Dict[str, Any]]
    ) -> str:
        """Determine preferred communication style"""
        personalization = user_preferences.get('personalization', {})
        
        if personalization.get('detailed_itineraries'):
            return "detailed"
        elif personalization.get('concise_responses'):
            return "concise"
        else:
            return "balanced"
    
    def _identify_decision_factors(self, user_preferences: Dict[str, Any]) -> List[str]:
        """Identify key decision factors for the user"""
        factors = []
        
        # Budget factors
        budget_info = user_preferences.get('budget', {})
        if budget_info.get('max'):
            factors.append("price")
        
        # Travel style factors
        travel_prefs = user_preferences.get('travel', {})
        if travel_prefs.get('style'):
            factors.append("travel_style")
        
        if travel_prefs.get('activities'):
            factors.append("activities")
        
        # Personalization factors
        personalization = user_preferences.get('personalization', {})
        if personalization.get('include_local_tips'):
            factors.append("local_insights")
        
        if personalization.get('include_budget_breakdown'):
            factors.append("budget_breakdown")
        
        return factors or ["general"]  # Default to general if no specific factors
    
    def _determine_price_sensitivity(self, user_preferences: Dict[str, Any]) -> str:
        """Determine price sensitivity level"""
        budget_info = user_preferences.get('budget', {})
        max_budget = budget_info.get('max', 0)
        
        if max_budget == 0:
            return "unknown"
        elif max_budget < 2000:
            return "high"
        elif max_budget < 5000:
            return "medium"
        else:
            return "low"

# Global service instance
response_predictor = ResponsePredictor()
