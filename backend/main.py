
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from setting.config import settings

# Include routers
from routers import user_router, fast_api_router, auth_router
from database import engine, Base

app = FastAPI(title="Data Analysis API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fast_api_router, prefix="/api/data", tags=["fastapi"])
app.include_router(user_router, prefix="/api/users", tags=["users"])
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])

# Create database tables
Base.metadata.create_all(engine)
