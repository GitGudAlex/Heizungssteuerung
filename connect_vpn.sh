#!/bin/bash

# Name der Konfigurationsdatei ohne die Erweiterung (.ovpn)
CONFIG_FILE="./vpn/hdm_mi_stud_new_ca.ovpn"

# Überprüfen, ob OpenVPN installiert ist
if ! command -v openvpn &> /dev/null
then
    echo "OpenVPN ist nicht installiert. Bitte installiere OpenVPN."
    exit 1
fi

# Starten von OpenVPN mit der angegebenen Konfigurationsdatei
sudo openvpn --config ${CONFIG_FILE}

# Überprüfen, ob OpenVPN erfolgreich gestartet wurde
if [ $? -eq 0 ]; then
    echo "VPN-Verbindung erfolgreich hergestellt."
else
    echo "Fehler beim Herstellen der VPN-Verbindung."
    exit 1
fi