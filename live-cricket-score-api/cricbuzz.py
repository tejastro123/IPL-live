#!/usr/bin/env python3

from __future__ import annotations

import argparse
import re
import time
from datetime import datetime
from typing import Any, Dict, List, Optional

from bs4 import BeautifulSoup


NOT_FOUND = "score not found"
REQUEST_TIMEOUT = "request timeout"
INVALID_MATCH_ID = "invalid score id"


class CricbuzzParser:
    BASE_URL = "https://www.cricbuzz.com"
    SCORE_PATH = "/live-cricket-scores"
    LEAGUE_SCHEDULE_PATH = "/cricket-schedule/series/league"

    HEADERS = {
        "User-Agent": (
            "Mozilla/5.0 "
            "(X11; Linux x86_64) "
            "AppleWebKit/537.36 "
            "(KHTML, like Gecko) "
            "Chrome/146.0.0.0 "
            "Safari/537.36"
        ),
        "Accept": (
            "text/html,"
            "application/xhtml+xml,"
            "application/xml;q=0.9,"
            "*/*;q=0.8"
        ),
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Referer": "https://www.cricbuzz.com/",
        "Origin": "https://www.cricbuzz.com",
    }

    @staticmethod
    def clean(text: str, fallback: str = "") -> str:
        cleaned = " ".join(text.split()) if text else ""
        return cleaned or fallback

    @classmethod
    def normalize_argv(cls, argv: List[str]) -> List[str]:
        normalized = []

        for arg in argv:
            if re.fullmatch(r"--\d+", arg):
                normalized.append(arg[2:])
                continue

            normalized.append(arg)

        return normalized

    @classmethod
    def validate_match_id(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise argparse.ArgumentTypeError(
                "match_id cannot be empty"
            )

        if not value.isdigit():
            raise argparse.ArgumentTypeError(
                "match_id must contain digits only"
            )

        if len(value) < 4:
            raise argparse.ArgumentTypeError(
                "match_id must be at least 4 digits"
            )

        if len(value) > 20:
            raise argparse.ArgumentTypeError(
                "match_id is too long"
            )

        return value

    @classmethod
    def validate_year(cls, value: str) -> int:
        value = value.strip()

        if not value.isdigit():
            raise argparse.ArgumentTypeError(
                "year must contain digits only"
            )

        year = int(value)

        if year < 2008 or year > 2100:
            raise argparse.ArgumentTypeError(
                "year must be between 2008 and 2100"
            )

        return year

    @classmethod
    def build_score_url(cls, match_id: str) -> str:
        return (
            f"{cls.BASE_URL}{cls.SCORE_PATH}/"
            f"{match_id}?_={int(time.time() * 1000)}"
        )

    @classmethod
    def build_league_schedule_url(cls) -> str:
        return f"{cls.BASE_URL}{cls.LEAGUE_SCHEDULE_PATH}"

    @classmethod
    def build_series_points_url(cls, series: Dict[str, Any]) -> str:
        return f"{series['series_url']}/points-table"

    @staticmethod
    def _default_score_response() -> Dict[str, Any]:
        return {
            "title": NOT_FOUND,
            "score": NOT_FOUND,
            "current_batsmen": [],
            "current_bowler": {"name": NOT_FOUND},
        }

    @classmethod
    def extract_bowler(cls, full_text: str) -> Dict[str, str]:
        text = cls.clean(full_text)

        block_match = re.search(
            r"Bowler\s+O\s+M\s+R\s+W\s+ECO\s+(.*?)(?:Partnership|Last wicket|CRR|$)",
            text,
            re.IGNORECASE,
        )

        if not block_match:
            return {"name": NOT_FOUND}

        block = cls.clean(block_match.group(1))

        name_match = re.search(
            r"([A-Za-z.'\- ]+?)\s*\*?\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+(?:\.\d+)?",
            block,
        )

        return {
            "name": cls.clean(name_match.group(1), NOT_FOUND)
            if name_match
            else NOT_FOUND
        }

    @classmethod
    def parse_score_html(cls, html_text: str) -> Dict[str, Any]:
        soup = BeautifulSoup(html_text, "lxml")
        full_text = cls.clean(soup.get_text(" ", strip=True))

        raw_title = (
            soup.title.get_text(strip=True)
            if soup.title
            else ""
        )

        title = re.sub(
            r"^Cricket commentary\s*\|\s*",
            "",
            raw_title,
            flags=re.IGNORECASE,
        )

        og_title_tag = soup.find(
            "meta",
            property="og:title",
        )

        og_title = cls.clean(
            og_title_tag.get("content", "")
            if og_title_tag
            else ""
        )

        score: Any = NOT_FOUND

        score_match = re.search(
            r"([A-Z]{2,4})\s+(\d+)/(\d+)\s*\(([\d.]+)\)",
            og_title,
        )

        if score_match:
            team, runs, wickets, overs = score_match.groups()

            score = {
                "team": team,
                "runs": int(runs),
                "wickets": int(wickets),
                "overs": float(overs),
                "display": f"{team} {runs}/{wickets} ({overs})",
            }

        batsmen = []
        batsman_match = re.search(
            r"\((.*?)\)\s*\|",
            og_title,
        )

        if batsman_match:
            players = re.findall(
                r"([A-Za-z\s.'-]+)\s+(\d+\(\d+\))",
                batsman_match.group(1),
            )

            batsmen = [
                {
                    "name": cls.clean(name, NOT_FOUND),
                    "score": score_value,
                }
                for name, score_value in players[:2]
            ]

        bowler = cls.extract_bowler(full_text)

        return {
            "title": cls.clean(title, NOT_FOUND),
            "score": score,
            "current_batsmen": batsmen,
            "current_bowler": bowler,
        }

    @classmethod
    def parse_ipl_series_listing(
        cls,
        html_text: str,
        year: Optional[int] = None,
    ) -> Dict[str, Any]:
        soup = BeautifulSoup(html_text, "lxml")
        candidates: Dict[str, Dict[str, Any]] = {}

        for anchor in soup.find_all("a", href=True):
            href = anchor.get("href", "")
            label = cls.clean(anchor.get_text(" ", strip=True))

            if "/cricket-series/" not in href:
                continue

            if "Indian Premier League" not in label:
                continue

            href = href.split("?", 1)[0].rstrip("/")
            href = re.sub(
                r"/(?:matches|points-table|stats|news|videos|photos|squads|venues|results)$",
                "",
                href,
            )

            href_match = re.search(
                r"^/cricket-series/(\d+)/([^/]+)$",
                href,
            )

            if not href_match:
                continue

            year_match = re.search(
                r"Indian Premier League\s+(\d{4})",
                label,
                re.IGNORECASE,
            )

            if not year_match:
                slug_year_match = re.search(r"-(\d{4})$", href_match.group(2))
                if not slug_year_match:
                    continue
                candidate_year = int(slug_year_match.group(1))
            else:
                candidate_year = int(year_match.group(1))

            if year is not None and candidate_year != year:
                continue

            series_id, slug = href_match.groups()
            title = f"Indian Premier League {candidate_year}"

            candidates[series_id] = {
                "series_id": int(series_id),
                "title": title,
                "year": candidate_year,
                "slug": slug,
                "series_path": href,
                "series_url": f"{cls.BASE_URL}{href}",
            }

        if not candidates:
            raise ValueError("IPL series not found")

        desired_year = year or datetime.now().year
        preferred = [
            candidate
            for candidate in candidates.values()
            if candidate["year"] == desired_year
        ]

        pool = preferred or list(candidates.values())

        return sorted(
            pool,
            key=lambda item: (item["year"], item["series_id"]),
            reverse=True,
        )[0]

    @classmethod
    def parse_points_table_html(cls, html_text: str) -> List[Dict[str, Any]]:
        soup = BeautifulSoup(html_text, "lxml")
        tokens = [
            cls.clean(token)
            for token in soup.stripped_strings
        ]

        start_index = None

        for index, token in enumerate(tokens):
            if token.upper() == "NRR":
                start_index = index + 1
                break

        if start_index is None:
            return []

        rows = []
        index = start_index

        while index + 7 < len(tokens):
            rank = tokens[index]

            if not rank.isdigit():
                break

            row = {
                "rank": int(rank),
                "team": tokens[index + 1],
                "played": int(tokens[index + 2]),
                "won": int(tokens[index + 3]),
                "lost": int(tokens[index + 4]),
                "no_result": int(tokens[index + 5]),
                "points": int(tokens[index + 6]),
                "net_run_rate": tokens[index + 7],
            }
            rows.append(row)
            index += 8

        return rows

    @classmethod
    def parse_match_summary(cls, line: str) -> Dict[str, str]:
        line = cls.clean(line)
        match = re.match(
            (
                r"^(?P<label>\d+(?:st|nd|rd|th)\s+Match)"
                r"\s*,\s*"
                r"(?P<venue>.+?)\s+"
                r"(?P<team1>[A-Z]{2,4})\s+"
                r"(?P<team2>[A-Z]{2,4})\s+"
                r"(?P<status>.+)$"
            ),
            line,
        )

        if not match:
            return {
                "summary": line,
                "label": line,
                "venue": NOT_FOUND,
                "team1": NOT_FOUND,
                "team2": NOT_FOUND,
                "status": NOT_FOUND,
            }

        data = match.groupdict()
        data["summary"] = line
        return data

    @classmethod
    def parse_series_matches_html(
        cls,
        html_text: str,
    ) -> List[Dict[str, str]]:
        soup = BeautifulSoup(html_text, "lxml")
        tokens = [
            cls.clean(token)
            for token in soup.stripped_strings
        ]

        start_index = None
        stop_markers = {
            "More Matches",
            "SQUADS",
            "STATS",
            "POINTS TABLE",
            "LATEST NEWS",
            "VIDEOS",
            "PHOTOS",
        }

        title_index = next(
            (
                index
                for index, token in enumerate(tokens)
                if re.fullmatch(
                    r"Indian Premier League \d{4}",
                    token,
                    re.IGNORECASE,
                )
            ),
            0,
        )

        for index in range(title_index, len(tokens)):
            if tokens[index].upper() == "MATCHES":
                start_index = index + 1
                break

        if start_index is None:
            return []

        matches = []

        for token in tokens[start_index:]:
            if token in stop_markers:
                break

            if "Match" not in token:
                continue

            matches.append(cls.parse_match_summary(token))

        return matches

    @classmethod
    def format_score_tree(cls, data: Dict[str, Any]) -> str:
        score = (
            data["score"]["display"]
            if isinstance(data["score"], dict)
            else data["score"]
        )

        lines = [
            "Live Score",
            "|",
            f"|-- Match    : {data['title']}",
            f"|-- Score    : {score}",
            f"|-- Bowler   : {data['current_bowler']['name']}",
            "|-- Batsmen",
        ]

        if data["current_batsmen"]:
            for player in data["current_batsmen"]:
                lines.append(
                    f"|   |-- {player['name']} : {player['score']}"
                )
        else:
            lines.append("|   `-- N/A")

        return "\n".join(lines)

    @classmethod
    def format_ipl_tree(cls, data: Dict[str, Any]) -> str:
        lines = [
            "IPL Overview",
            "|",
            f"|-- Season   : {data['series']['title']}",
            f"|-- SeriesId : {data['series']['series_id']}",
            "|-- Matches",
        ]

        if data["matches"]:
            for match in data["matches"]:
                lines.append(
                    (
                        f"|   |-- {match['label']} | "
                        f"{match['team1']} vs {match['team2']} | "
                        f"{match['venue']} | {match['status']}"
                    )
                )
        else:
            lines.append("|   `-- No matches found")

        lines.append("|-- Points Table")

        if data["points_table"]:
            for row in data["points_table"]:
                lines.append(
                    (
                        f"|   |-- {row['rank']}. {row['team']} | "
                        f"P:{row['played']} W:{row['won']} "
                        f"L:{row['lost']} NR:{row['no_result']} "
                        f"Pts:{row['points']} NRR:{row['net_run_rate']}"
                    )
                )
        else:
            lines.append("|   `-- No standings found")

        return "\n".join(lines)
