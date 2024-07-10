---
layout: ../../../layouts/MarkdownLayout.astro
title: User manual
---

# User manual

- [User manual](#user-manual)
  - [1. Homepage](#1-homepage)
  - [2. Register](#2-register)
  - [3. Login](#3-login)
  - [4. Dashboard](#4-dashboard)
  - [5. Settings](#5-settings)
  - [6. Admin area](#6-admin-area)
  - [7. Connecting new heating thermostats](#7-connecting-new-heating-thermostats)
  - [8. Troubleshooting](#8-troubleshooting)

---

## 1. Homepage

![Homepage](../resources/homepage_en.png)

1. You can use the help function to call up the operating instructions, installation instructions and information on the source code.
2. You can choose between German and English.
3. You can choose between day and night mode.
4. The login and register buttons are located in the centre. The website can only be used with a user account.

---

## 2. Register

![Register](../resources/sign_up_en.png)

1. Decide on a user name.
2. Decide on a password that is at least 7 characters long.
3. Enter the room in which you are sitting. If it is not clear which room applies, select 'n001' and set the room in the settings after logging in. After logging in, you will see a representation of the building in the dashboard.
4. Use the title of your calendar entries (e.g. "ab12@n5") from the heating control Nextcloud calendar as the calendar string. The title is used to switch the heating on and off according to its presence. Each calendar entry must begin with or contain this string.
5. You need the current invitation code from an admin. The default code is `smarthome`. Please enter the code case-sensitively.
6. Finalise the registration.

---

## 3. Login

![Login](../resources/login_en.png)

1. Enter your user name.
2. Enter your password.
3. If the login is successful, you should be redirected to the dashboard.

_If you have forgotten your password, please contact an admin. They can delete your account so that you can create a new account._

---

## 4. Dashboard

![Dashboard](../resources/dashboard.png)

On the dashboard, you can see the currently saved radiators that are relevant for your room. The target temperature and the current temperature of the heating are also displayed.

The target temperature describes the temperature that should currently be reached.

The current temperature is the temperature that the device is measuring.

_An offset value can be assigned in the Fritz!Box if the temperature deviates due to the heat of the heating._

---

![Device list](../resources/device_en.png)

In the device list, you can see the current information about the saved radiators.

_If you set the radiator manually via the dashboard, it will maintain the set temperature for the rest of the day until it switches off at night._

---

## 5. Settings

![Settings](../resources/settings_en.png)

1. Firstly, you will see the name of the logged-in user.
1. Set the desired temperature: The radiators relevant to you in your room are set according to your saved temperature.
1. In the room assignment, you can customise your associated room. The room names can be found on the dashboard.
1. Use the title of your calendar entries (e.g. "ab12@n5") from the heating control Nextcloud calendar as the calendar string. The title is used to switch the heating on and off according to its presence. Each calendar entry must begin with or contain this string.
1. You can optionally activate a sepia mode for all pages.
1. You can adjust the font size for all pages of the heating control.
1. You can adjust the line spacing for all pages of the heating control.
1. Lastly, you can log out using the logout button.

---

## 6. Admin area

![Admin](../resources/admin_en.png)

This area is only visible to admins. Further information on user management can be found in the installation instructions.

1. New devices can be added, managed and removed in device management. See: [Connecting new heating thermostats](#7.-Connecting-new-heating-thermostats).
2. You can customise the invitation code and provide it as a link for a new user. The code is required during registration to create an account.
3. The nightly switch-off specifies between which hours of the day the standard temperature should be set.
4. For the default temperature, you can select a temperature to be used as the default value. This is set when nobody is present in the office.
5. The preheating time in minutes per degree indicates how far in advance the heating switches on before an employee enters the building. _For example, the heating is started 20 minutes before arrival if it is currently 18 degrees in the building and the employee has selected 22 degrees._
6. You can deactivate the synchronisation between the calendar and heating with the last setting. This means that the calendar events from Nextcloud are no longer taken into account when setting the desired temperature.

You can save the changed setting options for the current heating control via **Save**.

## 7. Connecting new heating thermostats

When adding new devices, it is advisable to use the Fritz!Box interface to make the settings correctly.

1. **Name:** Assign a name of your choice to know which device is meant.
1. **ID:** Set the same ID that was stored for the device in the Fritz! For example `09995 0688917`. This can be viewed on the Fritz!Box page `http://fritz.box` under Smart Home -> Operation -> {Name of the device}.
1 **Type of device:** Select `FRITZ!DECT 301` or `FRITZ!DECT 302` according to the type of device involved.
1. **Room and heating:** Select which heating is involved. The IDs and rooms can be viewed via the dashboard.
1 **Add device:** If all details are correct, the device will be added. If the system cannot find a device with the specified ID, no device is created.


## 8. Troubleshooting

  - What should I do if I have forgotten my password or user name?
  
    As the registration works via an invitation code, no personal data such as your e-mail address is required. However, this means that there is no secure way to recover the password. Therefore, please register again.

    If you have forgotten your username, you can contact an admin who will be able to help you.