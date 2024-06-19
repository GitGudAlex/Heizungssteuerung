---
layout: ../../../layouts/MarkdownLayout.astro
title: Installationsanleitung
---

# Installationsanleitung

---

## Inhaltsverzeichnis

- [Installationsanleitung](#installationsanleitung)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [Anleitung](#anleitung)
    - [Voraussetzungen](#voraussetzungen)
    - [Installation von Node.js und npm](#installation-von-nodejs-und-npm)
    - [Docker und Docker Compose Installationsanleitung](#docker-und-docker-compose-installationsanleitung)
    - [Schnellstart](#schnellstart)
    - [Einrichtung zusätzlicher Heizkörperregler](#einrichtung-zusätzlicher-heizkörperregler)
    - [Troubleshooting](#troubleshooting)

---

## Anleitung

### Voraussetzungen

- **Betriebssysteme**: Windows 10 oder höher, MacOS, Linux
- **Software**:
  - Docker ([Download Docker](https://www.docker.com/get-started))
  - Docker Compose (in Docker Desktop enthalten)
  - Git (optional, [Download Git](https://git-scm.com/downloads))
  - Node.js [Version: >= 20.13.1]  ([Download Node](https://nodejs.org/en/download/package-manager/current))
  - npm [Version: >= 10.8.0] ([Download npm](https://nodejs.org/en/download/package-manager/current))

### Installation von Node.js und npm
  - **Windows**

    1. Besuchen Sie die [Node.js-Downloadseite](https://nodejs.org/).
    2. Laden Sie die neueste LTS-Version (Long Term Support) von Node.js herunter.
    3. Führen Sie das Installationsprogramm aus und folgen Sie den Anweisungen.
    4. Stellen Sie während der Installation sicher, dass die Option zur Installation von `npm` (Node Package Manager) aktiviert ist.
    5. Überprüfen Sie die Installation, indem Sie eine Terminal öffnen und ausführen:
        ```bash
        node -v
        npm -v
        ```
        Stellen Sie sicher, dass die Version von Node.js >10.8.0 ist und npm installiert ist.

  - **MacOS**

    1. Laden Sie die neueste LTS-Version von der [Node.js-Website](https://nodejs.org/) herunter.
    2. Öffnen Sie das heruntergeladene Paket und folgen Sie den Installationsanweisungen.
    3. Überprüfen Sie die Installation im Terminal:
        ```bash
        node -v
        npm -v
        ```
       Stellen Sie sicher, dass die Node.js-Version >10.8.0 ist und npm installiert ist.

   - **Linux (Ubuntu)**

      1. Öffnen Sie Ihr Terminal.
      2. Aktualisieren Sie Ihre Paketliste:
          ```bash
          sudo apt update
          ```
      3. Installieren Sie Node.js und npm:
          ```bash
          sudo apt install nodejs npm
          ```
      4. Überprüfen Sie die installierten Versionen:
          ```bash
          node -v
          npm -v
          ```
         Stellen Sie sicher, dass Node.js >10.8.0 ist und npm installiert ist.

### Docker und Docker Compose Installationsanleitung
    
- **Windows**

    1. **Docker Desktop herunterladen**:
        - Besuchen Sie die [Docker Desktop für Windows Download-Seite] (https://www.docker.com/products/docker-desktop).
        - Klicken Sie auf die Schaltfläche "Download for Windows", um das Installationsprogramm herunterzuladen.

    2. **Docker Desktop installieren**:
        - Führen Sie die heruntergeladene `.exe`-Datei aus, um den Installationsprozess zu starten.
        - Folgen Sie den Anweisungen auf dem Bildschirm, um die Installation abzuschließen.
        - Stellen Sie sicher, dass Sie während der Installation die Option "Enable the WSL 2 based engine" aktivieren.

    3. **Starten Sie Docker Desktop**:
        - Starten Sie nach Abschluss der Installation Docker Desktop über das Startmenü.
        - Sie werden möglicherweise aufgefordert, sich mit einer Docker-ID anzumelden oder eine neue ID zu erstellen.

    4. **Überprüfen Sie die Docker-Installation**:
        - Öffnen Sie PowerShell und führen Sie den folgenden Befehl aus:
        ```Powershell
        docker --version
        ```
        - Sie sollten die Docker-Versionsinformationen angezeigt bekommen.

    5. **Überprüfen Sie die Installation von Docker Compose**:
        - Führen Sie den folgenden Befehl aus, um Docker Compose zu überprüfen:
        ```Powershell
        docker-compose --version
        ```
        - Docker Compose ist im Lieferumfang von Docker Desktop enthalten, und Sie sollten die Versionsinformationen sehen.
 
- **MacOS**

  1. **Docker Desktop für Mac herunterladen**:
      - Besuchen Sie die [Docker Desktop für Mac Download-Seite] (https://www.docker.com/products/docker-desktop).
      - Klicken Sie auf die Schaltfläche "Download for Mac", um das Installationsprogramm herunterzuladen.

  2. **Installieren Sie Docker Desktop**:
      - Öffnen Sie die heruntergeladene `.dmg`-Datei.
      - Ziehen Sie das Docker-Symbol in den Ordner "Programme".

  3. **Starten Sie Docker Desktop**:
      - Öffnen Sie Docker Desktop aus dem Ordner "Programme".
      - Möglicherweise müssen Sie Docker Berechtigungen für den Zugriff auf Ihre Dateien und Netzwerke erteilen.
      - Melden Sie sich mit Ihrer Docker-ID an oder erstellen Sie eine neue, wenn Sie dazu aufgefordert werden.

  4. **Überprüfen Sie die Docker-Installation**:
      - Öffnen Sie Terminal und führen Sie den folgenden Befehl aus:
        ```bash
        docker --version
        ```
      - Sie sollten die Docker-Versionsinformationen angezeigt bekommen.

  5. **Überprüfen Sie die Installation von Docker Compose**:
      - Führen Sie den folgenden Befehl aus, um Docker Compose zu überprüfen:
        ```bash
        docker-compose --version
        ```
      - Docker Compose ist im Lieferumfang von Docker Desktop enthalten, und Sie sollten die Versionsinformationen sehen.

- **Linux**
  - Befolgen Sie die [offizielle Docker-Dokumentation](https://docs.docker.com/engine/install) Anleitung.
 
  1. **Überprüfen Sie die Docker-Installation**:
      - Öffnen Sie Terminal und führen Sie den folgenden Befehl aus:
        ```bash
        docker --version
        ```
      - Sie sollten die Informationen zur Docker-Version angezeigt bekommen.

  2. **Überprüfen Sie die Installation von Docker Compose**:
      - Ausführen:
        ```bash
        docker-compose --version
        ```
      - Sie sollten die Versionsinformationen von Docker Compose sehen.

### Schnellstart

1. **Repository klonen**:
    ```bash
    git clone https://gitlab.mi.hdm-stuttgart.de/tz023/heizungssteuerung.git
    ```
   Oder alternativ als Zip-Datei herunterladen und entpacken.
   ![Repository zip file](../resources/repo_zip.png)

2. **NPM Packages installieren**:
    - Terminal öffnen und in das backend-Verzeichnis navigieren:
      ```bash
      cd backend
      ```
    - Anschließend benötigte Packages installieren:
      ```bash
      npm install
      ```
    - Terminal öffnen und in das frontend-Verzeichnis navigieren:
      ```bash
      cd backend
      ```
    - Anschließend benötigte Packages installieren:
      ```bash
      npm install
      ```

3. **Docker Container starten**:
    - Docker starten.
    - Terminal öffnen und in das Repository-Verzeichnis navigieren:
      ```bash
      cd heizungssteuerung
      docker compose up
      ```
        Alternativ kann auch über die Docker Desktop App die Container gestartet werden:
        ![Docker desktop](../resources/docker_desktop.png)

    - Die Heizungssteuerung ist verfügbar unter: `http://localhost:4321`.

4. **Admin-User einrichten**:
    - Initialen Admin in der Datenbank setzen:
      ```bash
      ts-node ./backend/src/setAdmin.ts [username]
      ```


### Einrichtung zusätzlicher Heizkörperregler
  - Es können beliebig viele Heizkörperregler hinzugefügt werden. Orientieren Sie sich an der Installationsanleitung des jeweiligen Reglers. Die Heizungssteueurng muss nach einbinden eines neuen Reglers, geneustartet werden.


### Troubleshooting

- **Docker Compose Fehler**: Prüfen Sie, ob Docker auf dem Hostrechner gestartet wurde und aktiv ist.
- **Admin-User Fehler**: Prüfen Sie, ob Sie den korrekten Usernamen eingegeben haben. Im Zweifel, probieren Sie eine neue Registrierung.

---