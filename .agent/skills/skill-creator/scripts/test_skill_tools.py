#!/usr/bin/env python3
"""
Regression Tests for Skill Packaging & Validation Tools
"""

import os
import shutil
import tempfile
import unittest
from pathlib import Path

from quick_validate import validate_skill
from package_skill import package_skill


class TestSkillToolsRegression(unittest.TestCase):
    def setUp(self):
        self.test_dir = tempfile.mkdtemp()
        self.base_path = Path(self.test_dir)

    def tearDown(self):
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def test_regression_1_valid_skill_packaging(self):
        """Test 1: Valid skill directory with correct frontmatter passes validation and packaging."""
        skill_dir = self.base_path / "valid-sample-skill"
        skill_dir.mkdir(parents=True)
        
        skill_md = skill_dir / "SKILL.md"
        skill_md.write_text(
            "---\n"
            "name: valid-sample-skill\n"
            "description: A sample skill for regression testing.\n"
            "---\n\n"
            "# Valid Sample Skill\n"
            "## Overview\nThis is a test skill."
        )

        valid, msg = validate_skill(skill_dir)
        self.assertTrue(valid, f"Validation failed: {msg}")

        out_zip = package_skill(skill_dir, output_dir=self.test_dir)
        self.assertIsNotNone(out_zip)
        self.assertTrue(Path(out_zip).exists())

    def test_regression_2_mismatched_skill_name(self):
        """Test 2: Skill name in YAML frontmatter mismatching directory name is caught."""
        skill_dir = self.base_path / "expected-skill-name"
        skill_dir.mkdir(parents=True)
        
        skill_md = skill_dir / "SKILL.md"
        skill_md.write_text(
            "---\n"
            "name: wrong-mismatched-name\n"
            "description: Mismatched name test.\n"
            "---\n\n"
            "# Mismatch Skill"
        )

        valid, msg = validate_skill(skill_dir)
        self.assertFalse(valid)
        self.assertIn("does not match directory name", msg)

        out_zip = package_skill(skill_dir, output_dir=self.test_dir)
        self.assertIsNone(out_zip)

    def test_regression_3_missing_skill_md_and_malformed_yaml(self):
        """Test 3: Missing SKILL.md and missing YAML frontmatter delimiters are rejected."""
        # 3a. Empty directory without SKILL.md
        empty_dir = self.base_path / "empty-skill"
        empty_dir.mkdir(parents=True)
        valid, msg = validate_skill(empty_dir)
        self.assertFalse(valid)
        self.assertIn("Missing SKILL.md", msg)

        # 3b. Malformed YAML frontmatter
        malformed_dir = self.base_path / "malformed-skill"
        malformed_dir.mkdir(parents=True)
        (malformed_dir / "SKILL.md").write_text("No frontmatter at all.")
        valid_mf, msg_mf = validate_skill(malformed_dir)
        self.assertFalse(valid_mf)
        self.assertIn("must start with YAML frontmatter", msg_mf)


if __name__ == "__main__":
    unittest.main()
