---
layout: ../../../layouts/MarkdownLayout.astro
title: Installation guide
---

# Installation Guide

---

## Table of Contents

- [Installation Guide](#installation-guide)
  - [Table of Contents](#table-of-contents)
  - [Guide](#guide)
    - [Prerequisites](#prerequisites)
    - [Installing Node.js and npm](#installing-nodejs-and-npm)
    - [Docker and Docker Compose Installation Guide](#docker-and-docker-compose-installation-guide)
    - [Quick Start](#quick-start)
    - [Setting up additional radiator controllers](#setting-up-additional-radiator-controllers)
    - [Troubleshooting](#troubleshooting)

---

## Guide

### Prerequisites

- **Operating Systems**: Windows 10 or higher, MacOS, Linux
- **Software**:
  - Docker [Version: >= 26.9.0] ([Download Docker](https://www.docker.com/get-started))
  - Docker Compose (included in Docker Desktop)
  - Git (optional, [Download Git](https://git-scm.com/downloads))
  - Node.js [Version: >= 20.13.1]  ([Download Node](https://nodejs.org/en/download/package-manager/current))
  - npm [Version: >= 10.8.0] ([Download npm](https://nodejs.org/en/download/package-manager/current))

### Installing Node.js and npm
  - Windows

    1. Visit the [Node.js download page](https://nodejs.org/).
    2. Download the latest LTS (Long Term Support) version of Node.js.
    3. Run the installer and follow the instructions.
    4. During the installation, ensure the option to install `npm` (Node Package Manager) is checked.
    5. Verify the installation by opening a command prompt and running:
        ```bash
        node -v
        npm -v
        ```
       Ensure the version of Node.js is >10.8.0 and npm is installed.

  - MacOS

    1. Download the latest LTS version from the [Node.js website](https://nodejs.org/).
    2. Open the downloaded package and follow the installation instructions.
    3. Verify the installation in the terminal:
        ```bash
        node -v
        npm -v
        ```
       Check that the Node.js version is >10.8.0 and npm is installed.

   - Linux (Ubuntu)

      1. Open your terminal.
      2. Update your package list:
          ```bash
          sudo apt update
          ```
      3. Install Node.js and npm:
          ```bash
          sudo apt install nodejs npm
          ```
      4. Check the installed versions:
          ```bash
          node -v
          npm -v
          ```
         Ensure that Node.js is >10.8.0 and npm is installed.

### Docker and Docker Compose Installation Guide
    
- **Windows**

    1. **Download Docker Desktop**:
        - Visit the [Docker Desktop for Windows download page](https://www.docker.com/products/docker-desktop).
        - Click on the “Download for Windows” button to get the installer.

    2. **Install Docker Desktop**:
        - Run the downloaded `.exe` file to start the installation process.
        - Follow the on-screen instructions to complete the installation.
        - Make sure to check the option to “Enable the WSL 2 based engine” during installation.

    3. **Start Docker Desktop**:
        - After the installation is complete, launch Docker Desktop from the Start menu.
        - You may be prompted to log in with a Docker ID or create a new one.

    4. **Verify Docker Installation**:
        - Open PowerShell and run the following command:
        ```powershell
        docker --version
        ```
        - You should see the Docker version information displayed.

    5. **Verify Docker Compose Installation**:
        - Run the following command to check Docker Compose:
        ```powershell
        docker-compose --version
        ```
        - Docker Compose is included with Docker Desktop, and you should see its version information.

- **macOS**

  1. **Download Docker Desktop for Mac**:
      - Visit the [Docker Desktop for Mac download page](https://www.docker.com/products/docker-desktop).
      - Click on the “Download for Mac” button to download the installer.

  2. **Install Docker Desktop**:
      - Open the downloaded `.dmg` file.
      - Drag the Docker icon to the Applications folder.

  3. **Start Docker Desktop**:
      - Open Docker Desktop from the Applications folder.
      - You may need to grant Docker permissions to access your files and networks.
      - Sign in with your Docker ID or create a new one if prompted.

  4. **Verify Docker Installation**:
      - Open Terminal and run the following command:
        ```bash
        docker --version
        ```
      - You should see the Docker version information displayed.

  5. **Verify Docker Compose Installation**:
      - Run the following command to check Docker Compose:
        ```bash
        docker-compose --version
        ```
      - Docker Compose is included with Docker Desktop, and you should see its version information.

- **Linux**
  - Follow the [official Docker documentation](https://docs.docker.com/engine/install) guideline.
 
  1. **Verify Docker Installation**:
      - Open Terminal and run the following command:
        ```bash
        docker --version
        ```
      - You should see the Docker version information displayed.

  2. **Verify Docker Compose Installation**:
      - Run:
        ```bash
        docker-compose --version
        ```
      - You should see the Docker Compose version information.

### Quick Start

1. **Clone the Repository**:
    ```bash
    git clone https://gitlab.mi.hdm-stuttgart.de/tz023/heizungssteuerung.git
    ```
   Alternatively, download as a ZIP file and extract.
   ![Repository zip file](../resources/repo_zip.png)

2. **Install NPM Packages**:
    - Open the terminal and navigate to the backend directory:
      ```bash
      cd backend
      ```
    - Then install the required packages:
      ```bash
      npm install
      ```
    - Open the terminal and navigate to the frontend directory:
      ```bash
      cd backend
      ```
    - Then install the required packages:
      ```bash
      npm install
      ```

2. **Start Docker Containers**:
    - Start Docker.
    - Open a terminal and navigate to the repository directory:
      ```bash
      cd heizungssteuerung
      docker compose up
      ```
        Alternatively, the containers can also be started via the Docker desktop app:
        ![Docker desktop](../resources/docker_desktop.png)
    - The heating control system is available at: `http://localhost:4321`.

3. **Set Up Admin User**:
    - Set the initial admin in the database:
      ```bash
      node ~/heizungssteuerung/backend/src/setAdmin.ts [username]
      ```

### Setting up additional radiator controllers
  - Any number of radiator controllers can be added. Follow the installation instructions for the respective controller. The heating control system must be restarted after integrating a new controller.

### Troubleshooting

- **Docker Compose Error**: Check if Docker is running on the host machine and is active.
- **Admin user error**: Check whether you have entered the right user name. If in doubt, try a new registration.
---