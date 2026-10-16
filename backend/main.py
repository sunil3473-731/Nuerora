from fastapi import FastAPI
from pydantic import BaseModel

# Initialize the FastAPI application
app = FastAPI(
    title="Environmental Hotspot Activity Forecast API",
    description="API providing daily active fire detections, baseline projections, and ML model forecasts.",
    version="1.0.0"
)

# Define the Pydantic schema for the Health check response
class HealthResponse(BaseModel):
    status: str
    service: str
    version: str

# Define the /health endpoint
@app.get("/health", response_model=HealthResponse, tags=["System Health"])
def check_health():
    """
    Health-check endpoint.
    Returns the operational status of the service along with metadata.
    """
    return HealthResponse(
        status="healthy",
        service="hotspot-activity-forecast-api",
        version="1.0.0"
    )
