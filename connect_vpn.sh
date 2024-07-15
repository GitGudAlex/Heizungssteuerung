#!/bin/bash

# This script is used to connect to the HDM VPN using OpenVPN.
# It is meant to be run on a Raspberry Pi or any other Linux-based system. 

sleep 5

echo "Melde dich beim VPM an, damit die Heizungssteuerng funktioniert...\n"

# Name der Konfigurationsdatei ohne die Erweiterung (.ovpn)
CONFIG_FILE="./vpn/hdm_mi_stud_new_ca.ovpn"

# Funktion zur Überprüfung und Installation von OpenVPN
install_openvpn() {
    if ! command -v openvpn &> /dev/null
    then
        echo "OpenVPN ist nicht installiert. Installation wird durchgeführt..."
        sudo apt update
        sudo apt install -y openvpn
        if [ $? -ne 0 ]; then
            echo "Fehler bei der Installation von OpenVPN."
            exit 1
        fi
        echo "OpenVPN erfolgreich installiert."
    else
        echo "OpenVPN ist bereits installiert."
    fi
}

# Überprüfen und Installieren von OpenVPN
install_openvpn

# Starten von OpenVPN mit der angegebenen Konfigurationsdatei
sudo openvpn --config ${CONFIG_FILE}

# Überprüfen, ob OpenVPN erfolgreich gestartet wurde
if [ $? -eq 0 ]; then
    echo "VPN-Verbindung erfolgreich hergestellt."
else
    echo "Fehler beim Herstellen der VPN-Verbindung."
    exit 1
fi