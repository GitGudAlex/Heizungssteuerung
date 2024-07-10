---
layout: ../../../layouts/MarkdownLayout.astro
title: Installation guide
---

# Installation Guide

- [Installation Guide](#installation-guide)
    - [1. Prerequisites](#1-prerequisites)
    - [2. Installing Node.js and npm](#2-installing-nodejs-and-npm)
    - [3. Docker and Docker Compose Installation Guide](#3-docker-and-docker-compose-installation-guide)
    - [4. Quick Start](#4-quick-start)
    - [5. User management via database interface](#5-user-management-via-database-interface)
    - [6. Setting up additional radiator controllers](#6-setting-up-additional-radiator-controllers)
    - [7. Troubleshooting](#7-troubleshooting)
- [Setting up a Raspberry Pi 4b as server](#setting-up-a-raspberry-pi-4b-as-server)
    - [1. Installation](#1-installation)
    - [2. Update and Upgrade](#2-update-and-upgrade)
    - [3. Enable SSH on Raspberry Pi (optional)](#3-enable-ssh-on-raspberry-pi-optional)
    - [4. Install Docker \& Docker-Compose](#4-install-docker--docker-compose)
    - [5. HdM VPN Setup Guide (optional)](#5-hdm-vpn-setup-guide-optional)
    - [6. Connection settings for Raspberry Pi](#6-connection-settings-for-raspberry-pi)
    - [7. Restart Network Services](#7-restart-network-services)
    - [8. Verify the Static IP Address](#8-verify-the-static-ip-address)
    - [9. Connect to Raspberry Pi via SSH](#9-connect-to-raspberry-pi-via-ssh)
    - [10. Additional Recommendation](#10-additional-recommendation)
    - [11. Troubleshooting](#11-troubleshooting)
      - [Firewall Settings](#firewall-settings)
    - [12. Optional: Change the Hostname of the Raspberry Pi](#12-optional-change-the-hostname-of-the-raspberry-pi)
      - [Change Hostname:](#change-hostname)
      - [Update Hosts File:](#update-hosts-file)
      - [Restart the Raspberry Pi:](#restart-the-raspberry-pi)
      - [Update the hosts file on other devices](#update-the-hosts-file-on-other-devices)
        - [Update Hosts File on a Windows PC:](#update-hosts-file-on-a-windows-pc)
        - [Update Hosts File on a macOS or Linux Device:](#update-hosts-file-on-a-macos-or-linux-device)
      - [Access the Raspberry Pi via the Alias](#access-the-raspberry-pi-via-the-alias)

---

### 1. Prerequisites

- **Operating Systems**: Windows 10 or higher, MacOS, Linux
- **Software**:
  - Docker [Version: >= 26.9.0] ([Download Docker](https://www.docker.com/get-started))
  - Docker Compose (included in Docker Desktop)
  - Git (optional, [Download Git](https://git-scm.com/downloads))
  - Node.js [Version: >= 20.13.1] ([Download Node](https://nodejs.org/en/download/package-manager/current))
  - npm [Version: >= 10.8.0] ([Download npm](https://nodejs.org/en/download/package-manager/current))

### 2. Installing Node.js and npm

- **Windows**

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

- **MacOS**

  1. Download the latest LTS version from the [Node.js website](https://nodejs.org/).
  2. Open the downloaded package and follow the installation instructions.
  3. Verify the installation in the terminal:
     ```bash
     node -v
     npm -v
     ```
     Check that the Node.js version is >10.8.0 and npm is installed.

- **Linux (Ubuntu)**

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

### 3. Docker and Docker Compose Installation Guide

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

### 4. Quick Start

1. **Clone the Repository**:

   ```bash
   git clone https://gitlab.mi.hdm-stuttgart.de/tz023/heizungssteuerung.git
   ```

   Alternatively, download as a ZIP file and extract.
   ![Repository zip file](../resources/repo_zip.png)

2. **Configuration of the environment variables**:
   To make the application operational, it is necessary to set the access data for the Fritz!Box and the Nextcloud calendar in the environment variables. To do this, the configuration file `./backend/.env.docker` must be adapted.

   The following variables must be set, these should already exist:

   ```txt
        # Fritzbox
        FRITZ_ADDRESS=http://fritz.box
        FRITZ_USERNAME=admin
        FRITZ_PASSWORD=???

        # NextCloud calender
        CALENDAR_DOMAIN=https://cloud.mi.hdm-stuttgart.de
        CALENDAR_USERNAME=hdm-abbreviation
        CALENDAR_PASSWORD=XXXX
        CALENDAR_NAME_HEIZUNGSSTEUERUNG=Heizungssteuerung
   ```

   The domains of the calendar and the Fritz!Box are already defined for the use case in PUXLab. For the Fritz!Box, the password and the user name of the device's web interface are required. A valid HdM user must be entered for the calendar, the `hdm-abbreviation` is the abbreviation of the user **without** `@hdm-stuttgart.de`, e.g. `ab123`.

3. **Install NPM Packages (local)**:
   This step is not required for operation with Docker or Docker Compose. As soon as the system is to be operated locally without Docker for development purposes, the next steps must be carried out.

   - Open a terminal and navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Then install the required packages:
     ```bash
     npm install
     ```
   - Open a second terminal and navigate to the frontend directory:
     ```bash
     cd backend
     ```
   - Then install the required packages:
     ```bash
     npm install
     ```
   This way, no Docker container needs to be started and the next step can be omitted.

4. **Start Docker Containers**:

   - Start Docker.
   - Open a terminal and navigate to the repository directory:
     ```bash
     cd heizungssteuerung
     docker compose up
     ```
     Alternatively, the containers can also be started via the Docker desktop app:
     ![Docker desktop](../resources/docker_desktop.png)
   - The heating control system is available at: `http://localhost`.

5. **User management**:

   - Two users are available when the application is started for the first time.

     1. user name: `admin`, password: `admin`, with administrator authorisations
     2. username: `user`, password: `user`, without administrator authorisations

   - Additional admins can be set in the database using a script:

     ```bash
     ts-node ./backend/src/setAdmin.ts [username]
     ```
     
     This step requires the installation of the NPM packages locally!

   - User management can be carried out via the database interface, which you can access at `http://localhost:8081`. See [User management via database interface](#User-Management-via-database-interface).

   - For applications that are used productively, we recommend deleting the default users `admin` and `user` and creating new admins.


### 5. User management via database interface

In Docker Compose, a Mongo Express user interface for the database starts with the MongoDB database server.
It can be found at: `http://localhost:8081`, alternatively it can be accessed via the domain of the application e.g. `http://heizungssteuerung:8081` from a foreign device.

A login is required for the interface, the access data is defined in the file `./docker-compose.yml` and is `admin:smarthome` by default.

User management can be carried out on the interface within the `user` collection of the `heating control` database by customising the collection entries.

The video shows how to log in, how to customise a collection using the admin value as an example and how to delete a user.

- [Link to video](../resources/video/database_user_management.mp4)
- [Link to exported PDFs](https://gitlab.mi.hdm-stuttgart.de/tz023/heizungssteuerung/-/wikis/resources/video/database_user_management.mp4)



### 6. Setting up additional radiator controllers

- Any number of radiator controllers can be added. Each radiator controller must be connected to the Fritzbox in the first step and can then be added to the heating control system via the user interface. Please refer to the [operating instructions](https://avm.de/service/fritzdect/wissensdatenbank/?product=FRITZ-DECT-301&query=) of the respective radiator controller for further information on the procedure for adding in the user interface.

### 7. Troubleshooting

- **Docker Compose Error**: Check if Docker is running on the host machine and is active.
- **Admin user error**: Check whether you have entered the right user name. If in doubt, try a new registration.

---

---

# Setting up a Raspberry Pi 4b as server

The following describes how the application can be set up specifically on a Raspberry Pi 4b as a server in a local network, such as the PUXLab.


### 1. Installation

- Raspberry Pi with a running [Raspbian OS](https://www.raspberrypi.com/software/).
- Access to Raspberry Pi either via physical connection or ssh.

### 2. Update and Upgrade

First of all, make sure that the system runs the latest version of the software. Run the command:

```bash
sudo apt-get update && sudo apt-get upgrade
```

### 3. Enable SSH on Raspberry Pi (optional)

(if not enabled during install process)

1. Open the **Terminal** on your Raspberry Pi.
2. Type the following command to open the Raspberry Pi configuration tool:
   ```bash
   sudo raspi-config
   ```
3. Navigate to **Interfacing Options** > **SSH** and enable SSH.
4. Exit the configuration tool.

### 4. Install Docker & Docker-Compose

1. Type the following command to get the docker install script:
   ```bash
   curl -fsSL test.docker.com -o get-docker.sh && sh get-docker.sh
   ```
2. Add a Non-Root User to the Docker Group (if needed)

   ```bash
   sudo usermod -aG docker ${USER}
   ```

3. Reboot the Raspberry Pi
4. Install Docker-Compose
   ```bash
   sudo apt-get install libffi-dev libssl-dev
   sudo apt install python3-dev
   sudo apt-get install -y python3 python3-pip
   ```
   After installation of python3 and pip3:
   ```bash
   sudo pip3 install docker-compose
   ```
5. Enable the Docker System
   ```bash
   sudo systemctl enable docker
   ```

### 5. HdM VPN Setup Guide (optional)

If you want to connect via the HdM VPN, the following steps must be carried out.

For detailed information, visit the [HdM VPN Wiki](https://wiki.mi.hdm-stuttgart.de/doku.php?id=studium:infrastruktur:vpn).

1. **Install OpenVPN**

   - Install OpenVPN through your package manager if it is not already installed. You can also use the command line for installation.

   ```bash
   sudo apt-get install openvpn
   ```

2. **Create an OpenVPN Connection**

   - Open the Connection Editor.
   - Click the “Add” button and select “OpenVPN” under the VPN section.
   - Give the connection a name and set the Gateway to `mi-vpn.mi.hdm-stuttgart.de`.

3. **Enter Your Credentials**

   - Enter your HdM username and password.
   - Choose whether to save the password permanently or to be prompted each time you connect.

4. **Advanced Settings**

   - Click on “Advanced”.
   - Set the port to `1197` for employees or `1198` for students.
   - Enable “Use LZO data compression”.

5. **Save and Connect**
   - Save the connection settings.
   - You can now use the VPN connection by selecting it from the network manager.

By following these steps, you will be able to set up and use the HdM VPN. Keep in mind that ca.crt will be needed as certificate for Linux systems.

![VPN settings inside networkmanager](../resources/vpn_networkmanger_kde1.png)
![Additonal VPN settings](../resources/vpn_networkmanger_kde2.png)

### 6. Connection settings for Raspberry Pi
This step is essential, as otherwise different IP addresses will always be assigned to the Raspberry Pi, which makes it difficult to access the heating control system.

1. Open the **Terminal** on your Raspberry Pi.
2. Type the following command to find the current IP address:
   ```bash
   hostname -I
   ```
3. Type the following command to find the current IP address of your router:
   ```bash
   ip r | grep default
   ```
4. Open the **Network Preferences**:
   - Click on the network icon in the top-right corner of the screen and select **Wireless & Wired Network Settings**.
5. Select the network interface you want to configure (e.g., `wlan0` for Wi-Fi or `eth0` for Ethernet).
6. Change the **Configure IPv4 Address** method to **Manual**.
7. Enter the desired static IP address, Netmask, Gateway, and DNS.
   - Example settings:
     - IP Address: `192.168.2.113` (Chosen static IP address)
     - Netmask: `255.255.255.0`
     - Gateway: `192.168.2.1` (IP address of router)
     - DNS Servers: `192.168.2.1` (IP address of router)
8. Click **Apply** to save the changes.

### 7. Restart Network Services

1. Open the **Terminal** on your Raspberry Pi.
2. Restart the networking service to apply changes:
   ```bash
   sudo systemctl restart networking
   ```

### 8. Verify the Static IP Address

1. Open the **Terminal** on your Raspberry Pi.
2. Type the following command to verify the IP address:
   ```bash
   hostname -I
   ```

### 9. Connect to Raspberry Pi via SSH

1. From another computer on the same network, open a terminal or command prompt.
2. Use the following command to connect to your Raspberry Pi via SSH:
   ```bash
   ssh rasp@192.168.2.113
   ```
   - Replace `192.168.2.113` with the static IP address you configured.

### 10. Additional Recommendation

If you are using VPN access, additional options can be activated for a convenient user experience.

- Navigate to:
  - **Connections**
  - -> **Advanced Options**
  - -> **Edit Connections**
  - -> **PUXLab** or **Ethernet connection**
  - -> **General**
  - -> tick **Automatic VPN Connection**

This automatically activates VPN access when the Raspberry Pi is booted and an Internet connection is available.

### 11. Troubleshooting

#### Firewall Settings

Ensure that your firewall is not blocking the SSH port (default is 22). You can allow the SSH port through the firewall using the following commands:

- **UFW (Uncomplicated Firewall) on Raspberry Pi:**
  ```bash
  sudo apt-get install ufw
  sudo ufw allow 22/tcp
  sudo ufw enable
  sudo ufw status
  ```

### 12. Optional: Change the Hostname of the Raspberry Pi

If you do not want to access the heating control unit via an IP address, you can change the host name of the Raspberry Pi:

#### Change Hostname:

1. Edit the `/etc/hostname` file:
   ```bash
   sudo nano /etc/hostname
   ```
2. Change the content to the desired hostname, e.g., `heizungssteuerung`.
3. Save and close the file.

#### Update Hosts File:

1. Edit the `/etc/hosts` file:
   ```bash
   sudo nano /etc/hosts
   ```
2. Add a line or update the existing line that contains `127.0.1.1`:
   ```bash
   127.0.1.1   heizungssteuerung
   ```
3. Save and close the file (Ctrl + O, Enter, Ctrl + X).

#### Restart the Raspberry Pi:

1. Reboot the Raspberry Pi to apply the changes:
   ```bash
   sudo reboot
   ```

#### Update the hosts file on other devices

To access the Raspberry Pi from other devices on the network using the new hostname, you need to update the hosts file on those devices.

##### Update Hosts File on a Windows PC:

1. Open the editor as an administrator.
2. Edit the file `C:\Windows\System32\drivers\etc\hosts`.
3. Add the following line:
   ```plaintext
   192.168.2.113   heizungssteuerung
   ```
   - Replace `192.168.2.113` with your configured static IP address
4. Save the file and close the editor.

##### Update Hosts File on a macOS or Linux Device:

1. Open a terminal.
2. Edit the `/etc/hosts` file with a text editor:
   ```bash
   sudo nano /etc/hosts
   ```
3. Add the following line:
   ```plaintext
   192.168.2.113   heizungssteuerung
   ```
   - Replace `192.168.2.113` with your configured static IP address
4. Save and close the file.

#### Access the Raspberry Pi via the Alias

After updating the hosts file on the other devices in the network, you should be able to access the Raspberry Pi using the new hostname:

```plaintext
https://heizungssteuerung:4321
```
