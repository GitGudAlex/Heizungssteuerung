---
layout: ../../../layouts/MarkdownLayout.astro
title: Bedienungsanleitung
---

# Bedienungsanleitung

- [Bedienungsanleitung](#bedienungsanleitung)
  - [1. Homepage](#1-homepage)
  - [2. Registrieren](#2-registrieren)
  - [3. Login](#3-login)
  - [4. Dashboard](#4-dashboard)
  - [5. Einstellungen](#5-einstellungen)
  - [6. Admin-Bereich](#6-admin-bereich)
  - [7. Verbinden neuer Heizungsthermostaten](#7-verbinden-neuer-heizungsthermostaten)
  - [8. Troubleshooting](#8-troubleshooting)

---

## 1. Homepage

![Homepage](../resources/homepage_de.png)

1. Über die Hilfefunktion können Sie die Bedienungsanleitung, Installationsanleitung und die Informationen zum Quellcode aufrufen.
2. Sie können zwischen Deutsch und Englisch wählen.
3. Sie können zwischen Tag- und Nacht-Modus wählen.
4. In der Mitte befinden sich der Login- und Registrieren-Button. Die Verwendung der Website ist ausschließlich mit einem Nutzeraccount möglich.

---

## 2. Registrieren

![Registrieren](../resources/sign_up_de.png)

1. Entscheiden Sie sich für einen Nutzernamen.
2. Entscheiden Sie sich für ein Passwort, das mindestens eine Zeichenlänge von 7 hat.
3. Geben Sie den Raum an, in dem Sie sitzen. Falls nicht klar ist, welcher Raum zutrifft, wählen Sie `n001`und stellen Sie den Raum nach der Anmeldung in den Einstellungen ein. Nach der Anmeldung ist eine Darstellung des Gebäudes im Dashboard zu betrachten.
4. Verwenden Sie als Kalender-String den Titel Ihrer Kalendereinträge (z.B. "ab12@n5") aus dem Heizungssteuerung-Nextcloud-Kalender. Der Titel wird verwendet, um die Heizung entsprechend ihrer Anwesenheit ein- und auszuschalten. Jeder Kalendereintrag muss mit diesem String beginnen bzw. diesen enthalten.
5. Sie brauchen den aktuellen Einladungscode von einem Admin. Der Standard-Code ist `smarthome`. Bitte geben Sie den Code case-sensitiv ein.
6. Schließen Sie die Registrierung ab.

---

## 3. Login

![Login](../resources/login_de.png)

1. Geben Sie Ihren Benutzernamen ein.
1. Geben Sie Ihr Passwort ein.
1. Ist der Login erfolgreich, sollten Sie auf das Dashboard weitergeleitet werden.

_Sollten Sie ihr Passwort vergessen haben, wenden Sie sich bitte an einen Admin. Dieser kann ihren Account löschen, sodass Sie einen neuen Account erstellen können._

---

## 4. Dashboard

![Dashboard](../resources/dashboard.png)

Auf dem Dashboard sehen Sie die aktuell gespeicherten Heizkörper, die für Ihren Raum relevant sind. Außerdem ist die Ziel-Temperatur und die aktuelle Temperatur der Heizung angezeigt.

Die Ziel-Temperatur beschreibt die Temperatur, die aktuell erreicht werden soll.

Die aktuelle Temperatur, ist die Temperatur, die das Gerät misst.

_In der Fritz!Box kann ein Offset Wert vergeben werden, falls die Temperatur aufgrund der Heizungswärme abweicht._

---

![Geräteliste](../resources/device_de.png)

Bei der Geräteliste sehen Sie die aktuellen Informationen über die gespeicherten Heizkörper.

_Wenn sie den Heizkörper über das Dashboard manuell einstellen, so wird dieser für den Rest des Tages, bis zur nächtlichen Abschaltung, die eingestellte Temperatur halten._

---

## 5. Einstellungen

![Einstellungen](../resources/settings_de.png)

1. Als Erstes sehen Sie den Namen des angemeldeten Benutzers.
1. Wunschtemperatur einstellen: Die für Sie relevanten Heizkörper, in Ihrem Raum, werden entsprechend Ihrer gespeicherten Temperatur eingestellt.
1. Bei der Raumzuordnung können Sie Ihren zugehörigen Raum anpassen. Auf dem Dashboard sind die Raumnamen zu finden.
1. Verwenden Sie als Kalender-String den Titel Ihrer Kalendereinträge (z.B. "ab12@n5") aus dem Heizungssteuerung-Nextcloud-Kalender. Der Titel wird verwendet, um die Heizung entsprechend ihrer Anwesenheit ein- und auszuschalten. Jeder Kalendereintrag muss mit diesem String beginnen bzw. diesen enthalten.
1. Wahlweise können Sie einen Sepia-Modus für alle Seiten aktivieren.
1. Sie können die Schriftgröße für alle Seiten der Heizungssteuerung anpassen.
1. Sie können den Zeilenabstand für alle Seiten der Heizungssteuerung anpassen.
1. Als Letztes können Sie sich über den Logout-Button ausloggen.

---

## 6. Admin-Bereich

![Admin](../resources/admin_de.png)

Dieser Bereich ist nur für Admins sichtbar. Weitere Informationen zum User Management befinden sich in der Installationsanleitung.

1. Bei der Geräteverwaltung können neue Geräte hinzugefügt, verwaltet und entfernt werden. Siehe: [Verbinden neuer Heizungsthermostaten](#7.-Verbinden-neuer-Heizungsthermostaten).
2. Den Einladungscode können Sie beliebig anpassen und als Link für einen neuen Benutzer bereitstellen. Der Code wird bei der Registrierung benötigt, um einen Account zu erstellen.
3. Die nächtliche Abschaltung gibt an, zwischen welchen Stunden des Tages die Standardtemperatur eingestellt werden soll.
4. Bei der Standardtemperatur können Sie eine Temperatur auswählen, die als Standardwert verwendet wird. Diese wird eingestellt, wenn niemand im Büro anwesend ist.
5. Die Vorheizzeit in Minuten pro Grad gibt an, wie weit im Voraus die Heizung angeht, bevor ein Mitarbeiter ins Gebäude kommt. _Beispielsweise wird die Heizung 20 Minuten vor dem Eintreffen gestartet, wenn aktuell 18 Grad im Gebäude sind und der Mitarbeiter 22 Grad ausgewählt hat._
6. Sie können die Synchronisation zwischen Kalender und Heizung mit der letzten Einstellung deaktivieren. Dadurch werden die Kalenderevents aus Nextcloud nicht mehr bei der Einstellung der Wunschtemperatur berücksichtigt.

Über **Speichern** können Sie die geänderten Einstellungsoptionen für die aktuelle Heizungssteuerung speichern.

## 7. Verbinden neuer Heizungsthermostaten

Beim Hinzufügen neuer Geräte empfiehlt es sich, die Oberfläche der Fritz!Box zu verwenden, um die Einstellungen korrekt vornehmen zu können.

1. **Name:** Vergeben Sie einen Namen Ihrer Wahl, um zu wissen, welches Gerät gemeint ist.
1. **ID:** Setzen Sie die gleiche ID, die beim Gerät in der Fritz!Box hinterlegt wurde. Beispielsweise `09995 0688917`. Diese ist einsehbar auf der Fritz!Box Seite `http://fritz.box` unter Smart Home -> Bedienung -> {Name des Geräts.}
1. **Typ des Geräts:** Wählen Sie `FRITZ!DECT 301` oder `FRITZ!DECT 302` entsprechend dem Geräte-Typ, um welchen es sich handelt.
1. **Raum und Heizung:** Wählen Sie aus, um welche Heizung es sich handelt. Über dem Dashboard sind die IDs und Räume einsehbar.
1. **Gerät hinzufügen:** Wenn alle Angaben korrekt sind, wird das Gerät hinzugefügt. Kann das System kein Gerät mit der angegebenen ID finden, wird kein Gerät angelegt.

## 8. Troubleshooting


  - **Was tun, wenn ich Passwort oder Benutzername vergessen habe?**
  
    Da die Registrierung über einen Einladungscode funktioniert, werden auch keine persönlichen Daten wie die E-Mail-Adresse benötigt. Allerdings bedeutet dies, dass es keinen sicheren Weg gibt, das Passwort wiederzuerlangen. Bitte registrieren Sie sich daher erneut.

    Im Falle eines vergessenen Benutzernamens, können Sie sich an einen Admin wenden, welcher Ihnen dabei weiterhelfen kann.
