# CurrencyRates

Project for passing subject in college.

## How to run?

- On Backend:
    - Setup Python's venv,
    - In terminal run the following commands:
        - `source .venv/Scripts/activate` to activate venv,
        - `fastapi dev main.py` to run Backend's server,

- On Frontend:
    - In terminal run the following commands:
        - `npm install` to install all the modules of project,
        - `npm run start` to start Frontend's server,

- Database:
    - Setup MySql with `curency_rates` database in it,
    - Deploy `db.sql` file to your MySql instance to import database's structure,

Also, Docker can be used to run all the infrastructure: `docker-compose up --build`

