"""AWS Lambda Function URL adapter. Not imported by local uvicorn."""

from mangum import Mangum

from app.main import app

handler = Mangum(app, lifespan="auto")
