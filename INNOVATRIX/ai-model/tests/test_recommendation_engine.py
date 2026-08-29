import sys
from pathlib import Path


SRC_PATH = (
    Path(__file__).resolve().parents[1]
    / "src"
)

sys.path.insert(
    0,
    str(SRC_PATH),
)

from recommendation_engine import (
    get_confidence_level,
    normalize_confidence,
)


def test_decimal_confidence():
    assert normalize_confidence(0.92) == 0.92


def test_percentage_confidence():
    assert normalize_confidence(92) == 0.92


def test_confidence_cannot_exceed_one():
    assert normalize_confidence(150) == 1.0


def test_high_confidence():
    assert get_confidence_level(0.90) == "HIGH"


def test_medium_confidence():
    assert get_confidence_level(0.70) == "MEDIUM"


def test_low_confidence():
    assert get_confidence_level(0.40) == "LOW"