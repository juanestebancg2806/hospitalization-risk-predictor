"""AWS Lambda Function URL adapter. Not imported by local uvicorn."""

# Must run before joblib/sklearn import (app.main → predictor).
import os

os.environ.setdefault("JOBLIB_MULTIPROCESSING", "0")
os.environ.setdefault("LOKY_MAX_CPU_COUNT", "1")
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("NUMEXPR_NUM_THREADS", "1")

from mangum import Mangum

from app.main import app
from app.services import get_shared_predictor

# INIT phase: load the pickle once so warm invokes skip joblib.load.
app.state.predictor = get_shared_predictor()
handler = Mangum(app, lifespan="off")
