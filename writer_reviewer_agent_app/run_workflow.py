"""CLI runner for the Writer-Reviewer multi-agent workflow.

Usage:
    python -m writer_reviewer_agent_app.run_workflow "Write a short summary about X"
"""
import argparse
import json
from writer_reviewer_agent_app.workflow import run_workflow


def main(argv=None):
    parser = argparse.ArgumentParser(description="Run Writer-Reviewer workflow")
    parser.add_argument("prompt", nargs="+", help="Prompt to send to the Writer agent")
    parser.add_argument("--json", action="store_true", help="Output structured JSON with metadata")
    args = parser.parse_args(argv)

    prompt = " ".join(args.prompt)
    final = run_workflow(prompt)

    if args.json:
        out = {"final": final}
        print(json.dumps(out, ensure_ascii=False, indent=2))
    else:
        print(final)


if __name__ == "__main__":
    main()
