"""
Personalization Predictor
Predicts optimal personalization settings based on user behavior and preferences
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

class PersonalizationProfile(BaseModel):
    """User personalization profile"""
    communication_style: str
    content_preference: str
    interaction_pattern: str
    learning_style: str
    decision_speed: str
    privacy_preference: str
    customization_level: str

class PersonalizationPrediction(BaseModel):
    """Personalization prediction result"""
    recommended_settings: Dict[str, Any]
    confidence_score: float
    reasoning: str
    personalization_factors: List[str]
    adaptation_suggestions: List[str]

class ContentPreference(BaseModel):
    """Content preference model"""
    content_type: str
    preferred_length: str
    detail_level: str
    visual_preference: str
    interaction_style: str

class InteractionPattern(BaseModel):
    """User interaction pattern"""
    click_frequency: str
    session_duration: str
    exploration_tendency: str
    feature_usage: List[str]

class PersonalizationPredictor:
    """Service for predicting optimal personalization settings"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self._setup_logging()
        
        # Communication styles
        self.communication_styles = {
            'formal': 'professional_detailed',
            'casual': 'friendly_concise',
            'technical': 'detailed_explanations',
            'visual': 'visual_heavy'
        }
        
        # Content preferences
        self.content_preferences = {
            'minimalist': 'essential_info_only',
            'comprehensive': 'detailed_complete',
            'balanced': 'key_info_plus_details',
            'interactive': 'engaging_elements'
        }
        
        # Learning styles
        self.learning_styles = {
            'visual': 'charts_images_videos',
            'textual': 'written_explanations',
            'kinesthetic': 'interactive_elements',
            'auditory': 'audio_explanations'
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
    
    async def predict_personalization(
        self, 
        user_preferences: Dict[str, Any],
        user_events: List[Dict[str, Any]],
        context: Optional[Dict[str, Any]] = None
    ) -> PersonalizationPrediction:
        """Predict optimal personalization settings"""
        try:
            # Analyze user behavior patterns
            interaction_patterns = self._analyze_interaction_patterns(user_events)
            
            # Determine communication style
            communication_style = self._predict_communication_style(
                user_preferences, 
                interaction_patterns
            )
            
            # Determine content preference
            content_preference = self._predict_content_preference(
                user_preferences, 
                interaction_patterns
            )
            
            # Determine learning style
            learning_style = self._predict_learning_style(
                user_preferences, 
                interaction_patterns
            )
            
            # Determine customization level
            customization_level = self._predict_customization_level(
                user_preferences, 
                interaction_patterns
            )
            
            # Generate recommended settings
            recommended_settings = {
                'communication_style': communication_style,
                'content_preference': content_preference,
                'learning_style': learning_style,
                'customization_level': customization_level,
                'ui_theme': self._predict_ui_theme(user_preferences, context),
                'notification_frequency': self._predict_notification_frequency(interaction_patterns),
                'data_sharing_preference': self._predict_data_sharing_preference(user_preferences),
                'feature_discovery': self._predict_feature_discovery(interaction_patterns)
            }
            
            # Calculate confidence score
            confidence_score = self._calculate_personalization_confidence(
                user_preferences, 
                user_events, 
                recommended_settings
            )
            
            # Generate reasoning
            reasoning = self._generate_personalization_reasoning(
                recommended_settings, 
                interaction_patterns
            )
            
            # Identify personalization factors
            personalization_factors = self._identify_personalization_factors(
                user_preferences, 
                interaction_patterns
            )
            
            # Generate adaptation suggestions
            adaptation_suggestions = self._generate_adaptation_suggestions(
                recommended_settings, 
                interaction_patterns
            )
            
            return PersonalizationPrediction(
                recommended_settings=recommended_settings,
                confidence_score=confidence_score,
                reasoning=reasoning,
                personalization_factors=personalization_factors,
                adaptation_suggestions=adaptation_suggestions
            )
            
        except Exception as e:
            self.logger.error(f"Error predicting personalization: {str(e)}")
            # Return fallback prediction
            return PersonalizationPrediction(
                recommended_settings={
                    'communication_style': 'balanced',
                    'content_preference': 'balanced',
                    'learning_style': 'visual',
                    'customization_level': 'medium',
                    'ui_theme': 'auto',
                    'notification_frequency': 'daily',
                    'data_sharing_preference': 'essential',
                    'feature_discovery': 'progressive'
                },
                confidence_score=0.5,
                reasoning="Fallback prediction due to error",
                personalization_factors=[],
                adaptation_suggestions=[]
            )
    
    def _analyze_interaction_patterns(self, events: List[Dict[str, Any]]) -> InteractionPattern:
        """Analyze user interaction patterns from events"""
        if not events:
            return InteractionPattern(
                click_frequency='medium',
                session_duration='medium',
                exploration_tendency='moderate',
                feature_usage=[]
            )
        
        # Count different types of interactions
        click_events = [e for e in events if e.get('action') in ['click', 'select', 'change']]
        
        # Calculate click frequency
        total_events = len(events)
        click_rate = len(click_events) / max(total_events, 1)
        
        if click_rate > 0.8:
            click_frequency = 'high'
        elif click_rate > 0.5:
            click_frequency = 'medium'
        else:
            click_frequency = 'low'
        
        # Analyze session duration (from timestamps)
        if len(events) > 1:
            timestamps = [
                datetime.fromisoformat(event['timestamp'].replace('Z', '+00:00'))
                for event in events
            ]
            session_duration = (max(timestamps) - min(timestamps)).total_seconds()
            
            if session_duration > 1800:  # 30 minutes
                duration_level = 'long'
            elif session_duration > 600:  # 10 minutes
                duration_level = 'medium'
            else:
                duration_level = 'short'
        else:
            duration_level = 'medium'
        
        # Determine exploration tendency
        unique_actions = len(set(event.get('action') for event in events))
        if unique_actions > 5:
            exploration_tendency = 'high'
        elif unique_actions > 3:
            exploration_tendency = 'moderate'
        else:
            exploration_tendency = 'low'
        
        # Identify most used features
        feature_counts = Counter(
            event.get('preference_type', 'unknown') 
            for event in events
        )
        feature_usage = [
            feature for feature, count in feature_counts.most_common(5)
            if feature != 'unknown'
        ]
        
        return InteractionPattern(
            click_frequency=click_frequency,
            session_duration=duration_level,
            exploration_tendency=exploration_tendency,
            feature_usage=feature_usage
        )
    
    def _predict_communication_style(
        self, 
        user_preferences: Dict[str, Any], 
        patterns: InteractionPattern
    ) -> str:
        """Predict optimal communication style"""
        # Base on personalization settings
        personalization = user_preferences.get('personalization', {})
        
        if personalization.get('detailed_itineraries'):
            if patterns.exploration_tendency == 'high':
                return 'technical'
            else:
                return 'formal'
        elif personalization.get('concise_responses'):
            return 'casual'
        elif personalization.get('include_local_tips'):
            return 'visual'
        else:
            # Base on interaction patterns
            if patterns.click_frequency == 'high':
                return 'visual'
            elif patterns.session_duration == 'long':
                return 'technical'
            else:
                return 'balanced'
    
    def _predict_content_preference(
        self, 
        user_preferences: Dict[str, Any], 
        patterns: InteractionPattern
    ) -> str:
        """Predict optimal content preference"""
        # Base on user behavior
        if patterns.exploration_tendency == 'high':
            return 'comprehensive'
        elif patterns.click_frequency == 'low':
            return 'minimalist'
        elif patterns.session_duration == 'short':
            return 'minimalist'
        elif patterns.feature_usage and len(patterns.feature_usage) > 3:
            return 'interactive'
        else:
            return 'balanced'
    
    def _predict_learning_style(
        self, 
        user_preferences: Dict[str, Any], 
        patterns: InteractionPattern
    ) -> str:
        """Predict optimal learning style"""
        # Base on interaction patterns
        if patterns.click_frequency == 'high' and patterns.exploration_tendency == 'high':
            return 'kinesthetic'
        elif patterns.session_duration == 'long':
            return 'textual'
        elif 'budget' in patterns.feature_usage:
            return 'visual'  # Budget users often prefer visual data
        else:
            return 'visual'  # Default to visual for better UX
    
    def _predict_customization_level(
        self, 
        user_preferences: Dict[str, Any], 
        patterns: InteractionPattern
    ) -> str:
        """Predict optimal customization level"""
        # Base on exploration tendency and feature usage
        if patterns.exploration_tendency == 'high':
            return 'high'
        elif patterns.exploration_tendency == 'moderate':
            return 'medium'
        else:
            return 'low'
    
    def _predict_ui_theme(
        self, 
        user_preferences: Dict[str, Any], 
        context: Optional[Dict[str, Any]]
    ) -> str:
        """Predict optimal UI theme"""
        # Check for explicit preference
        interface_settings = user_preferences.get('interfaceSettings', {})
        if interface_settings.get('theme'):
            return interface_settings['theme']
        
        # Base on context
        if context:
            if context.get('time_of_day') in ['evening', 'night']:
                return 'dark'
            elif context.get('device_type') == 'mobile':
                return 'light'  # Better for mobile readability
        
        return 'auto'  # Default to auto
    
    def _predict_notification_frequency(
        self, 
        patterns: InteractionPattern
    ) -> str:
        """Predict optimal notification frequency"""
        if patterns.click_frequency == 'high':
            return 'real_time'
        elif patterns.session_duration == 'long':
            return 'daily'
        elif patterns.click_frequency == 'low':
            return 'weekly'
        else:
            return 'daily'
    
    def _predict_data_sharing_preference(
        self, 
        user_preferences: Dict[str, Any]
    ) -> str:
        """Predict data sharing preference"""
        privacy_settings = user_preferences.get('privacySettings', {})
        
        if privacy_settings.get('shareDataForImprovement'):
            return 'full'
        elif privacy_settings.get('allowPersonalization'):
            return 'essential'
        else:
            return 'minimal'
    
    def _predict_feature_discovery(
        self, 
        patterns: InteractionPattern
    ) -> str:
        """Predict optimal feature discovery approach"""
        if patterns.exploration_tendency == 'high':
            return 'explore_all'
        elif patterns.click_frequency == 'medium':
            return 'progressive'
        else:
            return 'guided'
    
    def _calculate_personalization_confidence(
        self, 
        user_preferences: Dict[str, Any], 
        user_events: List[Dict[str, Any]], 
        settings: Dict[str, Any]
    ) -> float:
        """Calculate confidence score for personalization prediction"""
        confidence = 0.3  # Base confidence
        
        # Increase based on data availability
        if user_preferences:
            confidence += 0.2
        
        if user_events and len(user_events) > 5:
            confidence += 0.2
        
        if user_events and len(user_events) > 20:
            confidence += 0.1
        
        # Increase based on preference specificity
        personalization = user_preferences.get('personalization', {})
        if personalization.get('detailed_itineraries') or personalization.get('concise_responses'):
            confidence += 0.1
        
        # Increase based on interaction consistency
        if user_events:
            actions = [event.get('action') for event in user_events]
            unique_actions = len(set(actions))
            if unique_actions < len(actions) * 0.5:  # Some repetition indicates preferences
                confidence += 0.1
        
        return min(confidence, 0.95)  # Cap at 95%
    
    def _generate_personalization_reasoning(
        self, 
        settings: Dict[str, Any], 
        patterns: InteractionPattern
    ) -> str:
        """Generate reasoning for personalization prediction"""
        reasoning_parts = []
        
        # Communication style reasoning
        style_reasons = {
            'formal': "User prefers detailed, professional communication",
            'casual': "User prefers friendly, concise communication",
            'technical': "User enjoys detailed explanations and technical information",
            'visual': "User responds well to visual communication elements"
        }
        
        reasoning_parts.append(style_reasons.get(settings['communication_style'], ""))
        
        # Content preference reasoning
        content_reasons = {
            'minimalist': "User prefers essential information only",
            'comprehensive': "User wants complete, detailed information",
            'balanced': "User prefers key information with some details",
            'interactive': "User enjoys engaging and interactive content"
        }
        
        reasoning_parts.append(content_reasons.get(settings['content_preference'], ""))
        
        # Interaction pattern reasoning
        if patterns.exploration_tendency == 'high':
            reasoning_parts.append("User shows high exploration tendency, indicating curiosity")
        elif patterns.click_frequency == 'low':
            reasoning_parts.append("User shows deliberate interaction patterns")
        
        return ". ".join([part for part in reasoning_parts if part])
    
    def _identify_personalization_factors(
        self, 
        user_preferences: Dict[str, Any], 
        patterns: InteractionPattern
    ) -> List[str]:
        """Identify key personalization factors"""
        factors = []
        
        # Communication factors
        personalization = user_preferences.get('personalization', {})
        if personalization.get('detailed_itineraries'):
            factors.append("detail_oriented")
        
        if personalization.get('include_local_tips'):
            factors.append("local_insight_seeker")
        
        if personalization.get('concise_responses'):
            factors.append("efficiency_focused")
        
        # Interaction factors
        if patterns.exploration_tendency == 'high':
            factors.append("explorer")
        
        if patterns.click_frequency == 'high':
            factors.append("active_interactor")
        
        if patterns.session_duration == 'long':
            factors.append("deep_engager")
        
        # Feature usage factors
        if 'budget' in patterns.feature_usage:
            factors.append("budget_conscious")
        
        if len(patterns.feature_usage) > 3:
            factors.append("feature_explorer")
        
        return factors[:5]  # Limit to top 5 factors
    
    def _generate_adaptation_suggestions(
        self, 
        settings: Dict[str, Any], 
        patterns: InteractionPattern
    ) -> List[str]:
        """Generate suggestions for personalization adaptation"""
        suggestions = []
        
        # Communication adaptations
        if settings['communication_style'] == 'visual':
            suggestions.append("Add more visual elements to responses")
            suggestions.append("Include charts and graphs for data")
        
        if settings['content_preference'] == 'comprehensive':
            suggestions.append("Provide detailed explanations and background")
            suggestions.append("Include related information and context")
        
        # Interaction adaptations
        if patterns.exploration_tendency == 'high':
            suggestions.append("Enable advanced features and options")
            suggestions.append("Provide discovery paths for new features")
        
        if patterns.click_frequency == 'low':
            suggestions.append("Simplify interface and highlight key actions")
            suggestions.append("Provide clear guidance and next steps")
        
        # Learning style adaptations
        if settings['learning_style'] == 'kinesthetic':
            suggestions.append("Add interactive elements and hands-on features")
            suggestions.append("Include step-by-step guides and tutorials")
        
        return suggestions[:5]  # Limit to top 5 suggestions
    
    async def create_personalization_profile(
        self, 
        user_preferences: Dict[str, Any],
        user_events: List[Dict[str, Any]]
    ) -> PersonalizationProfile:
        """Create a comprehensive personalization profile"""
        try:
            # Analyze interaction patterns
            patterns = self._analyze_interaction_patterns(user_events)
            
            # Determine profile components
            communication_style = self._predict_communication_style(user_preferences, patterns)
            content_preference = self._predict_content_preference(user_preferences, patterns)
            learning_style = self._predict_learning_style(user_preferences, patterns)
            
            # Determine additional profile aspects
            interaction_pattern = f"{patterns.click_frequency}_{patterns.exploration_tendency}"
            
            # Decision speed based on interaction patterns
            if patterns.click_frequency == 'high' and patterns.session_duration == 'short':
                decision_speed = 'fast'
            elif patterns.click_frequency == 'low' and patterns.session_duration == 'long':
                decision_speed = 'deliberate'
            else:
                decision_speed = 'moderate'
            
            # Privacy preference
            privacy_preference = self._predict_data_sharing_preference(user_preferences)
            
            # Customization level
            customization_level = self._predict_customization_level(user_preferences, patterns)
            
            return PersonalizationProfile(
                communication_style=communication_style,
                content_preference=content_preference,
                interaction_pattern=interaction_pattern,
                learning_style=learning_style,
                decision_speed=decision_speed,
                privacy_preference=privacy_preference,
                customization_level=customization_level
            )
            
        except Exception as e:
            self.logger.error(f"Error creating personalization profile: {str(e)}")
            return PersonalizationProfile(
                communication_style='balanced',
                content_preference='balanced',
                interaction_pattern='medium_moderate',
                learning_style='visual',
                decision_speed='moderate',
                privacy_preference='essential',
                customization_level='medium'
            )

# Global service instance
personalization_predictor = PersonalizationPredictor()
