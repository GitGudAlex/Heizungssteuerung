#!/bin/bash

# This script is used to connect to the HdM MI-VPN using OpenVPN.
# It is meant to be run on a Raspberry Pi or any other Linux-based system. 

sleep 5

echo "Connect via MI-VPN so that the heating control works correctly...\n"

# name of the VPN certificate
CONFIG_FILE="./vpn/hdm_mi_stud_new_ca.ovpn"

# install and verify successful OpenVPN installation
install_openvpn() {
    if ! command -v openvpn &> /dev/null
    then
        echo "OpenVPN is not installed. Installation is being carried out..."
        sudo apt update
        sudo apt install -y openvpn
        if [ $? -ne 0 ]; then
            echo "Error during the installation of OpenVPN."
            exit 1
        fi
        echo "OpenVPN successfully installed."
    else
        echo "OpenVPN is already installed."
    fi
}

install_openvpn
sudo openvpn --config ${CONFIG_FILE}

if [ $? -eq 0 ]; then
    echo "VPN connection successfully established."
else
    echo "Error while establishing the VPN connection."
    exit 1
fi