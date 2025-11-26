from datetime import datetime, timedelta

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app import crud, schemas
from app.database import Base


def setup_test_session() -> Session:
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    return TestingSessionLocal()


def create_sample_data(session: Session):
    venue = crud.create_venue(session, schemas.VenueCreate(name="Corner", suburb="Richmond"))
    now = datetime(2024, 1, 1, 12, 0, 0)

    live_event = crud.create_event(
        session,
        schemas.EventCreate(
            venue_id=venue.id,
            artist_name="Live Artist",
            genre="Indie",
            start_time=now - timedelta(hours=1),
            end_time=now + timedelta(hours=1),
        ),
    )

    upcoming_event = crud.create_event(
        session,
        schemas.EventCreate(
            venue_id=venue.id,
            artist_name="Upcoming Artist",
            genre="Indie",
            start_time=now + timedelta(days=1),
            end_time=now + timedelta(days=1, hours=2),
        ),
    )

    cross_midnight_event = crud.create_event(
        session,
        schemas.EventCreate(
            venue_id=venue.id,
            artist_name="Late Show",
            genre="Rock",
            start_time=now.replace(hour=23, minute=0, second=0, microsecond=0),
            end_time=(now + timedelta(days=1)).replace(
                hour=1, minute=0, second=0, microsecond=0
            ),
        ),
    )

    return live_event, upcoming_event, cross_midnight_event, now


def test_status_filters_use_consistent_now_reference():
    session = setup_test_session()
    live_event, upcoming_event, cross_midnight_event, now = create_sample_data(session)

    live = crud.list_events(session, status="live", now=now)
    assert {event.id for event in live} == {live_event.id}

    upcoming = crud.list_events(session, status="upcoming", now=now)
    assert {event.id for event in upcoming} == {upcoming_event.id, cross_midnight_event.id}

    session.close()


def test_date_filter_captures_cross_midnight_events():
    session = setup_test_session()
    _, upcoming_event, cross_midnight_event, now = create_sample_data(session)

    target = now.date() + timedelta(days=1)
    events = crud.list_events(session, target_date=target)

    assert {event.id for event in events} == {cross_midnight_event.id, upcoming_event.id}

    session.close()
