from typing import Union
from fastapi import FastAPI
import datetime
import requests
import json
import mysql.connector

app = FastAPI()
dbContext = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="currency_rates"
)
cursor = dbContext.cursor()

@app.get("/currencies")
def read_currencies():
    cursor.execute("SELECT code FROM rates")
    finalResult = ""
    for row in cursor.fetchall():
        finalResult += json.loads(row)
    return finalResult

@app.get("/currencies/{dateStart}/{dateEnd}")
def read_currencies_date(dateStart: str, dateEnd: str):
    res = requests.get(f'https://api.nbp.pl/api/exchangerates/tables/A/{dateStart}/{dateEnd}?format=json')
    return json.loads(res.text)

@app.post("/currencies/fetch")
def write_save_to_db():
    response = requests.get('https://api.nbp.pl/api/exchangerates/tables/A?format=json')
    result = json.loads(response.text)
    query = "INSERT INTO rates (name, code, rate) VALUES (%s, %s, %s)"
    cursor.execute("DELETE * FROM rates")
    for currency in result.rates:
        values = (currency.currency, currency.code, currency.mid)
        cursor.execute(query, values)
    dbContext.commit()