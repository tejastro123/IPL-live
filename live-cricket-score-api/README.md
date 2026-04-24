# Live Cricket Score API

Free Cricket API that scrapes Cricbuzz match pages and exposes:

- live score by `match_id`
- IPL season overview
- IPL points table
- IPL upcoming matches

## Disclaimer

This is **not an official API provided by Cricbuzz**.
This is an **unofficial API that retrieves data by scraping publicly available content from Cricbuzz** and is **not affiliated with, authorized, sponsored, or endorsed by Cricbuzz** in any manner.

This project is created **strictly for educational, learning, and personal development purposes only**. It is intended to demonstrate data scraping, API structuring, and related technical concepts.

Use of this API in any **production environment or commercial application is entirely at your own risk**. The author and contributors are **not responsible for any service disruptions, inaccurate data, legal issues, or policy violations** resulting from its usage.

All website content, trademarks, logos, match data, and related assets remain the property of their respective owners.

**All credits go to <https://www.cricbuzz.com/>**  

## Requirements and Features 📑

- Python 3
- install Required Modules
- Fastapi: **<https://fastapi.tiangolo.com/>**
- Virtual Environment for Running FastAPI framework
- CORS Header and other Security Headers
- Swagger Docs Support
- Self-hosting support with gunicorn
- Support Nginx, Apache2, Lightspeed or Cloudflare Tunnel Proxy
- HTTPS (For Secure SSL Connections)  

## Setup and Development

```sh

## install python env
sudo apt install python3 python3-venv
pip install gunicorn

## Clone the Repo
git clone https://github.com/mskian/live-cricket-score-api
cd live-cricket-score-api

## Create Virtual Env
python3 -m venv venv

## Activate Virtual Env
source venv/bin/activate

## install Modules
pip install fastapi uvicorn httpx beautifulsoup4 lxml gunicorn

## start the dev server 
uvicorn app:app --host 0.0.0.0 --port 6020

## Exit virtual Env
deactivate
```

## Production Server

```sh
gunicorn -k uvicorn.workers.UvicornWorker app:app -b 0.0.0.0:6020 -w 2
```

## Systemd Conf

```sh
[Unit]
Description=Gunicorn instance to serve Score API
Requires=network.target
After=network.target

[Service]
WorkingDirectory=/home/live-score-api
Environment="PATH=/home/live-score-api/venv/bin"
ExecStart=/home/live-score-api/venv/bin/gunicorn -k uvicorn.workers.UvicornWorker app:app -b 0.0.0.0:6020 -w 2
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

## Usage

- JSON

```sh
http://localhost:6020/?score=150294
```

```json
{
  "status": "success",
  "title": "Sri Lanka A vs New Zealand A, 1st unofficial ODI, New Zealand A tour of Sri Lanka, 2026",
  "score": "NZA 86/4 (17)",
  "current_batsmen": [
    {
      "name": "Simon Keene",
      "score": "6(7)"
    },
    {
      "name": "Muhammad Abbas",
      "score": "10(29)"
    }
  ],
  "current_bowler": {
    "name": "Wanuja Sahan"
  }
}
```

- Tree View

```sh
http://localhost:6020/?score=150294&text=true
```

```sh
🏏 Live Score
│
├── Match    : Sri Lanka A vs New Zealand A, 1st unofficial ODI, New Zealand A tour of Sri Lanka, 2026
├── Score    : NZA 86/4 (17)
├── Bowler   : Wanuja Sahan
├── Batsmen
│   ├── Simon Keene : 6(7)
│   ├── Muhammad Abbas : 10(29)
```

- Swagger Docs

```sh
http://localhost:6020/docs
```

- IPL Overview

```sh
http://localhost:6020/ipl
http://localhost:6020/ipl?year=2026
```

```json
{
  "status": "success",
  "series": {
    "series_id": 9241,
    "title": "Indian Premier League 2026",
    "year": 2026,
    "slug": "indian-premier-league-2026",
    "series_url": "https://www.cricbuzz.com/cricket-series/9241/indian-premier-league-2026"
  },
  "matches": [
    {
      "summary": "35th Match, Delhi DC PBKS Match starts at Apr 25, 10:00 GMT",
      "label": "35th Match",
      "venue": "Delhi",
      "team1": "DC",
      "team2": "PBKS",
      "status": "Match starts at Apr 25, 10:00 GMT"
    }
  ],
  "points_table": [
    {
      "rank": 1,
      "team": "PBKS",
      "played": 6,
      "won": 5,
      "lost": 0,
      "no_result": 1,
      "points": 11,
      "net_run_rate": "+1.420"
    }
  ]
}
```

- IPL Text View

```sh
http://localhost:6020/ipl?text=true
```

## CLI

```sh
## Get score
python cli.py 12345

## JSON View 
python cli.py 12345 --json

## Tree view
python cli.py 12345 --text

## IPL overview
python cli.py --ipl

## IPL season JSON
python cli.py --ipl --year 2026 --json
```

## LICENSE

MIT
