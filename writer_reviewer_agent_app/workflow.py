from writer_reviewer_agent_app.agents.writer_agent import WriterAgent
from writer_reviewer_agent_app.agents.reviewer_agent import ReviewerAgent


def run_workflow(prompt: str) -> str:
    """Orchestrate the Writer -> Reviewer -> Writer collaboration.

    Returns the final refined content as plain text.
    """
    writer = WriterAgent()
    reviewer = ReviewerAgent()

    initial = writer.generate_initial_content(prompt)

    feedback, suggestions, reviewer_refined = reviewer.review_content(initial)

    final = writer.apply_reviewer_feedback(reviewer_refined, feedback)

    return final
