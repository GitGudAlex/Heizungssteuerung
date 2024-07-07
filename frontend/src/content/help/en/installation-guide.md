---
layout: ../../../layouts/MarkdownLayout.astro
title: Installation guide
---

# Table of Contents

- [Installation Guide](#installation-guide)
  - [Prerequisites](#prerequisites)
  - [Installing Node.js and npm](#installing-nodejs-and-npm)
  - [Docker and Docker Compose Installation Guide](#docker-and-docker-compose-installation-guide)
  - [Quick Start](#quick-start)
  - [Setting up additional radiator controllers](#setting-up-additional-radiator-controllers)
  - [Troubleshooting](#troubleshooting)
- [Setting up a Raspberry Pi 4b as server](#setting-up-a-raspberry-pi-4b-as-server)
  - [Prerequisites](#prerequisites-1)
    - [1. Installation](#1-installation)
    - [2. Update and Upgrade](#2-update-and-upgrade)
    - [3. Enable SSH on Raspberry Pi](#3-enable-ssh-on-raspberry-pi)
    - [4. Install Docker \& Docker-Compose](#4-install-docker--docker-compose)
    - [5. HdM VPN Setup Guide](#5-hdm-vpn-setup-guide)
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
    - [Step 2: Update the Hosts File on Other Devices](#step-2-update-the-hosts-file-on-other-devices)
      - [Update Hosts File on a Windows PC:](#update-hosts-file-on-a-windows-pc)
      - [Update Hosts File on a macOS or Linux Device:](#update-hosts-file-on-a-macos-or-linux-device)
    - [Step 3: Access the Raspberry Pi via the Alias](#step-3-access-the-raspberry-pi-via-the-alias)

---

# Installation Guide

## Prerequisites

- **Operating Systems**: Windows 10 or higher, MacOS, Linux
- **Software**:
  - Docker [Version: >= 26.9.0] ([Download Docker](https://www.docker.com/get-started))
  - Docker Compose (included in Docker Desktop)
  - Git (optional, [Download Git](https://git-scm.com/downloads))
  - Node.js [Version: >= 20.13.1] ([Download Node](https://nodejs.org/en/download/package-manager/current))
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

3. **Start Docker Containers**:

   - Start Docker.
   - Open a terminal and navigate to the repository directory:
     ```bash
     cd heizungssteuerung
     docker compose up
     ```
     Alternatively, the containers can also be started via the Docker desktop app:
     ![Docker desktop](../resources/docker_desktop.png)
   - The heating control system is available at: `http://localhost:4321`.

4. **Set Up Admin User**:
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

---

# Setting up a Raspberry Pi 4b as server

## Prerequisites

### 1. Installation

- Raspberry Pi with a running [Raspbian OS](https://www.raspberrypi.com/software/).
- Access to Raspberry Pi either via physical connection or ssh.

### 2. Update and Upgrade

First of all, make sure that the system runs the latest version of the software. Run the command:

```bash
sudo apt-get update && sudo apt-get upgrade
```

### 3. Enable SSH on Raspberry Pi

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

### 5. HdM VPN Setup Guide

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

Without VPN access, there may be problems accessing the Nextcloud calendar.
To enable automatic VPN connection for your network:

- Navigate to:
  - **Connections**
  - -> **Advanced Options**
  - -> **Edit Connections**
  - -> **PXLab** or **Ethernet connection**
  - -> **General**
  - -> tick **Automatic VPN Connection**

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

If you don't want to access the smart heating control system via an IP address, you can change the hostname of the Raspberry Pi:

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

### Step 2: Update the Hosts File on Other Devices

To access the Raspberry Pi from other devices on the network using the new hostname, you need to update the hosts file on those devices.

#### Update Hosts File on a Windows PC:

1. Open the editor as an administrator.
2. Edit the file `C:\Windows\System32\drivers\etc\hosts`.
3. Add the following line:
   ```plaintext
   192.168.2.113   heizungssteuerung
   ```
   - Replace `192.168.2.113` with your configured static IP address
4. Save the file and close the editor.

#### Update Hosts File on a macOS or Linux Device:

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

### Step 3: Access the Raspberry Pi via the Alias

After updating the hosts file on the other devices in the network, you should be able to access the Raspberry Pi using the new hostname:

```plaintext
http://heizungssteuerung:4321
```
