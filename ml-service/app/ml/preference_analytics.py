"""
Preference Analytics Service
Analyzes user AI preferences to generate insights and predictions
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

class BudgetAnalytics(BaseModel):
    """Budget analytics data model"""
    total_events: int
    average_min: float
    average_max: float
    average_range: float
    distribution: Dict[str, int]
    popular_presets: List[Dict[str, Any]]
    trends: List[Dict[str, Any]]

class PreferenceInsight(BaseModel):
    """Preference insight model"""
    type: str
    confidence: float
    description: str
    data: Dict[str, Any]
    recommendations: List[str]

class UserSegment(BaseModel):
    """User segment model"""
    name: str
    size: int
    characteristics: Dict[str, Any]
    budget_range: Tuple[float, float]
    common_preferences: List[str]

class PreferenceAnalyticsService:
    """Service for analyzing AI preferences"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self._setup_logging()
        
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
    
    async def analyze_budget_preferences(
        self, 
        events: List[Dict[str, Any]]
    ) -> BudgetAnalytics:
        """Analyze budget preference events"""
        try:
            budget_events = [
                event for event in events 
                if event.get('preference_type') == 'budget'
            ]
            
            if not budget_events:
                return BudgetAnalytics(
                    total_events=0,
                    average_min=0,
                    average_max=0,
                    average_range=0,
                    distribution={},
                    popular_presets=[],
                    trends=[]
                )
            
            # Extract budget ranges
            budget_ranges = []
            preset_counts = Counter()
            
            for event in budget_events:
                new_value = event.get('new_value', {})
                if isinstance(new_value, dict):
                    min_val = new_value.get('min', 0)
                    max_val = new_value.get('max', 0)
                    budget_ranges.append((min_val, max_val))
                    
                    # Track preset usage
                    context = event.get('context', {})
                    preset = context.get('preset')
                    if preset:
                        preset_counts[preset] += 1
            
            # Calculate statistics
            if budget_ranges:
                mins, maxs = zip(*budget_ranges)
                avg_min = np.mean(mins)
                avg_max = np.mean(maxs)
                avg_range = np.mean(maxs) - np.mean(mins)
            else:
                avg_min = avg_max = avg_range = 0
            
            # Budget distribution
            distribution = {
                'economy': len([r for r in budget_ranges if r[1] <= 2000]),
                'moderate': len([r for r in budget_ranges if 2000 < r[1] <= 5000]),
                'premium': len([r for r in budget_ranges if 5000 < r[1] <= 10000]),
                'luxury': len([r for r in budget_ranges if r[1] > 10000])
            }
            
            # Popular presets
            popular_presets = [
                {'preset': preset, 'count': count}
                for preset, count in preset_counts.most_common(5)
            ]
            
            # Trends (last 7 days vs previous 7 days)
            trends = self._calculate_budget_trends(budget_events)
            
            return BudgetAnalytics(
                total_events=len(budget_events),
                average_min=float(avg_min),
                average_max=float(avg_max),
                average_range=float(avg_range),
                distribution=distribution,
                popular_presets=popular_presets,
                trends=trends
            )
            
        except Exception as e:
            self.logger.error(f"Error analyzing budget preferences: {str(e)}")
            raise
    
    def _calculate_budget_trends(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Calculate budget trends over time"""
        try:
            now = datetime.now()
            last_7_days = now - timedelta(days=7)
            previous_7_days = now - timedelta(days=14)
            
            recent_events = [
                event for event in events
                if datetime.fromisoformat(event['timestamp'].replace('Z', '+00:00')) > last_7_days
            ]
            
            previous_events = [
                event for event in events
                if previous_7_days < datetime.fromisoformat(event['timestamp'].replace('Z', '+00:00')) <= last_7_days
            ]
            
            trends = []
            
            # Budget level trends
            for level in ['economy', 'moderate', 'premium', 'luxury']:
                recent_count = self._count_budget_level(recent_events, level)
                previous_count = self._count_budget_level(previous_events, level)
                
                change_pct = ((recent_count - previous_count) / max(previous_count, 1)) * 100
                
                trends.append({
                    'budget_level': level,
                    'recent_count': recent_count,
                    'previous_count': previous_count,
                    'change_percentage': round(change_pct, 2)
                })
            
            return trends
            
        except Exception as e:
            self.logger.error(f"Error calculating budget trends: {str(e)}")
            return []
    
    def _count_budget_level(self, events: List[Dict[str, Any]], level: str) -> int:
        """Count events for a specific budget level"""
        level_ranges = {
            'economy': (0, 2000),
            'moderate': (2000, 5000),
            'premium': (5000, 10000),
            'luxury': (10000, float('inf'))
        }
        
        min_range, max_range = level_ranges[level]
        count = 0
        
        for event in events:
            new_value = event.get('new_value', {})
            if isinstance(new_value, dict):
                max_val = new_value.get('max', 0)
                if min_range <= max_val < max_range:
                    count += 1
        
        return count
    
    async def generate_preference_insights(
        self, 
        events: List[Dict[str, Any]]
    ) -> List[PreferenceInsight]:
        """Generate insights from preference data"""
        insights = []
        
        try:
            # Budget insights
            budget_insights = await self._generate_budget_insights(events)
            insights.extend(budget_insights)
            
            # User behavior insights
            behavior_insights = await self._generate_behavior_insights(events)
            insights.extend(behavior_insights)
            
            # Popular combinations
            combination_insights = await self._generate_combination_insights(events)
            insights.extend(combination_insights)
            
        except Exception as e:
            self.logger.error(f"Error generating preference insights: {str(e)}")
        
        return insights
    
    async def _generate_budget_insights(self, events: List[Dict[str, Any]]) -> List[PreferenceInsight]:
        """Generate budget-specific insights"""
        insights = []
        
        budget_events = [
            event for event in events 
            if event.get('preference_type') == 'budget'
        ]
        
        if not budget_events:
            return insights
        
        # Most popular budget range
        budget_ranges = [
            (event.get('new_value', {}).get('min', 0), 
             event.get('new_value', {}).get('max', 0))
            for event in budget_events
            if isinstance(event.get('new_value'), dict)
        ]
        
        if budget_ranges:
            # Find most common range (within €500 tolerance)
            range_counts = defaultdict(int)
            for min_val, max_val in budget_ranges:
                # Round to nearest 500 for grouping
                rounded_min = (min_val // 500) * 500
                rounded_max = (max_val // 500) * 500
                range_key = f"{rounded_min}-{rounded_max}"
                range_counts[range_key] += 1
            
            most_common_range = max(range_counts.items(), key=lambda x: x[1])
            
            insights.append(PreferenceInsight(
                type="popular_budget_range",
                confidence=0.8,
                description=f"Most popular budget range is €{most_common_range[0]}",
                data={
                    "range": most_common_range[0],
                    "count": most_common_range[1],
                    "percentage": (most_common_range[1] / len(budget_events)) * 100
                },
                recommendations=[
                    "Feature this range prominently in marketing",
                    "Create packages targeting this budget level",
                    "Optimize search results for this range"
                ]
            ))
        
        return insights
    
    async def _generate_behavior_insights(self, events: List[Dict[str, Any]]) -> List[PreferenceInsight]:
        """Generate user behavior insights"""
        insights = []
        
        # Analyze action types
        action_counts = Counter(event.get('action') for event in events)
        total_events = len(events)
        
        for action, count in action_counts.items():
            percentage = (count / total_events) * 100
            
            if action == 'preset-select' and percentage > 40:
                insights.append(PreferenceInsight(
                    type="preset_preference",
                    confidence=0.9,
                    description=f"Users prefer presets ({percentage:.1f}% of interactions)",
                    data={
                        "action": action,
                        "count": count,
                        "percentage": percentage
                    },
                    recommendations=[
                        "Add more preset options",
                        "Make presets more prominent",
                        "Create smart presets based on user history"
                    ]
                ))
        
        return insights
    
    async def _generate_combination_insights(self, events: List[Dict[str, Any]]) -> List[PreferenceInsight]:
        """Generate insights about preference combinations"""
        insights = []
        
        # Group events by session to analyze user journeys
        session_events = defaultdict(list)
        for event in events:
            session_id = event.get('session_id')
            if session_id:
                session_events[session_id].append(event)
        
        # Analyze common sequences
        sequences = []
        for session_id, session_event_list in session_events.items():
            if len(session_event_list) > 1:
                # Sort by timestamp
                sorted_events = sorted(
                    session_event_list, 
                    key=lambda x: datetime.fromisoformat(x['timestamp'].replace('Z', '+00:00'))
                )
                
                # Create sequence of preference types
                sequence = [event.get('preference_type') for event in sorted_events]
                sequences.append(tuple(sequence))
        
        # Find common sequences
        sequence_counts = Counter(sequences)
        
        if sequence_counts:
            most_common_sequence = sequence_counts.most_common(1)[0]
            
            insights.append(PreferenceInsight(
                type="common_sequence",
                confidence=0.7,
                description=f"Common preference sequence: {' → '.join(most_common_sequence[0])}",
                data={
                    "sequence": most_common_sequence[0],
                    "count": most_common_sequence[1],
                    "percentage": (most_common_sequence[1] / len(session_events)) * 100
                },
                recommendations=[
                    "Optimize UI flow for this sequence",
                    "Add smart defaults for next steps",
                    "Provide contextual help during this sequence"
                ]
            ))
        
        return insights
    
    async def segment_users(
        self, 
        events: List[Dict[str, Any]]
    ) -> List[UserSegment]:
        """Segment users based on their preferences"""
        segments = []
        
        try:
            # Group events by user
            user_events = defaultdict(list)
            for event in events:
                user_id = event.get('user_id')
                if user_id:
                    user_events[user_id].append(event)
            
            # Budget-based segmentation
            budget_segments = self._create_budget_segments(user_events)
            segments.extend(budget_segments)
            
            # Behavior-based segmentation
            behavior_segments = self._create_behavior_segments(user_events)
            segments.extend(behavior_segments)
            
        except Exception as e:
            self.logger.error(f"Error segmenting users: {str(e)}")
        
        return segments
    
    def _create_budget_segments(self, user_events: Dict[str, List[Dict[str, Any]]]) -> List[UserSegment]:
        """Create budget-based user segments"""
        segments = []
        
        budget_levels = {
            'economy': (0, 2000),
            'moderate': (2000, 5000),
            'premium': (5000, 10000),
            'luxury': (10000, float('inf'))
        }
        
        for level, (min_budget, max_budget) in budget_levels.items():
            level_users = []
            
            for user_id, events in user_events.items():
                budget_events = [
                    event for event in events
                    if event.get('preference_type') == 'budget'
                ]
                
                for event in budget_events:
                    new_value = event.get('new_value', {})
                    if isinstance(new_value, dict):
                        max_val = new_value.get('max', 0)
                        if min_budget <= max_val < max_budget:
                            level_users.append(user_id)
                            break
            
            if level_users:
                segments.append(UserSegment(
                    name=f"{level.title()} Travelers",
                    size=len(set(level_users)),
                    characteristics={
                        "budget_level": level,
                        "avg_budget": (min_budget + max_budget) / 2,
                        "price_sensitivity": "high" if level == "economy" else "low"
                    },
                    budget_range=(min_budget, max_budget),
                    common_preferences=[
                        f"budget_{level}",
                        "value_for_money",
                        "cost_effective"
                    ]
                ))
        
        return segments
    
    def _create_behavior_segments(self, user_events: Dict[str, List[Dict[str, Any]]]) -> List[UserSegment]:
        """Create behavior-based user segments"""
        segments = []
        
        # Preset lovers vs customizers
        preset_users = []
        custom_users = []
        
        for user_id, events in user_events.items():
            preset_count = sum(1 for event in events if event.get('action') == 'preset-select')
            custom_count = sum(1 for event in events if event.get('action') == 'custom-input')
            
            if preset_count > custom_count:
                preset_users.append(user_id)
            elif custom_count > preset_count:
                custom_users.append(user_id)
        
        if preset_users:
            segments.append(UserSegment(
                name="Preset Lovers",
                size=len(set(preset_users)),
                characteristics={
                    "preference_type": "preset",
                    "decision_speed": "fast",
                    "complexity_tolerance": "low"
                },
                budget_range=(0, 50000),
                common_preferences=["quick_setup", "guided_choices", "popular_options"]
            ))
        
        if custom_users:
            segments.append(UserSegment(
                name="Customizers",
                size=len(set(custom_users)),
                characteristics={
                    "preference_type": "custom",
                    "decision_speed": "slow",
                    "complexity_tolerance": "high"
                },
                budget_range=(0, 50000),
                common_preferences=["full_control", "detailed_options", "personalization"]
            ))
        
        return segments

# Global service instance
preference_analytics_service = PreferenceAnalyticsService()
