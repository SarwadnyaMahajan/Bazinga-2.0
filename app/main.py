from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.db.mongodb import connect_to_mongo, close_mongo_connection
from app.api.car.routes import router as car_router
from app.api.travel.routes import router as travel_router
from app.api.review.routes import router as review_router
from app.api.health import router as health_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect on startup
    await connect_to_mongo()
    yield
    # Close on shutdown
    await close_mongo_connection()

app = FastAPI(
    title="Insurance STP API",
    description="Intelligent Insurance Claim Processing with Straight-Through Processing",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(health_router)
app.include_router(car_router)
app.include_router(travel_router)
app.include_router(review_router)


@app.get("/")
def root():
    return {
        "service": "Insurance STP API",
        "endpoints": {
            "car_claim": "POST /car/submit",
            "travel_claim": "POST /travel/submit",
            "review_queue": "GET /review/queue",
            "review_decision": "POST /review/{claim_id}/decision",
            "docs": "/docs"
        }
    }
