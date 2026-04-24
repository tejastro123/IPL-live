#!/usr/bin/env python3

import argparse
import json
import sys
from typing import Any, Dict, Optional

import requests

from cricbuzz import REQUEST_TIMEOUT, CricbuzzParser


class ScoreCLI:
    @classmethod
    def fetch_html(cls, url: str) -> str:
        try:
            response = requests.get(
                url,
                headers=CricbuzzParser.HEADERS,
                timeout=10,
            )
            response.raise_for_status()
            return response.text
        except requests.Timeout as exc:
            raise RuntimeError(REQUEST_TIMEOUT) from exc
        except requests.RequestException as exc:
            raise RuntimeError(
                f"network error: {exc}"
            ) from exc

    @classmethod
    def fetch_score(cls, match_id: str) -> Dict[str, Any]:
        html_text = cls.fetch_html(
            CricbuzzParser.build_score_url(match_id)
        )
        return CricbuzzParser.parse_score_html(html_text)

    @classmethod
    def fetch_ipl(cls, year: Optional[int]) -> Dict[str, Any]:
        league_html = cls.fetch_html(
            CricbuzzParser.build_league_schedule_url()
        )
        series = CricbuzzParser.parse_ipl_series_listing(
            league_html,
            year=year,
        )
        series_html = cls.fetch_html(series["series_url"])
        points_html = cls.fetch_html(
            CricbuzzParser.build_series_points_url(series)
        )

        return {
            "status": "success",
            "series": series,
            "matches": CricbuzzParser.parse_series_matches_html(series_html),
            "points_table": CricbuzzParser.parse_points_table_html(points_html),
        }

    @classmethod
    def parse_arguments(cls):
        parser = argparse.ArgumentParser(
            prog="scorecli",
            description=(
                "Fetch live cricket score by match id or fetch IPL overview"
            ),
            formatter_class=argparse.RawTextHelpFormatter,
            epilog="""
Examples:
  scorecli 12345
  scorecli --12345
  scorecli 12345 --json
  scorecli --ipl
  scorecli --ipl --year 2026 --json
            """,
        )

        parser.add_argument(
            "match_id",
            nargs="?",
            type=CricbuzzParser.validate_match_id,
            help="numeric match id",
        )

        parser.add_argument(
            "--ipl",
            action="store_true",
            help="fetch IPL overview and points table",
        )

        parser.add_argument(
            "--year",
            type=CricbuzzParser.validate_year,
            help="IPL season year",
        )

        group = parser.add_mutually_exclusive_group()
        group.add_argument(
            "--json",
            action="store_true",
            help="show JSON output",
        )
        group.add_argument(
            "--text",
            action="store_true",
            help="show text output",
        )

        args = parser.parse_args(
            CricbuzzParser.normalize_argv(sys.argv[1:])
        )

        if args.ipl and args.match_id:
            parser.error(
                "use either match_id or --ipl, not both"
            )

        if not args.ipl and not args.match_id:
            parser.error(
                "the following arguments are required: match_id"
            )

        if args.year and not args.ipl:
            parser.error("--year can only be used with --ipl")

        return args

    @classmethod
    def run(cls):
        args = cls.parse_arguments()

        if args.ipl:
            data = cls.fetch_ipl(args.year)

            if args.json:
                print(
                    json.dumps(
                        data,
                        indent=2,
                        ensure_ascii=False,
                    )
                )
                return

            print(CricbuzzParser.format_ipl_tree(data))
            return

        data = cls.fetch_score(args.match_id)

        if args.json:
            print(
                json.dumps(
                    data,
                    indent=2,
                    ensure_ascii=False,
                )
            )
            return

        print(CricbuzzParser.format_score_tree(data))


if __name__ == "__main__":
    try:
        ScoreCLI.run()
    except KeyboardInterrupt:
        print("\nInterrupted by user")
        sys.exit(130)
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        sys.exit(1)
