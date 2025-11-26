from datetime import date
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Choon Live Music API",
    description="APIs for venues to publish live music and for fans to find shows nearby",
    version="0.1.0",
)


@app.post("/venues", response_model=schemas.Venue, status_code=201)
def create_venue(venue: schemas.VenueCreate, db: Session = Depends(get_db)):
    return crud.create_venue(db, venue)


@app.get("/venues", response_model=List[schemas.Venue])
def list_venues(suburb: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.list_venues(db, suburb=suburb)


@app.post("/events", response_model=schemas.Event, status_code=201)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    venue = db.query(models.Venue).filter(models.Venue.id == event.venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    return crud.create_event(db, event)


@app.get("/events", response_model=List[schemas.Event])
def list_events(
    suburb: Optional[str] = None,
    genre: Optional[str] = None,
    date: Optional[date] = None,
    status: Optional[str] = Query(
        default=None,
        description="Filter by live or upcoming events",
        regex="^(live|upcoming)$",
    ),
    db: Session = Depends(get_db),
):
    return crud.list_events(
        db,
        suburb=suburb,
        genre=genre,
        target_date=date,
        status=status,
    )
