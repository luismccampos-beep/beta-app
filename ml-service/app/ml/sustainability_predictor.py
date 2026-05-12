"""
Sustainability Predictor
Predicts sustainability preferences and recommendations based on user behavior and choices
"""

import asyncio
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from pydantic import BaseModel
import numpy as np
from collections import defaultdict, Counter

from app.core.config import settings
from app.core.logger import logger

class SustainabilityProfile(BaseModel):
    """User sustainability profile"""
    sustainability_level: str
    eco_consciousness: str
    carbon_footprint_awareness: str
    local_preference: str
    sustainable_transport_preference: str
    ethical_considerations: str

class SustainabilityPrediction(BaseModel):
    """Sustainability prediction result"""
    sustainability_score: float
    recommended_level: str
    eco_recommendations: List[str]
    carbon_footprint_estimate: Dict[str, Any]
    sustainable_alternatives: List[Dict[str, Any]]
    impact_potential: str
    reasoning: str

class EcoPreference(BaseModel):
    """Eco preference model"""
    local_first: bool
    carbon_conscious: bool
    sustainable_transport: bool
    ethical_sourcing: bool
    waste_reduction: bool

class CarbonFootprint(BaseModel):
    """Carbon footprint estimation"""
    transport_footprint: float
    accommodation_footprint: float
    activities_footprint: float
    total_footprint: float
    comparison_to_average: str

