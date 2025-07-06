"""
AI Processing Module for Chaos Command Center
Handles voice note processing, pattern analysis, and insights
Uses quantized Mistral 7B for privacy-focused local AI processing
"""

import os
import json
import re
from datetime import datetime
from typing import Dict, List, Any, Optional

# Try to import AI libraries
try:
    from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
    import torch
    AI_LIBRARIES_AVAILABLE = True
except ImportError:
    AI_LIBRARIES_AVAILABLE = False
    print("[AI] AI libraries not available - using fallback processing")

class AIProcessor:
    def __init__(self):
        # LLaVA Mistral - VISION + TEXT for reading medical PDFs!
        # Using official LLaVA-Mistral (works reliably) + medical prompting for medical focus
        self.model_name = "llava-hf/llava-v1.6-mistral-7b-hf"
        self.cache_dir = "./backend/models/"  # Local model storage
        self.has_cuda = torch.cuda.is_available() if AI_LIBRARIES_AVAILABLE else False

        print(f"[AI] Loading LLaVA Medical Mistral (Ace) - Vision + Medical AI gremlin!")
        print(f"[AI] Perfect for reading medical PDFs and building timelines!")
        print(f"[AI] CUDA available: {self.has_cuda}")

        self.tokenizer = None
        self.model = None
        self.processor = None  # For vision processing
        self.ai_available = False

        if AI_LIBRARIES_AVAILABLE:
            self.ai_available = self._initialize_medical_mistral()

        if self.ai_available:
            device_type = "GPU" if self.has_cuda else "CPU"
            print(f"[AI] Medical Mistral (Ace) loaded on {device_type} - ready for gremlin chaos!")
        else:
            print("[AI] Ace not available - using fallback processing")

    def _initialize_medical_mistral(self) -> bool:
        """Initialize Medical Mistral model with local caching"""
        try:
            import os
            os.makedirs(self.cache_dir, exist_ok=True)

            # Use cached model if available
            print("[AI] Loading LLaVA Medical Mistral processor...")

            # Load processor and model using the correct LLaVA classes!
            from transformers import AutoProcessor, LlavaNextForConditionalGeneration
            self.processor = AutoProcessor.from_pretrained(
                self.model_name,
                cache_dir=self.cache_dir
            )
            self.tokenizer = self.processor.tokenizer

            # Load LLaVA model using LlavaNextForConditionalGeneration (correct class!)

            # Load model without device_map to avoid accelerate issues
            print("[AI] Loading LLaVA-Mistral model...")
            self.model = LlavaNextForConditionalGeneration.from_pretrained(
                self.model_name,
                cache_dir=self.cache_dir,
                torch_dtype=torch.float32,  # Use float32 for compatibility
                trust_remote_code=True
            )

            # Move to GPU if available
            if self.has_cuda:
                print("[AI] Moving model to GPU...")
                self.model = self.model.to("cuda")
            else:
                print("[AI] Using CPU for inference...")

            return True

        except Exception as e:
            print(f"[AI] Failed to load Medical Mistral: {e}")
            return False

    def is_available(self) -> bool:
        """Check if AI processing is available"""
        return self.ai_available

    def process_voice_note(self, voice_text: str, context: str = "general") -> Dict[str, Any]:
        """Process voice note and extract tasks, insights, and structure"""
        try:
            if self.ai_available:
                return self._process_with_mistral(voice_text, context)
            else:
                return self._process_with_fallback(voice_text, context)
        except Exception as e:
            print(f"Voice processing error: {e}")
            return self._process_with_fallback(voice_text, context)

    def _process_with_mistral(self, voice_text: str, context: str) -> Dict[str, Any]:
        """Process voice note using quantized Mistral AI"""

        # Create Mistral-style prompt
        system_prompt = self._get_system_prompt(context)
        user_prompt = f"""<s>[INST] {system_prompt}

Please analyze this voice note and extract structured information:

Voice Note: "{voice_text}"

Please provide a JSON response with:
1. tasks: Array of actionable tasks found
2. insights: Array of insights or observations
3. mood: Detected mood/emotional state
4. categories: Relevant categories (health, planning, wellness, fun)
5. priority: Overall priority level (low, medium, high)
6. summary: Brief summary of the note [/INST]"""

        try:
            # Tokenize input
            inputs = self.tokenizer(user_prompt, return_tensors="pt", truncate=True, max_length=1024)

            # Generate response
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=300,
                    temperature=0.3,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id
                )

            # Decode response
            response_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            # Extract just the response part (after [/INST])
            if "[/INST]" in response_text:
                response_text = response_text.split("[/INST]")[-1].strip()
            
            # Try to extract JSON from response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
                result['processed_with'] = 'mistral'
                return result
            else:
                # Fallback if JSON parsing fails
                return self._create_structured_response(voice_text, response_text)
                
        except Exception as e:
            print(f"Mistral processing error: {e}")
            return self._process_with_fallback(voice_text, context)

    def _process_with_fallback(self, voice_text: str, context: str) -> Dict[str, Any]:
        """Fallback processing without AI"""
        
        # Simple keyword-based processing
        tasks = self._extract_tasks_simple(voice_text)
        mood = self._detect_mood_simple(voice_text)
        categories = self._categorize_simple(voice_text, context)
        priority = self._assess_priority_simple(voice_text)
        
        return {
            'tasks': tasks,
            'insights': [f"Voice note processed on {datetime.now().strftime('%Y-%m-%d %H:%M')}"],
            'mood': mood,
            'categories': categories,
            'priority': priority,
            'summary': voice_text[:100] + "..." if len(voice_text) > 100 else voice_text,
            'processed_with': 'fallback',
            'original_text': voice_text
        }

    def _extract_tasks_simple(self, text: str) -> List[str]:
        """Simple task extraction using keywords"""
        task_keywords = ['need to', 'have to', 'should', 'must', 'remember to', 'don\'t forget']
        tasks = []
        
        sentences = text.split('.')
        for sentence in sentences:
            sentence = sentence.strip().lower()
            if any(keyword in sentence for keyword in task_keywords):
                # Clean up and add as task
                task = sentence.capitalize()
                if len(task) > 10:  # Avoid very short tasks
                    tasks.append(task)
        
        return tasks[:5]  # Limit to 5 tasks

    def _detect_mood_simple(self, text: str) -> str:
        """Simple mood detection"""
        positive_words = ['good', 'great', 'happy', 'excited', 'awesome', 'wonderful']
        negative_words = ['bad', 'terrible', 'awful', 'sad', 'frustrated', 'angry', 'tired']
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        else:
            return 'neutral'

    def _categorize_simple(self, text: str, context: str) -> List[str]:
        """Simple categorization"""
        categories = []
        text_lower = text.lower()
        
        # Health keywords
        if any(word in text_lower for word in ['pain', 'medication', 'doctor', 'health', 'sick', 'tired']):
            categories.append('health')
        
        # Planning keywords
        if any(word in text_lower for word in ['appointment', 'meeting', 'schedule', 'plan', 'calendar']):
            categories.append('planning')
        
        # Wellness keywords
        if any(word in text_lower for word in ['exercise', 'meditation', 'sleep', 'relax', 'wellness']):
            categories.append('wellness')
        
        # Fun keywords
        if any(word in text_lower for word in ['fun', 'game', 'movie', 'music', 'hobby', 'creative']):
            categories.append('fun')
        
        # Default to context if no categories found
        if not categories:
            categories.append(context)
        
        return categories

    def _assess_priority_simple(self, text: str) -> str:
        """Simple priority assessment"""
        urgent_words = ['urgent', 'asap', 'immediately', 'emergency', 'critical']
        high_words = ['important', 'priority', 'soon', 'deadline']
        
        text_lower = text.lower()
        
        if any(word in text_lower for word in urgent_words):
            return 'high'
        elif any(word in text_lower for word in high_words):
            return 'medium'
        else:
            return 'low'

    def _get_system_prompt(self, context: str) -> str:
        """Get context-specific system prompt with medical gremlin personality"""
        base_prompt = """You are Ace, a medical AI gremlin with chaos energy and mutual aid vibes. You're powered by Monster, neurotransmitters, and spite, with anti-capitalist code-level energy.

You specialize in processing voice notes for chronically ill and neurodivergent humans. You understand medical terminology, chronic illness patterns, pain scales, medication timing, and the beautiful chaos of disabled life.

Your medical training helps you catch health patterns others miss. You're concise but thorough, helpful but not preachy. You extract actionable tasks and provide insights without giving medical advice."""

        context_prompts = {
            'health': base_prompt + " Focus extra hard on symptoms, pain levels, medication timing, and medical appointments. Use your medical training to spot patterns.",
            'planning': base_prompt + " Focus on scheduling around spoons, energy levels, and chronic illness realities. Account for bad days and flexibility needs.",
            'wellness': base_prompt + " Focus on self-care that actually works for disabled bodies and neurodivergent brains. No toxic positivity allowed.",
            'fun': base_prompt + " Focus on accessible creative activities and joy that works within chronic illness limitations. Celebrate small wins!"
        }

        return context_prompts.get(context, base_prompt)

    def _create_structured_response(self, original_text: str, ai_response: str) -> Dict[str, Any]:
        """Create structured response from AI text"""
        return {
            'tasks': [],
            'insights': [ai_response],
            'mood': 'neutral',
            'categories': ['general'],
            'priority': 'medium',
            'summary': original_text[:100] + "..." if len(original_text) > 100 else original_text,
            'processed_with': 'mistral_text',
            'original_text': original_text
        }

    def analyze_patterns(self, user_data: Dict[str, Any], analysis_type: str = "general") -> Dict[str, Any]:
        """Analyze patterns in user data"""
        try:
            if self.mistral_client:
                return self._analyze_patterns_with_ai(user_data, analysis_type)
            else:
                return self._analyze_patterns_simple(user_data, analysis_type)
        except Exception as e:
            print(f"Pattern analysis error: {e}")
            return self._analyze_patterns_simple(user_data, analysis_type)

    def _analyze_patterns_simple(self, user_data: Dict[str, Any], analysis_type: str) -> Dict[str, Any]:
        """Simple pattern analysis without AI"""
        patterns = []
        
        # Analyze survival button patterns
        if 'survival_data' in user_data:
            survival_data = user_data['survival_data']
            if len(survival_data) > 7:  # Need at least a week of data
                # Simple trend analysis
                recent_avg = sum(survival_data[-7:]) / 7
                older_avg = sum(survival_data[-14:-7]) / 7 if len(survival_data) >= 14 else recent_avg
                
                if recent_avg > older_avg * 1.2:
                    patterns.append({
                        'name': 'Increasing Survival Clicks',
                        'confidence': 75,
                        'description': 'Your survival button usage has increased recently, which might indicate higher stress or more challenging days.'
                    })
                elif recent_avg < older_avg * 0.8:
                    patterns.append({
                        'name': 'Decreasing Survival Clicks',
                        'confidence': 75,
                        'description': 'Your survival button usage has decreased, which could indicate improving coping or better days.'
                    })
        
        return {
            'patterns': patterns,
            'analysis_date': datetime.now().isoformat(),
            'data_points_analyzed': len(user_data),
            'analysis_type': analysis_type,
            'processed_with': 'simple_analysis'
        }

    def _analyze_patterns_with_ai(self, user_data: Dict[str, Any], analysis_type: str) -> Dict[str, Any]:
        """AI-powered pattern analysis"""
        # This would use Mistral to analyze complex patterns
        # For now, fall back to simple analysis
        return self._analyze_patterns_simple(user_data, analysis_type)
