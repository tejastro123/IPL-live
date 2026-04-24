# IPL Fan Website Backend

## Setup
1. Activate the virtual environment:
   - Windows: `./venv/Scripts/activate`
2. Install dependencies (if not done):
   - `pip install -r requirements.txt`
3. Run the server:
   - `uvicorn main:app --reload`

## API Endpoints

### Teams
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create team
- `GET /api/teams/{id}` - Get team
- `PUT /api/teams/{id}` - Update team
- `DELETE /api/teams/{id}` - Delete team

### Players
- `GET /api/players` - List all players
- `POST /api/players` - Create player
- `GET /api/players/{id}` - Get player
- `PUT /api/players/{id}` - Update player
- `DELETE /api/players/{id}` - Delete player

### Matches
- `GET /api/matches` - List all matches
- `POST /api/matches` - Create match
- `GET /api/matches/{id}` - Get match
- `PUT /api/matches/{id}` - Update match
- `DELETE /api/matches/{id}` - Delete match

### Scores
- `GET /api/scores` - List all scores
- `POST /api/scores` - Create score

### News
- `GET /api/news` - List all news
- `POST /api/news` - Create news
- `PUT /api/news/{id}` - Update news
- `DELETE /api/news/{id}` - Delete news