class SustainabilityPredictor:
    """Service for predicting sustainability preferences and recommendations"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self._setup_logging()
        
        # Sustainability levels
        self.sustainability_levels = {
            'minimal': 'basic_awareness',
            'moderate': 'eco_conscious',
            'high': 'sustainability_focused',
            'extreme': 'carbon_neutral_committed'
        }
        
        # Transport carbon footprints (kg CO2 per km)
        self.transport_footprints = {
            'walking': 0,
            'bicycle': 0,
            'electric_vehicle': 0.05,
            'train': 0.04,
            'bus': 0.08,
            'car': 0.21,
            'plane': 0.25,
            'cruise': 0.40
        }
        
        # Accommodation carbon footprints (kg CO2 per night)
        self.accommodation_footprints = {
            'camping': 2,
            'hostel': 8,
            'hotel': 15,
            'resort': 25,
            'luxury_resort': 40
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
    
    async def predict_sustainability(
        self, 
        user_preferences: Dict[str, Any],
        user_events: List[Dict[str, Any]],
        context: Optional[Dict[str, Any]] = None
    ) -> SustainabilityPrediction:
        """Predict sustainability preferences and recommendations"""
        try:
            # Calculate sustainability score
            sustainability_score = self._calculate_sustainability_score(
                user_preferences, 
                user_events
            )
            
            # Determine sustainability level
            recommended_level = self._determine_sustainability_level(sustainability_score)
            
            # Generate eco recommendations
            eco_recommendations = self._generate_eco_recommendations(
                user_preferences, 
                sustainability_score
            )
            
            # Estimate carbon footprint
            carbon_footprint = self._estimate_carbon_footprint(user_preferences)
            
            # Generate sustainable alternatives
            sustainable_alternatives = self._generate_sustainable_alternatives(
                user_preferences, 
                sustainability_score
            )
            
            # Determine impact potential
            impact_potential = self._determine_impact_potential(sustainability_score)
            
            # Generate reasoning
            reasoning = self._generate_sustainability_reasoning(
                sustainability_score, 
                user_preferences
            )
            
            return SustainabilityPrediction(
                sustainability_score=sustainability_score,
                recommended_level=recommended_level,
                eco_recommendations=eco_recommendations,
                carbon_footprint_estimate=carbon_footprint,
                sustainable_alternatives=sustainable_alternatives,
                impact_potential=impact_potential,
                reasoning=reasoning
            )
            
        except Exception as e:
            self.logger.error(f"Error predicting sustainability: {str(e)}")
            # Return fallback prediction
            return SustainabilityPrediction(
                sustainability_score=0.5,
                recommended_level='moderate',
                eco_recommendations=[
                    "Consider local transportation options",
                    "Choose eco-friendly accommodations"
                ],
                carbon_footprint_estimate={
                    'transport_footprint': 0,
                    'accommodation_footprint': 0,
                    'activities_footprint': 0,
                    'total_footprint': 0,
                    'comparison_to_average': 'average'
                },
                sustainable_alternatives=[],
                impact_potential='moderate',
                reasoning="Fallback prediction due to error"
            )
    
    def _calculate_sustainability_score(
        self, 
        user_preferences: Dict[str, Any], 
        user_events: List[Dict[str, Any]]
    ) -> float:
        """Calculate overall sustainability score (0-1)"""
        score = 0.5  # Base score
        
        # Travel preferences impact
        travel_prefs = user_preferences.get('travel', {})
        sustainability_level = travel_prefs.get('sustainabilityLevel', 'moderate')
        
        sustainability_scores = {
            'low': 0.2,
            'moderate': 0.5,
            'high': 0.8,
            'very_high': 0.95
        }
        
        score = sustainability_scores.get(sustainability_level, 0.5)
        
        # Transportation preferences
        transport_prefs = travel_prefs.get('transportationPreferences', [])
        
        eco_transport_bonus = {
            'walking': 0.1,
            'bicycle': 0.1,
            'train': 0.08,
            'bus': 0.05,
            'electric_vehicle': 0.06
        }
        
        for transport in transport_prefs:
            if transport in eco_transport_bonus:
                score += eco_transport_bonus[transport]
        
        # Accommodation preferences
        accommodation_prefs = travel_prefs.get('accommodationPreferences', [])
        
        eco_accommodation_bonus = {
            'camping': 0.1,
            'hostel': 0.05,
            'glamping': 0.03
        }
        
        for accommodation in accommodation_prefs:
            if accommodation in eco_accommodation_bonus:
                score += eco_accommodation_bonus[accommodation]
        
        # Activity preferences
        activities = travel_prefs.get('activities', [])
        
        eco_activity_bonus = {
            'hiking': 0.05,
            'nature': 0.05,
            'wildlife': 0.03,
            'photography': 0.02
        }
        
        for activity in activities:
            if activity in eco_activity_bonus:
                score += eco_activity_bonus[activity]
        
        # Personalization settings
        personalization = user_preferences.get('personalization', {})
        
        if personalization.get('includeLocalTips'):
            score += 0.05
        
        if personalization.get('includeCulturalInfo'):
            score += 0.03
        
        # Event-based analysis
        if user_events:
            # Check for eco-conscious behavior
            eco_events = [
                event for event in user_events
                if 'eco' in str(event.get('newValue', '')).lower() or
                   'sustainable' in str(event.get('newValue', '')).lower() or
                   'green' in str(event.get('newValue', '')).lower()
            ]
            
            if eco_events:
                score += min(len(eco_events) * 0.02, 0.1)
        
        return min(score, 1.0)  # Cap at 1.0
    
    def _determine_sustainability_level(self, score: float) -> str:
        """Determine sustainability level based on score"""
        if score >= 0.8:
            return 'high'
        elif score >= 0.6:
            return 'moderate'
        elif score >= 0.4:
            return 'low'
        else:
            return 'minimal'
    
    def _generate_eco_recommendations(
        self, 
        user_preferences: Dict[str, Any], 
        score: float
    ) -> List[str]:
        """Generate eco-friendly recommendations"""
        recommendations = []
        
        # Base recommendations for everyone
        recommendations.extend([
            "Choose local transportation options when possible",
            "Support local businesses and communities",
            "Reduce single-use plastics during travel"
        ])
        
        # Score-based recommendations
        if score < 0.5:
            recommendations.extend([
                "Consider eco-friendly accommodations",
                "Opt for sustainable tour operators",
                "Learn about local environmental initiatives"
            ])
        elif score < 0.8:
            recommendations.extend([
                "Calculate and offset your carbon footprint",
                "Choose sustainable activities and experiences",
                    "Support conservation projects in destinations"
            ])
        else:
            recommendations.extend([
                "Share your sustainable travel experiences",
                "Mentor others on eco-friendly travel",
                "Participate in local environmental volunteering"
            ])
        
        # Preference-specific recommendations
        travel_prefs = user_preferences.get('travel', {})
        transport_prefs = travel_prefs.get('transportationPreferences', [])
        
        if 'car' in transport_prefs or 'plane' in transport_prefs:
            recommendations.append("Consider carbon offsetting for your transportation")
        
        accommodation_prefs = travel_prefs.get('accommodationPreferences', [])
        if 'resort' in accommodation_prefs or 'luxury_resort' in accommodation_prefs:
            recommendations.append("Look for eco-certified luxury accommodations")
        
        return recommendations[:8]  # Limit to top 8 recommendations
    
    def _estimate_carbon_footprint(
        self, 
        user_preferences: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Estimate carbon footprint based on preferences"""
        travel_prefs = user_preferences.get('travel', {})
        
        # Transport footprint
        transport_prefs = travel_prefs.get('transportationPreferences', [])
        transport_footprint = 0
        
        for transport in transport_prefs:
            if transport in self.transport_footprints:
                # Assume average distance for estimation
                avg_distance = 100  # km
                transport_footprint += self.transport_footprints[transport] * avg_distance
        
        # Accommodation footprint
        accommodation_prefs = travel_prefs.get('accommodationPreferences', [])
        accommodation_footprint = 0
        
        for accommodation in accommodation_prefs:
            if accommodation in self.accommodation_footprints:
                # Assume average stay of 3 nights
                accommodation_footprint += self.accommodation_footprints[accommodation] * 3
        
        # Activities footprint (simplified estimation)
        activities = travel_prefs.get('activities', [])
        activities_footprint = len(activities) * 2  # kg CO2 per activity
        
        total_footprint = transport_footprint + accommodation_footprint + activities_footprint
        
        # Comparison to average traveler (assumed average of 500 kg CO2 per trip)
        comparison = 'below_average'
        if total_footprint > 600:
            comparison = 'above_average'
        elif total_footprint > 400:
            comparison = 'average'
        
        return {
            'transport_footprint': round(transport_footprint, 2),
            'accommodation_footprint': round(accommodation_footprint, 2),
            'activities_footprint': round(activities_footprint, 2),
            'total_footprint': round(total_footprint, 2),
            'comparison_to_average': comparison
        }
    
    def _generate_sustainable_alternatives(
        self, 
        user_preferences: Dict[str, Any], 
        score: float
    ) -> List[Dict[str, Any]]:
        """Generate sustainable alternatives to current preferences"""
        alternatives = []
        
        travel_prefs = user_preferences.get('travel', {})
        
        # Transport alternatives
        transport_prefs = travel_prefs.get('transportationPreferences', [])
        
        transport_alternatives = {
            'plane': {
                'alternative': 'train',
                'carbon_reduction': '90%',
                'description': 'Train travel produces significantly less CO2 emissions'
            },
            'car': {
                'alternative': 'electric_vehicle',
                'carbon_reduction': '75%',
                'description': 'Electric vehicles have much lower carbon footprint'
            },
            'bus': {
                'alternative': 'train',
                'carbon_reduction': '50%',
                'description': 'Trains are often more efficient than buses'
            }
        }
        
        for transport in transport_prefs:
            if transport in transport_alternatives:
                alt = transport_alternatives[transport]
                alternatives.append({
                    'category': 'transportation',
                    'current_choice': transport,
                    'sustainable_alternative': alt['alternative'],
                    'carbon_reduction': alt['carbon_reduction'],
                    'description': alt['description']
                })
        
        # Accommodation alternatives
        accommodation_prefs = travel_prefs.get('accommodationPreferences', [])
        
        accommodation_alternatives = {
            'hotel': {
                'alternative': 'eco_hotel',
                'carbon_reduction': '40%',
                'description': 'Eco-certified hotels use renewable energy and reduce waste'
            },
            'resort': {
                'alternative': 'eco_resort',
                'carbon_reduction': '35%',
                'description': 'Eco-resorts focus on sustainability and local community support'
            },
            'luxury_resort': {
                'alternative': 'sustainable_luxury',
                'carbon_reduction': '30%',
                'description': 'Sustainable luxury options maintain comfort while reducing impact'
            }
        }
        
        for accommodation in accommodation_prefs:
            if accommodation in accommodation_alternatives:
                alt = accommodation_alternatives[accommodation]
                alternatives.append({
                    'category': 'accommodation',
                    'current_choice': accommodation,
                    'sustainable_alternative': alt['alternative'],
                    'carbon_reduction': alt['carbon_reduction'],
                    'description': alt['description']
                })
        
        # Activity alternatives
        activities = travel_prefs.get('activities', [])
        
        activity_alternatives = {
            'nightlife': {
                'alternative': 'cultural_evening',
                'carbon_reduction': '60%',
                'description': 'Cultural activities often have lower environmental impact'
            },
            'shopping': {
                'alternative': 'local_markets',
                'carbon_reduction': '50%',
                'description': 'Local markets support communities and reduce transport emissions'
            }
        }
        
        for activity in activities:
            if activity in activity_alternatives:
                alt = activity_alternatives[activity]
                alternatives.append({
                    'category': 'activities',
                    'current_choice': activity,
                    'sustainable_alternative': alt['alternative'],
                    'carbon_reduction': alt['carbon_reduction'],
                    'description': alt['description']
                })
        
        return alternatives[:6]  # Limit to top 6 alternatives
    
    def _determine_impact_potential(self, score: float) -> str:
        """Determine potential for positive environmental impact"""
        if score >= 0.8:
            return 'high_impact_ambassador'
        elif score >= 0.6:
            return 'moderate_impact_adopter'
        elif score >= 0.4:
            return 'low_impact_learner'
        else:
            return 'potential_for_growth'
    
    def _generate_sustainability_reasoning(
        self, 
        score: float, 
        user_preferences: Dict[str, Any]
    ) -> str:
        """Generate reasoning for sustainability prediction"""
        reasoning_parts = []
        
        # Score-based reasoning
        if score >= 0.8:
            reasoning_parts.append("User shows strong sustainability awareness and eco-conscious choices")
        elif score >= 0.6:
            reasoning_parts.append("User demonstrates moderate environmental consideration in travel choices")
        elif score >= 0.4:
            reasoning_parts.append("User has some eco-friendly preferences but room for improvement")
        else:
            reasoning_parts.append("User could benefit from more sustainable travel options")
        
        # Preference-based reasoning
        travel_prefs = user_preferences.get('travel', {})
        
        # Transport reasoning
        transport_prefs = travel_prefs.get('transportationPreferences', [])
        eco_transports = ['walking', 'bicycle', 'train', 'electric_vehicle']
        eco_transport_count = len([t for t in transport_prefs if t in eco_transports])
        
        if eco_transport_count > 0:
            reasoning_parts.append(f"User prefers {eco_transport_count} eco-friendly transportation options")
        
        # Accommodation reasoning
        accommodation_prefs = travel_prefs.get('accommodationPreferences', [])
        eco_accommodations = ['camping', 'hostel', 'glamping']
        eco_accommodation_count = len([a for a in accommodation_prefs if a in eco_accommodations])
        
        if eco_accommodation_count > 0:
            reasoning_parts.append(f"User favors {eco_accommodation_count} sustainable accommodation types")
        
        # Activity reasoning
        activities = travel_prefs.get('activities', [])
        nature_activities = ['hiking', 'nature', 'wildlife', 'photography']
        nature_activity_count = len([a for a in activities if a in nature_activities])
        
        if nature_activity_count > 0:
            reasoning_parts.append(f"User enjoys {nature_activity_count} nature-based activities")
        
        return ". ".join(reasoning_parts)
    
    async def create_sustainability_profile(
        self, 
        user_preferences: Dict[str, Any],
        user_events: List[Dict[str, Any]]
    ) -> SustainabilityProfile:
        """Create a comprehensive sustainability profile"""
        try:
            # Calculate sustainability score
            score = self._calculate_sustainability_score(user_preferences, user_events)
            
            # Determine profile components
            sustainability_level = self._determine_sustainability_level(score)
            
            # Eco-consciousness level
            if score >= 0.8:
                eco_consciousness = 'very_high'
            elif score >= 0.6:
                eco_consciousness = 'high'
            elif score >= 0.4:
                eco_consciousness = 'moderate'
            else:
                eco_consciousness = 'low'
            
            # Carbon footprint awareness
            travel_prefs = user_preferences.get('travel', {})
            if travel_prefs.get('sustainabilityLevel') in ['high', 'very_high']:
                carbon_footprint_awareness = 'high'
            elif travel_prefs.get('sustainabilityLevel') == 'moderate':
                carbon_footprint_awareness = 'moderate'
            else:
                carbon_footprint_awareness = 'low'
            
            # Local preference
            personalization = user_preferences.get('personalization', {})
            local_preference = 'high' if personalization.get('includeLocalTips') else 'moderate'
            
            # Sustainable transport preference
            transport_prefs = travel_prefs.get('transportationPreferences', [])
            eco_transports = ['walking', 'bicycle', 'train', 'electric_vehicle']
            sustainable_transport_preference = 'high' if len([t for t in transport_prefs if t in eco_transports]) >= 2 else 'moderate'
            
            # Ethical considerations
            activities = travel_prefs.get('activities', [])
            ethical_activities = ['wildlife', 'photography', 'nature']
            ethical_considerations = 'high' if len([a for a in activities if a in ethical_activities]) >= 2 else 'moderate'
            
            return SustainabilityProfile(
                sustainability_level=sustainability_level,
                eco_consciousness=eco_consciousness,
                carbon_footprint_awareness=carbon_footprint_awareness,
                local_preference=local_preference,
                sustainable_transport_preference=sustainable_transport_preference,
                ethical_considerations=ethical_considerations
            )
            
        except Exception as e:
            self.logger.error(f"Error creating sustainability profile: {str(e)}")
            return SustainabilityProfile(
                sustainability_level='moderate',
                eco_consciousness='moderate',
                carbon_footprint_awareness='moderate',
                local_preference='moderate',
                sustainable_transport_preference='moderate',
                ethical_considerations='moderate'
            )
    
    async def calculate_trip_sustainability(
        self, 
        trip_details: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Calculate sustainability metrics for a specific trip"""
        try:
            # Extract trip components
            transportation = trip_details.get('transportation', {})
            accommodation = trip_details.get('accommodation', {})
            activities = trip_details.get('activities', [])
            duration_days = trip_details.get('duration', 7)
            
            # Calculate carbon footprint
            transport_footprint = 0
            if transportation.get('type') in self.transport_footprints:
                distance = transportation.get('distance', 100)  # km
                transport_footprint = self.transport_footprints[transportation['type']] * distance
            
            accommodation_footprint = 0
            if accommodation.get('type') in self.accommodation_footprints:
                accommodation_footprint = self.accommodation_footprints[accommodation['type']] * duration_days
            
            activities_footprint = len(activities) * 2  # kg CO2 per activity
            
            total_footprint = transport_footprint + accommodation_footprint + activities_footprint
            
            # Calculate sustainability score for the trip
            trip_score = 1.0 - min(total_footprint / 1000, 1.0)  # Normalize to 0-1
            
            # Generate trip recommendations
            recommendations = []
            
            if transport_footprint > 200:
                recommendations.append("Consider more sustainable transportation options")
            
            if accommodation_footprint > 100:
                recommendations.append("Look for eco-certified accommodations")
            
            if len(activities) > 10:
                recommendations.append("Focus on quality over quantity for activities")
            
            # Determine sustainability rating
            if trip_score >= 0.8:
                rating = 'excellent'
            elif trip_score >= 0.6:
                rating = 'good'
            elif trip_score >= 0.4:
                rating = 'fair'
            else:
                rating = 'poor'
            
            return {
                'sustainability_score': round(trip_score, 2),
                'carbon_footprint': {
                    'transport': round(transport_footprint, 2),
                    'accommodation': round(accommodation_footprint, 2),
                    'activities': round(activities_footprint, 2),
                    'total': round(total_footprint, 2)
                },
                'sustainability_rating': rating,
                'recommendations': recommendations,
                'eco_score_breakdown': {
                    'transport_score': max(0, 1 - transport_footprint / 500),
                    'accommodation_score': max(0, 1 - accommodation_footprint / 200),
                    'activities_score': max(0, 1 - activities_footprint / 50)
                }
            }
            
        except Exception as e:
            self.logger.error(f"Error calculating trip sustainability: {str(e)}")
            return {
                'sustainability_score': 0.5,
                'carbon_footprint': {'total': 0},
                'sustainability_rating': 'fair',
                'recommendations': [],
                'eco_score_breakdown': {}
            }

# Global service instance
sustainability_predictor = SustainabilityPredictor()
