from writer_reviewer_agent_app.agents.model_client import ModelClient


class ReviewerAgent:
    """Reviewer agent that generates feedback and a refined draft using a model."""

    def __init__(self, name: str = "Reviewer"):
        self.name = name
        self.client = ModelClient()

    def review_content(self, content: str):
        """Return (feedback, suggested_edits, refined_draft)."""
        if self.client.enabled:
            feedback = self._generate_feedback(content)
            refined = self._generate_refined_content(content, feedback)
            suggested_edits = "Use the reviewer feedback to make the draft clearer and more actionable."
            return feedback, suggested_edits, refined

        feedback = (
            "1) Add a clear headline. 2) Shorten the introduction to one sentence. "
            "3) Add a 3-item action list at the end."
        )
        suggested_edits = (
            "Headline: Use the request as the headline.\n"
            "Intro: Keep one sentence.\n"
            "Actions:\n- Action 1\n- Action 2\n- Action 3"
        )
        refined = self._apply_suggestions(content)
        return feedback, suggested_edits, refined

    def _generate_feedback(self, content: str) -> str:
        prompt = (
            "Review the following content and provide 3 concise, actionable review comments. "
            "Keep it short and directly focused on improvements.\n\n"
            f"Content:\n{content}\n\nFeedback:"
        )
        res = self.client.generate_text(prompt)
        if isinstance(res, dict):
            return res.get("text", "")
        return str(res)

    def _generate_refined_content(self, content: str, feedback: str) -> str:
        prompt = (
            "Revise the content below by applying the review feedback. "
            "Produce the final refined content in plain text only.\n\n"
            f"Content:\n{content}\n\n"
            f"Review feedback:\n{feedback}\n\nRefined content:"
        )
        res = self.client.generate_text(prompt)
        if isinstance(res, dict):
            return res.get("text", "")
        return str(res)

    def _apply_suggestions(self, content: str) -> str:
        title = content.splitlines()[0] if content else "Untitled"
        first_sentence = (content.split('.\n')[0].split('.')[0] + '.') if content else ""
        actions = "- Clarify the goal\n- Shorten the intro\n- Provide next steps"
        return f"{title}\n\n{first_sentence}\n\n{actions}\n\n(Refined by Reviewer)"
