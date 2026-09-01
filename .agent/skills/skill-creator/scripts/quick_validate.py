#!/usr/bin/env python3
"""
Quick Skill Validator - Validates skill structure and metadata before packaging.
"""

from pathlib import Path
import re
import sys


def validate_skill(skill_path):
    """
    Validate a skill directory structure and its SKILL.md.

    Args:
        skill_path: Path to skill folder (str or Path)

    Returns:
        tuple (bool, str): (is_valid, validation_message)
    """
    path = Path(skill_path).resolve()

    if not path.exists():
        return False, f"Directory does not exist: {path}"

    if not path.is_dir():
        return False, f"Path is not a directory: {path}"

    skill_md = path / "SKILL.md"
    if not skill_md.exists():
        return False, f"Missing SKILL.md in {path}"

    try:
        content = skill_md.read_text(encoding="utf-8")
    except Exception as e:
        return False, f"Could not read SKILL.md: {e}"

    # Verify YAML frontmatter
    if not content.startswith("---"):
        return False, "SKILL.md must start with YAML frontmatter delimiter '---'"

    parts = content.split("---", 2)
    if len(parts) < 3:
        return False, "SKILL.md has malformed YAML frontmatter (missing closing '---')"

    frontmatter = parts[1]

    # Validate name field
    name_match = re.search(r"^name:\s*([a-zA-Z0-9_-]+)", frontmatter, re.MULTILINE)
    if not name_match:
        return False, "Missing or invalid 'name' field in SKILL.md frontmatter"

    skill_name = name_match.group(1).strip()
    if skill_name != path.name:
        return False, f"Skill name in frontmatter '{skill_name}' does not match directory name '{path.name}'"

    # Validate description field
    desc_match = re.search(r"^description:\s*(.+)", frontmatter, re.MULTILINE)
    if not desc_match or not desc_match.group(1).strip():
        return False, "Missing 'description' field in SKILL.md frontmatter"

    return True, f"Skill '{path.name}' passed validation."


def main():
    if len(sys.argv) < 2:
        print("Usage: python quick_validate.py <path/to/skill-folder>")
        sys.exit(1)

    valid, message = validate_skill(sys.argv[1])
    if valid:
        print(f"✅ {message}")
        sys.exit(0)
    else:
        print(f"❌ {message}")
        sys.exit(1)


if __name__ == "__main__":
    main()
