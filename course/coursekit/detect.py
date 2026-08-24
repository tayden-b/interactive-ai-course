"""Work out which coding agent the learner already has, so `course init` writes one
adapter file instead of asking them to choose from a list they have no basis to judge."""

from __future__ import annotations

import os
import shutil
from pathlib import Path

# name -> (executable to look for, adapter path, human label)
AGENTS = {
    "claude":  ("claude", "CLAUDE.md",                        "Claude Code"),
    "cursor":  ("cursor", ".cursor/rules/course.mdc",         "Cursor"),
    "codex":   ("codex",  "AGENTS.md",                        "Codex CLI"),
    "gemini":  ("gemini", "AGENTS.md",                        "Gemini CLI"),
    "copilot": (None,     ".github/copilot-instructions.md",  "GitHub Copilot"),
}


def installed() -> list[str]:
    """Agents we can actually see on PATH, best guess first."""
    found = [k for k, (exe, _, _) in AGENTS.items() if exe and shutil.which(exe)]
    # Cursor and VS Code often ship their CLI under a different name.
    if "cursor" not in found and (Path.home() / "Applications/Cursor.app").exists():
        found.append("cursor")
    if "cursor" not in found and Path("/Applications/Cursor.app").exists():
        found.append("cursor")
    return found


def env_hint() -> str | None:
    """Some agents announce themselves in the environment."""
    if os.getenv("CLAUDECODE") or os.getenv("CLAUDE_CODE"):
        return "claude"
    tp = (os.getenv("TERM_PROGRAM") or "").lower()
    if "cursor" in tp:
        return "cursor"
    if "vscode" in tp:
        return "copilot"
    return None
