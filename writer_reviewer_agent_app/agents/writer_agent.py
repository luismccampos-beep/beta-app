from writer_reviewer_agent_app.agents.model_client import ModelClient


class WriterAgent:
    """Writer agent that creates drafts using a model client."""

    def __init__(self, name: str = "Writer"):
        self.name = name
        self.client = ModelClient()

    def generate_initial_content(self, prompt: str) -> str:
        prompt = (prompt or "").strip()
        if self.client.enabled:
            instruction = (
                "Write an initial content draft based on the user request below. "
                "Keep the output as plain text with a clear headline and concise introduction.\n\n"
                f"Request: {prompt}\n\nDraft:"
            )
            res = self.client.generate_text(instruction)
            if isinstance(res, dict):
                return res.get("text", "")
            return str(res)

        title = prompt.capitalize() if prompt else "Untitled"
        intro = f"This document responds to the request: {prompt}" if prompt else "This is an initial draft."
        body = (
            "Here is the initial draft content. It is intentionally broad so the Reviewer can give actionable feedback."
        )
        return f"{title}\n\n{intro}\n\n{body}"

    def apply_reviewer_feedback(self, content: str, feedback: str) -> str:
        """Apply reviewer feedback by asking the model to revise the draft."""
        if self.client.enabled:
            instruction = (
                "Revise the text below by applying the review feedback. "
                "Produce the final refined content as plain text only.\n\n"
                "Original content:\n"
                f"{content}\n\n"
                "Review feedback:\n"
                f"{feedback}\n\n"
                "Refined content:"
            )
            res = self.client.generate_text(instruction)
            if isinstance(res, dict):
                return res.get("text", "")
            return str(res)

        revised = content + "\n\n[Applied Reviewer Feedback]\n" + feedback
        if "shorten" in feedback.lower():
            revised = revised[:200] + "..."
        return revised
