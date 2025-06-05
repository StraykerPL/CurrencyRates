from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import datetime
import requests
import json
import mysql.connector
from mysql.connector import Error

app = FastAPI(title="Currency Rates API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "currency_rates"
}

class CurrencyRate(BaseModel):
    name: str
    code: str
    rate: float

def get_db_connection():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

@app.get("/currencies", response_model=List[CurrencyRate])
def read_currencies():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT name, code, rate FROM rates")
        rates = cursor.fetchall()
        cursor.close()
        conn.close()
        return rates
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/currencies/{date_start}/{date_end}")
def read_currencies_date(date_start: str, date_end: str):
    try:
        response = requests.get(
            f'https://api.nbp.pl/api/exchangerates/tables/A/{date_start}/{date_end}?format=json'
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"External API error: {str(e)}")

@app.post("/currencies/fetch")
def fetch_and_save_rates():
    try:
        response = requests.get('https://api.nbp.pl/api/exchangerates/tables/A?format=json')
        response.raise_for_status()
        result = response.json()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM rates")
        
        query = "INSERT INTO rates (name, code, rate) VALUES (%s, %s, %s)"
        for currency in result[0]['rates']:
            values = (currency['currency'], currency['code'], currency['mid'])
            cursor.execute(query, values)
        
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Rates updated successfully"}
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"External API error: {str(e)}")
    except Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")