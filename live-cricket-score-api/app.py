import re
from typing import Any, Dict, List, Optional

import httpx
from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import HTMLResponse, JSONResponse, PlainTextResponse
from pydantic import BaseModel, field_validator
from starlette.exceptions import HTTPException as StarletteHTTPException

from cricbuzz import (
    INVALID_MATCH_ID,
    NOT_FOUND,
    REQUEST_TIMEOUT,
    CricbuzzParser,
)


class APIError(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message


class Batsman(BaseModel):
    name: str = NOT_FOUND
    score: str = NOT_FOUND


class Bowler(BaseModel):
    name: str = NOT_FOUND


class ScoreResponse(BaseModel):
    status: str
    title: str
    score: Any
    current_batsmen: List[Batsman]
    current_bowler: Bowler


class MatchValidator(BaseModel):
    score: str

    @field_validator("score")
    @classmethod
    def validate_match_id(cls, value: str) -> str:
        try:
            return CricbuzzParser.validate_match_id(value)
        except Exception as exc:
            raise ValueError(str(exc)) from exc


class IPLSeries(BaseModel):
    series_id: int
    title: str
    year: int
    slug: str
    series_url: str


class IPLMatch(BaseModel):
    summary: str
    label: str
    venue: str
    team1: str
    team2: str
    status: str


class IPLPointsRow(BaseModel):
    rank: int
    team: str
    played: int
    won: int
    lost: int
    no_result: int
    points: int
    net_run_rate: str


class IPLResponse(BaseModel):
    status: str
    series: IPLSeries
    matches: List[IPLMatch]
    points_table: List[IPLPointsRow]


app = FastAPI(
    title="Score API",
    version="0.1.0",
    description="Live Cricket Score and IPL overview API",
    docs_url=None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)

    response.headers["Cache-Control"] = (
        "no-store, no-cache, must-revalidate, "
        "proxy-revalidate, max-age=0"
    )
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    response.headers["Surrogate-Control"] = "no-store"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["X-Robots-Tag"] = "noindex, nofollow"
    response.headers["Strict-Transport-Security"] = "max-age=31536000"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "connect-src 'self' https://cdn.jsdelivr.net; "
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
        "img-src 'self' data: https://fastapi.tiangolo.com; "
        "object-src 'none'; "
        "frame-ancestors 'none';"
    )

    return response


class CricbuzzAPI:
    @classmethod
    async def fetch_html(cls, url: str) -> str:
        try:
            async with httpx.AsyncClient(
                timeout=10.0,
                follow_redirects=True,
            ) as client:
                response = await client.get(
                    url,
                    headers=CricbuzzParser.HEADERS,
                )
                response.raise_for_status()
                return response.text
        except httpx.TimeoutException as exc:
            raise APIError(408, REQUEST_TIMEOUT) from exc
        except httpx.HTTPStatusError as exc:
            raise APIError(404, "requested data unavailable") from exc
        except httpx.RequestError as exc:
            raise APIError(502, "network error while contacting Cricbuzz") from exc

    @classmethod
    async def fetch_score(cls, match_id: str) -> Dict[str, Any]:
        html_text = await cls.fetch_html(
            CricbuzzParser.build_score_url(match_id)
        )
        return CricbuzzParser.parse_score_html(html_text)

    @classmethod
    async def fetch_ipl(cls, year: Optional[int]) -> Dict[str, Any]:
        league_html = await cls.fetch_html(
            CricbuzzParser.build_league_schedule_url()
        )
        series = CricbuzzParser.parse_ipl_series_listing(
            league_html,
            year=year,
        )

        series_html = await cls.fetch_html(series["series_url"])
        points_html = await cls.fetch_html(
            CricbuzzParser.build_series_points_url(series)
        )

        return {
            "status": "success",
            "series": series,
            "matches": CricbuzzParser.parse_series_matches_html(series_html),
            "points_table": CricbuzzParser.parse_points_table_html(points_html),
        }


