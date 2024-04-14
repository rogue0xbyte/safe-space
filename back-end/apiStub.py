from fastapi import FastAPI, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import os
import json

app = FastAPI()

class Session(BaseModel):
    session_no: int
    CO: float
    LEL: float
    H2S: float
    JOB: str
    EQPT: str
    TIME_IN: str
    TIME_OUT: str

class SessionInfo(BaseModel):
    CO: float
    LEL: float
    H2S: float

@app.get("/live_data")
def get_live_data():
    return {
        "CO": "85.460000",
        "LEL": "0.280000",
        "H2S": "160.610000"
    }

@app.put("/update_job_equipment")
def update_job_equipment(JOB: str, EQPT: str):
    return {
                "message": "Job name and equipment number updated successfully."
            }

@app.get("/sessions")
def get_sessions():
    return [
                {
                    "session_no": 1,
                    "CO": 79.072778,
                    "LEL": 0.520556,
                    "H2S": 95.24,
                    "JOB": "PUMP JAM",
                    "EQPT": "GUK-G-21",
                    "TIME_IN": "23:54:36",
                    "TIME_OUT": "23:54:47"
                }
            ]

@app.get("/session_by_id/{session_id}")
def get_session_by_id(session_id: int):
    return [
                {
                    "CO": 85.46,
                    "LEL": 0.38,
                    "H2S": 113.82
                },
                {
                    "CO": 85.46,
                    "LEL": 0.42,
                    "H2S": 87.18
                },
                {
                    "CO": 79.28,
                    "LEL": 0.95,
                    "H2S": 83.54
                },
                {
                    "CO": 79.28,
                    "LEL": 0.7,
                    "H2S": 134.73
                },
                {
                    "CO": 85.46,
                    "LEL": 0.87,
                    "H2S": 83.22
                },
                {
                    "CO": 79.28,
                    "LEL": 0.36,
                    "H2S": 136.34
                },
                {
                    "CO": 79.28,
                    "LEL": 0.41,
                    "H2S": 102.03
                },
                {
                    "CO": 79.28,
                    "LEL": 0.34,
                    "H2S": 79.99
                },
                {
                    "CO": 79.28,
                    "LEL": 0.71,
                    "H2S": 129.02
                },
                {
                    "CO": 85.46,
                    "LEL": 0.09,
                    "H2S": 139.62
                },
                {
                    "CO": 79.28,
                    "LEL": 0.41,
                    "H2S": 79.23
                },
                {
                    "CO": 79.28,
                    "LEL": 0.97,
                    "H2S": 51.56
                },
                {
                    "CO": 79.28,
                    "LEL": 0.53,
                    "H2S": 81.21
                },
                {
                    "CO": 85.46,
                    "LEL": 0.08,
                    "H2S": 108.61
                },
                {
                    "CO": 79.28,
                    "LEL": 0.86,
                    "H2S": 82.11
                },
                {
                    "CO": 123.93,
                    "LEL": 0.4,
                    "H2S": 139.06
                },
                {
                    "CO": 79.28,
                    "LEL": 0.89,
                    "H2S": 83.05
                }
            ]

@app.get("/sessions_by_equipment/{equipment_id}")
def get_sessions_by_equipment(equipment_id: str):
    return [
                {
                    "session_no": 1,
                    "CO": 79.072778,
                    "LEL": 0.520556,
                    "H2S": 95.24,
                    "JOB": "PUMP JAM",
                    "EQPT": "GUK-G-21",
                    "TIME_IN": "23:54:36",
                    "TIME_OUT": "23:54:47"
                }
            ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)