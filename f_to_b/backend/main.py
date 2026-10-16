from datetime import date as calendar_date

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize the FastAPI application.
app = FastAPI(
    title="Environmental Hotspot Activity Forecast API",
    description="API providing daily active fire detections, baseline projections, and ML model forecasts.",
    version="1.0.0",
)

# Permit requests from the local Vite development server only.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


class ForecastResponse(BaseModel):
    date: str
    region: str
    actual_count: int
    baseline_forecast: int
    model_forecast: int


# Demo rows matching the region and date choices shown by the frontend.
FORECASTS = {
    ("regiona", "2024-01-10"): ForecastResponse(
        date="2024-01-10", region="RegionA", actual_count=18, baseline_forecast=16, model_forecast=17
    ),
    ("north", "2026-10-12"): ForecastResponse(
        date="2026-10-12", region="north", actual_count=12, baseline_forecast=10, model_forecast=11
    ),
    ("north", "2026-10-13"): ForecastResponse(
        date="2026-10-13", region="north", actual_count=8, baseline_forecast=9, model_forecast=7
    ),
    ("south", "2026-10-12"): ForecastResponse(
        date="2026-10-12", region="south", actual_count=5, baseline_forecast=7, model_forecast=6
    ),
    ("south", "2026-10-13"): ForecastResponse(
        date="2026-10-13", region="south", actual_count=9, baseline_forecast=8, model_forecast=10
    ),
}


@app.get("/health", response_model=HealthResponse, tags=["System Health"])
def check_health():
    """Return the operational status and metadata for this service."""
    return HealthResponse(
        status="healthy",
        service="hotspot-activity-forecast-api",
        version="1.0.0",
    )


@app.get("/forecast", response_model=ForecastResponse, tags=["Forecast"])
def get_forecast(region: str, date: str):
    """Return the demo forecast for one region and calendar date."""
    if len(date) != 10 or date[4:5] != "-" or date[7:8] != "-":
        raise HTTPException(status_code=422, detail="Date must use YYYY-MM-DD format.")
    try:
        calendar_date.fromisoformat(date)
    except ValueError:
        raise HTTPException(status_code=422, detail="Date must be a real date in YYYY-MM-DD format.")

    normalized_region = region.strip().lower()
    if normalized_region not in {"regiona", "north", "south"}:
        raise HTTPException(status_code=404, detail=f"Unknown region: {region}.")

    forecast = FORECASTS.get((normalized_region, date))
    if forecast is None:
        raise HTTPException(status_code=404, detail="No forecast is available for that region and date.")

    return forecast
