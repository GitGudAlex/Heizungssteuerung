# Heating control

## Project description

A smart heating control system for individual temperature control in office and work environments, based on user attendance times, which are managed via a Nextcloud team calendar.

## Functions and features

- Presence-based temperature control
- User-friendly web interface
- Support for multiple languages (German/English)
- Integration with Nextcloud calendar

## Technologies

- Node.js, Express, MongoDB, Svelte, Astro.js, Docker

## Requirements

- Node.js v14 or higher
- Docker and Docker Compose
- MongoDB v4.4 or higher

## Installation instructions (Quick Guide)

1. clone repository:
    ```bash
    git clone https://gitlab.mi.hdm-stuttgart.de/tz023/heizungssteuerung.git
    cd heating control
    ```

2. start docker container:
    ```bash
    docker-compose up
    ```

3. open the application in the browser:
    ```bash
    http://localhost:4321
    ```

## Use

- Registration and management of the heating control system via the web interface

## API endpoints

- The API endpoints could be located here

## Configuration notes (server)

- Set environment variables in an `.env` file (e.g., MongoDB URI, Nextcloud calendar, etc.) (see *backend/.env.example*)


## Authors

- Alexander Kraus
- Florian Demel
- Steve Aschenbrenner
- Torben Ziegler


