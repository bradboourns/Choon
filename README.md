# Choon

FastAPI-based backend for a live music discovery service. Venues can publish gigs with timing, genre, and platform links, while listeners can browse by suburb, genre, and live/upcoming status via list or map-friendly responses.

## Features
- Venue management with suburb metadata and location coordinates for map views.
- Event publishing with artist name, genre, start/end times, descriptions, and external promo/ticket links.
- Filtering endpoints for suburb, genre, date, and whether shows are live right now or upcoming.

## Getting started
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the API:
   ```bash
   uvicorn app.main:app --reload
   ```
3. Open the interactive docs at http://localhost:8000/docs to try the endpoints.

## API overview
- `POST /venues` – create a venue (name, suburb, optional address/coords/contact URL).
- `GET /venues` – list venues, optionally filtered by suburb.
- `POST /events` – create an event for a venue with artist, genre, schedule, description, and external link.
- `GET /events` – list events with optional filters:
  - `suburb` to scope by suburb name
  - `genre` to match genre labels
  - `date` to fetch events touching a given date (pass as `YYYY-MM-DD`, returns any show overlapping that day)
  - `status` to retrieve `live` (currently on) or `upcoming` shows

## Development
- Run tests:
  ```bash
  pytest
  ```

All timestamps are stored in UTC. Map clients can use the venue latitude/longitude fields for plotting pins and the suburb filter for quick neighborhood views.
