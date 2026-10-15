"""Walter AI Agent — Core Agent Logic."""

from __future__ import annotations

import json
import logging
from typing import Optional, Dict, Any, List

from app.config import settings
from app.agent.prompts import SYSTEM_PROMPT, SUMMARY_PROMPT

logger = logging.getLogger("walter.agent")


class WalterAgent:
    """Walter AI conversational agent.
    
    Uses OpenAI when configured, falls back to a development
    rule-based agent when no API key is available.
    """

    def __init__(self):
        self.profile: Optional[Dict[str, Any]] = None
        self.rules: Optional[Dict[str, Any]] = None
        self._client = None
        self._conversation_history: List[Dict[str, str]] = []

    async def initialize(
        self,
        profile: Optional[Dict[str, Any]] = None,
        rules: Optional[Dict[str, Any]] = None,
    ):
        """Initialize the agent with owner profile and rules."""
        self.profile = profile or {}
        self.rules = rules or {}

        if settings.has_openai:
            from openai import AsyncOpenAI
            self._client = AsyncOpenAI(api_key=settings.openai_api_key)

        # Build system context
        owner_name = self.profile.get("display_name", "the account owner")
        occupation = self.profile.get("occupation", "")
        introduction = self.profile.get("introduction", "")
        approved_info = self.profile.get("approved_information", {})

        owner_context = f"\nOwner name: {owner_name}"
        if occupation:
            owner_context += f"\nOwner occupation: {occupation}"
        if introduction:
            owner_context += f"\nOwner introduction: {introduction}"
        if approved_info:
            owner_context += f"\nApproved information: {json.dumps(approved_info)}"

        greeting = ""
        if self.rules:
            greeting = self.rules.get("greeting", "")
            style = self.rules.get("communication_style", "")
            if style:
                owner_context += f"\nCommunication style: {style}"

        self._system_message = SYSTEM_PROMPT + owner_context
        self._greeting = greeting or f"Hello! I'm Walter, the AI assistant for {owner_name}. How can I help you today?"

    def get_greeting(self) -> str:
        """Get the configured greeting message."""
        return self._greeting

    async def respond(self, message: str, history: List[Dict[str, str]]) -> Dict[str, Any]:
        """Generate a response to the caller's message."""
        if self._client:
            return await self._respond_with_ai(message, history)
        else:
            return self._respond_with_fallback(message, history)

    async def _respond_with_ai(self, message: str, history: List[Dict[str, str]]) -> Dict[str, Any]:
        """Generate response using OpenAI."""
        messages = [{"role": "system", "content": self._system_message}]

        for msg in history:
            role = "assistant" if msg["role"] == "walter" else "user"
            messages.append({"role": role, "content": msg["content"]})

        messages.append({"role": "user", "content": message})

        try:
            response = await self._client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                max_tokens=300,
                temperature=0.7,
            )

            text = response.choices[0].message.content

            # Simple intent/urgency detection
            intent = await self._classify_intent(message)
            urgency = await self._assess_urgency(message)

            return {
                "text": text,
                "intent": intent,
                "urgency": urgency,
            }

        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return self._respond_with_fallback(message, history)

    def _respond_with_fallback(self, message: str, history: List[Dict[str, str]]) -> Dict[str, Any]:
        """Development fallback — rule-based responses without AI."""
        message_lower = message.lower()

        # Simple rule-based responses
        if any(word in message_lower for word in ["hello", "hi", "hey"]):
            text = "Hello! I'm Walter, the AI assistant. How can I help you today?"
        elif any(word in message_lower for word in ["urgent", "emergency", "important", "asap"]):
            text = "I understand this is urgent. Let me make note of this as a priority matter. Could you give me more details so I can ensure the owner gets this message right away?"
        elif any(word in message_lower for word in ["meeting", "schedule", "appointment", "calendar"]):
            text = "I'd be happy to help with scheduling. Could you provide the details — when would you like to meet and what's it regarding?"
        elif any(word in message_lower for word in ["call back", "return call", "callback"]):
            text = "I'll make sure to pass along your callback request. What's the best number to reach you, and when would be a good time?"
        elif any(word in message_lower for word in ["message", "tell", "let them know", "pass along"]):
            text = "Of course, I'll pass that message along to the owner. Is there anything else you'd like me to include?"
        elif any(word in message_lower for word in ["who", "what do you"]):
            owner_name = self.profile.get("display_name", "the account owner") if self.profile else "the account owner"
            text = f"I'm Walter, an AI telephone assistant acting on behalf of {owner_name}. I can take messages, schedule callbacks, and handle routine inquiries."
        elif any(word in message_lower for word in ["bye", "goodbye", "thank", "thanks"]):
            text = "Thank you for calling! I'll make sure everything we discussed is passed along. Have a great day!"
        else:
            text = "I appreciate that information. Let me note this down. Is there anything else you'd like me to pass along to the owner?"

        intent = self._detect_intent_fallback(message_lower)
        urgency = self._detect_urgency_fallback(message_lower)

        return {
            "text": f"[DEVELOPMENT MODE] {text}",
            "intent": intent,
            "urgency": urgency,
        }

    def _detect_intent_fallback(self, message: str) -> str:
        if any(w in message for w in ["meeting", "schedule", "appointment"]):
            return "scheduling"
        if any(w in message for w in ["urgent", "emergency", "important"]):
            return "urgent_message"
        if any(w in message for w in ["call back", "callback"]):
            return "callback_request"
        if any(w in message for w in ["message", "tell", "pass"]):
            return "message_delivery"
        if any(w in message for w in ["who", "what"]):
            return "inquiry"
        return "general"

    def _detect_urgency_fallback(self, message: str) -> str:
        if any(w in message for w in ["emergency", "asap", "critical"]):
            return "critical"
        if any(w in message for w in ["urgent", "important", "right away"]):
            return "high"
        if any(w in message for w in ["soon", "today"]):
            return "medium"
        return "low"

    async def _classify_intent(self, message: str) -> str:
        """Classify caller intent using AI."""
        return self._detect_intent_fallback(message.lower())

    async def _assess_urgency(self, message: str) -> str:
        """Assess urgency of the caller's message."""
        return self._detect_urgency_fallback(message.lower())

    async def generate_summary(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """Generate a call summary from the conversation."""
        conversation_text = "\n".join(
            f"{msg['role'].upper()}: {msg['content']}" for msg in messages
        )

        if self._client:
            try:
                response = await self._client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {"role": "system", "content": SUMMARY_PROMPT},
                        {"role": "user", "content": f"Summarize this conversation:\n\n{conversation_text}"},
                    ],
                    max_tokens=500,
                    temperature=0.3,
                    response_format={"type": "json_object"},
                )
                return json.loads(response.choices[0].message.content)
            except Exception as e:
                logger.error(f"Summary generation error: {e}")

        # Fallback summary
        return {
            "summary": f"Call with {len(messages)} messages. Conversation covered general topics.",
            "category": "general",
            "urgency": "low",
            "key_details": {"message_count": len(messages)},
            "follow_up_actions": [],
            "escalation_required": False,
        }
