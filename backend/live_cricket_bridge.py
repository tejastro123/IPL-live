from __future__ import annotations

import importlib.util
from datetime import datetime
from functools import lru_cache
from pathlib import Path
from typing import Any, Optional

import httpx


class LiveCricketSourceError(RuntimeError):
    pass


BRIDGE_ROOT = Path(__file__).resolve().parents[1] / "live-cricket-score-api"
CRICBUZZ_MODULE_PATH = BRIDGE_ROOT / "cricbuzz.py"


@lru_cache(maxsize=1)
def get_cricbuzz_parser() -> Any:
    if not CRICBUZZ_MODULE_PATH.exists():
        raise LiveCricketSourceError(
            "live-cricket-score-api/cricbuzz.py was not found"
        )

    spec = importlib.util.spec_from_file_location(
        "live_cricket_score_api_cricbuzz",
        CRICBUZZ_MODULE_PATH,
    )
    if spec is None or spec.loader is None:
        raise LiveCricketSourceError(
            "Unable to load Cricbuzz parser from live-cricket-score-api"
        )

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.CricbuzzParser


async def fetch_html(url: str) -> str:
    parser = get_cricbuzz_parser()

    try:
        async with httpx.AsyncClient(
            timeout=12.0,
            follow_redirects=True,
        ) as client:
            response = await client.get(url, headers=parser.HEADERS)
            response.raise_for_status()
            return response.text
    except httpx.TimeoutException as exc:
        raise LiveCricketSourceError("Live cricket source timed out") from exc
    except httpx.HTTPStatusError as exc:
        raise LiveCricketSourceError(
            f"Live cricket source returned {exc.response.status_code}"
        ) from exc
    except httpx.RequestError as exc:
        raise LiveCricketSourceError(
            "Unable to reach live cricket source"
        ) from exc


async def fetch_ipl_overview(year: Optional[int] = None) -> dict[str, Any]:
    parser = get_cricbuzz_parser()
    season_year = year or datetime.now().year

    try:
        league_html = await fetch_html(parser.build_league_schedule_url())
        series = parser.parse_ipl_series_listing(league_html, year=season_year)
        series_html = await fetch_html(series["series_url"])
        points_html = await fetch_html(parser.build_series_points_url(series))
    except ValueError as exc:
        raise LiveCricketSourceError(str(exc)) from exc

    return {
        "status": "success",
        "series": series,
        "matches": parser.parse_series_matches_html(series_html),
        "points_table": parser.parse_points_table_html(points_html),
    }


async def fetch_live_score(match_id: str) -> dict[str, Any]:
    parser = get_cricbuzz_parser()
    match_id = parser.validate_match_id(match_id)
    score_html = await fetch_html(parser.build_score_url(match_id))

    return {
        "status": "success",
        **parser.parse_score_html(score_html),
    }