def _docs_html() -> str:
    html = get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title="Live Cricket Score API Docs",
        swagger_favicon_url="https://fastapi.tiangolo.com/img/favicon.png",
    )

    content = html.body.decode("utf-8")
    custom_style = """
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
    <style>
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden;
            -webkit-text-size-adjust: 100%;
        }

        .swagger-ui {
            width: 100%;
            overflow-x: hidden;
        }

        .swagger-ui .wrapper {
            width: 100%;
            max-width: 100% !important;
            padding: 10px !important;
            box-sizing: border-box;
        }

        .swagger-ui .opblock-summary {
            flex-wrap: wrap !important;
            gap: 6px;
        }

        .swagger-ui .opblock-summary-path {
            white-space: normal !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
            font-size: 14px !important;
            line-height: 1.4;
        }

        .swagger-ui pre,
        .swagger-ui code,
        .swagger-ui .microlight,
        .swagger-ui .highlight-code {
            white-space: pre-wrap !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
            overflow-x: auto !important;
            max-width: 100% !important;
            max-height: 220px !important;
            overflow-y: auto !important;
            box-sizing: border-box;
            font-size: 12px !important;
            line-height: 1.5 !important;
            border-radius: 8px;
        }

        .swagger-ui table {
            display: block;
            width: 100%;
            overflow-x: auto;
        }

        .swagger-ui textarea,
        .swagger-ui input,
        .swagger-ui select {
            width: 100% !important;
            box-sizing: border-box;
            font-size: 16px !important;
        }

        .swagger-ui .btn {
            min-height: 42px !important;
            white-space: normal !important;
        }
    </style>
    """
    return content.replace("</head>", custom_style + "</head>")


@app.get("/docs", include_in_schema=False)
async def custom_swagger_docs():
    try:
        response = HTMLResponse(content=_docs_html())
        response.headers["Cache-Control"] = "no-store"
        response.headers["X-Content-Type-Options"] = "nosniff"
        return response
    except Exception:
        return HTMLResponse(
            content=(
                "<html><head><meta name=\"viewport\" "
                "content=\"width=device-width, initial-scale=1.0\">"
                "<title>Docs Error</title></head>"
                "<body style=\"font-family:sans-serif;padding:20px;\">"
                "<h2>Unable to load Swagger docs</h2>"
                "</body></html>"
            ),
            status_code=500,
        )


@app.get("/", response_model=ScoreResponse)
async def root(
    score: Optional[str] = Query(
        None,
        min_length=4,
        max_length=20,
    ),
    text: bool = Query(False),
):
    if score is None:
        return ScoreResponse(
            status="success",
            title="Live Score API",
            score=NOT_FOUND,
            current_batsmen=[],
            current_bowler=Bowler(),
        )

    try:
        MatchValidator(score=score)
    except Exception as exc:
        message = str(exc)
        if "match_id" in message:
            message = re.sub(r".*Value error, ", "", message)

        return JSONResponse(
            status_code=422,
            content={
                "status": "error",
                "code": 422,
                "message": message or INVALID_MATCH_ID,
            },
        )

    result = await CricbuzzAPI.fetch_score(score)
    payload = ScoreResponse(status="success", **result)

    if text:
        return PlainTextResponse(CricbuzzParser.format_score_tree(result))

    return payload


@app.get("/ipl", response_model=IPLResponse)
async def ipl(
    year: Optional[int] = Query(
        None,
        ge=2008,
        le=2100,
    ),
    text: bool = Query(False),
):
    result = await CricbuzzAPI.fetch_ipl(year)

    if text:
        return PlainTextResponse(CricbuzzParser.format_ipl_tree(result))

    return IPLResponse(**result)


@app.exception_handler(APIError)
async def api_error_handler(request: Request, exc: APIError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "code": exc.status_code,
            "message": exc.message,
        },
    )


@app.exception_handler(StarletteHTTPException)
async def http_error_handler(
    request: Request,
    exc: StarletteHTTPException,
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "code": exc.status_code,
            "message": "invalid api route",
        },
    )


@app.exception_handler(Exception)
async def global_error_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "code": 500,
            "message": "internal server error",
        },
    )
