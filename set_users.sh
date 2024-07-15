#!/bin/bash

# Define the directory and file paths
directory="./backend"
env_file="$directory/.env"
docker_env_file="$directory/.env.docker"

# Check if the directory exists, create if not
if [ ! -d "$directory" ]; then
    mkdir -p "$directory"
fi

# Function to set the variable in the specified file
set_variable() {
    local file=$1
    local var_name=$2
    local var_value=$3

    # Check if the variable already exists
    if grep -q "^$var_name=" "$file"; then
        # Variable exists, replace it
        sed -i '' "s/^$var_name=.*/$var_name=$var_value/" "$file" 2>/dev/null || sed -i "s/^$var_name=.*/$var_name=$var_value/" "$file"
    else
        # Variable does not exist, append it
        echo "$var_name=$var_value" >> "$file"
    fi
}
# Variable explanations
declare -A explanations=(
    ["CALENDAR_USERNAME"]="Calendar service username. This is the account name you use to access your calendar service."
    ["CALENDAR_PASSWORD"]="Calendar service password. Ensure this is kept secure."
    ["FRITZ_USERNAME"]="Username for your Fritz device, typically used for router or home network management."
    ["FRITZ_PASSWORD"]="Password for your Fritz device. Keep this secure to protect your network settings."
)

# Array of variable names
declare -a var_names=("CALENDAR_USERNAME" "CALENDAR_PASSWORD" "FRITZ_USERNAME" "FRITZ_PASSWORD")

# Loop to prompt user and set variables
for var_name in "${var_names[@]}"; do
    echo "${explanations[$var_name]}"
    echo "Enter the value for '$var_name': "
    read value
    set_variable $env_file $var_name $value
    set_variable $docker_env_file $var_name $value
done

echo "Variables have been set in both files."