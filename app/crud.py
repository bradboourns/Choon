from datetime import date, datetime, time, timezone
from typing import List, Optional

from sqlalchemy.orm import Session

from . import models, schemas


def create_venue(db: Session, venue: schemas.VenueCreate) -> models.Venue:
    db_venue = models.Venue(**venue.dict())
    db.add(db_venue)
    db.commit()
    db.refresh(db_venue)
    return db_venue


def list_venues(db: Session, suburb: Optional[str] = None) -> List[models.Venue]:
    query = db.query(models.Venue)
    if suburb:
        query = query.filter(models.Venue.suburb.ilike(f"%{suburb}%"))
    return query.order_by(models.Venue.name).all()


def create_event(db: Session, event: schemas.EventCreate) -> models.Event:
    db_event = models.Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def list_events(
    db: Session,
    suburb: Optional[str] = None,
    genre: Optional[str] = None,
    target_date: Optional[date] = None,
    status: Optional[str] = None,
    *,
    now: Optional[datetime] = None,
) -> List[models.Event]:
    query = db.query(models.Event).join(models.Venue)

    if suburb:
        query = query.filter(models.Venue.suburb.ilike(f"%{suburb}%"))
    if genre:
        query = query.filter(models.Event.genre.ilike(f"%{genre}%"))
    if target_date:
        start_of_day = datetime.combine(target_date, time.min)
        end_of_day = datetime.combine(target_date, time.max)
        query = query.filter(
            models.Event.start_time <= end_of_day,
            models.Event.end_time >= start_of_day,
        )

    now_value = now or datetime.now(timezone.utc).replace(tzinfo=None)
    if status == "live":
        query = query.filter(
            models.Event.start_time <= now_value, models.Event.end_time >= now_value
        )
    elif status == "upcoming":
        query = query.filter(models.Event.start_time >= now_value)

    return query.order_by(models.Event.start_time).all()
