
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

# Include routers
from routers import user_router
from routers import fast_api_router
from database import engine, Base

app = FastAPI(title="Data Analysis API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://localhost:3000",  "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(fast_api_router, prefix="/data", tags=["data"])

# Create database tables
Base.metadata.create_all(engine)
