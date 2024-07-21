# Heating control

## Project description

A smart heating control system for individual temperature control in office and work environments, based on user attendance times, which are managed via a Nextcloud team calendar.

## Functions and features

- Presence-based temperature control.
- User-friendly web interface.
- Support for multiple languages (German/English).
- Integration with Nextcloud calendar.

## Technologies

- Node.js, Express, MongoDB, Svelte, Astro.js, Docker

## Requirements

- Node.js v14 or higher
- Docker and Docker Compose
- MongoDB v4.4 or higher

## Installation instructions (Quick Guide)

1. Clone repository:
    ```bash
    git clone https://gitlab.mi.hdm-stuttgart.de/tz023/heizungssteuerung.git
    cd heizungssteuerung
    ```

2. Start docker container:
    ```bash
    docker-compose up
    ```

3. Open the application in the browser:
    ```bash
    http://localhost
    ```

## Documentation
Further informations about the **install guide**, **user manual** and the **final product report** can be found in [PDFs](/docs/PDFs/) or inside the [heizungssteuerung.wiki](/heizungssteuerung.wiki). 

## Use

- Registration and management of the heating control system via the web interface.

## API endpoints

- The API endpoints can be found inside `./docs/swagger.pdf`.

## Configuration notes (server)

- Set environment variables in an `.env` file (e.g., MongoDB URI, Nextcloud calendar, etc.) (see `./backend/.env.docker`).


## Authors

- Alexander Kraus
- Florian Demel
- Steve Aschenbrenner
- Torben Ziegler


