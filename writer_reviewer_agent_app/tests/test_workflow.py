from writer_reviewer_agent_app.workflow import run_workflow


def test_run_workflow_returns_nonempty_string():
    res = run_workflow("Quick test prompt")
    assert isinstance(res, str)
    assert len(res) > 0
