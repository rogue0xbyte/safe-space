from fastapi import FastAPI, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import random
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
    # Simulating random sensor data
    co_level = round(random.uniform(0, 100), 2)  # CO levels between 0 and 100
    lel_level = round(random.uniform(20, 100), 4)   # LEL percentage between 0 and 1
    h2s_level = round(random.uniform(0, 200), 2) # H2S levels between 0 and 200

    return {
        "CO": f"{co_level:.2f}",
        "LEL": f"{lel_level:.4f}",
        "H2S": f"{h2s_level:.2f}"
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
        },
        {
            "session_no": 2,
            "CO": 60.432556,
            "LEL": 1.205789,
            "H2S": 50.18,
            "JOB": "VALVE MAINTENANCE",
            "EQPT": "GUK-G-15",
            "TIME_IN": "12:20:15",
            "TIME_OUT": "12:35:29"
        },
        {
            "session_no": 3,
            "CO": 45.892345,
            "LEL": 0.890123,
            "H2S": 30.55,
            "JOB": "PIPE INSPECTION",
            "EQPT": "GUK-G-07",
            "TIME_IN": "08:45:10",
            "TIME_OUT": "09:15:45"
        },
        {
            "session_no": 4,
            "CO": 70.123456,
            "LEL": 1.54321,
            "H2S": 80.01,
            "JOB": "EQUIPMENT CALIBRATION",
            "EQPT": "GUK-G-11",
            "TIME_IN": "16:10:20",
            "TIME_OUT": "16:45:38"
        },
        {
            "session_no": 5,
            "CO": 55.678901,
            "LEL": 1.987654,
            "H2S": 45.36,
            "JOB": "TANK CLEANING",
            "EQPT": "GUK-G-04",
            "TIME_IN": "10:00:00",
            "TIME_OUT": "11:30:20"
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
    uvicorn.run(app, host="127.0.0.1", port=8000)