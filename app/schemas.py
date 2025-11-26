from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, HttpUrl, validator


class VenueBase(BaseModel):
    name: str = Field(..., example="The Corner Hotel")
    suburb: str = Field(..., example="Richmond")
    address: Optional[str] = Field(None, example="57 Swan St, Richmond")
    latitude: Optional[float] = Field(None, example=-37.823)
    longitude: Optional[float] = Field(None, example=144.989)
    description: Optional[str] = Field(None, example="Beloved Melbourne live music staple")
    contact_url: Optional[HttpUrl] = Field(None, example="https://cornerhotel.com")


class VenueCreate(VenueBase):
    pass


class EventBase(BaseModel):
    artist_name: str = Field(..., example="Phoebe Go")
    genre: str = Field(..., example="Indie rock")
    start_time: datetime
    end_time: datetime
    description: Optional[str] = Field(None, example="Album launch")
    external_link: Optional[HttpUrl] = Field(None, example="https://bandsintown.com/event/123")

    @validator("end_time")
    def validate_end_time(cls, v, values):
        start_time = values.get("start_time")
        if start_time and v <= start_time:
            raise ValueError("end_time must be after start_time")
        return v


class EventCreate(EventBase):
    venue_id: int


class Event(EventBase):
    id: int
    venue_id: int

    class Config:
        orm_mode = True


class Venue(VenueBase):
    id: int
    events: List[Event] = Field(default_factory=list)

    class Config:
        orm_mode = True
