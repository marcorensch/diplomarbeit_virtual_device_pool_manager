# Virtual Device Pool Manager
## Diplomarbeit von Marco Rensch
### NDS HF Applikationsentwickler 2023

Git Repository zu meiner Diplomarbeit "Virtual Device Pool Manager" als Applikationsentwickler NDS HF 2023


## Inhaltsverzeichnis
- [Einleitung](#einleitung)
- [Vorbereitung](#vorbereitung)
- [Installation](#installation)
- [Konfiguration](#konfiguration)
- [Benutzung](#benutzung)
- [Entwickler](#entwickler)
- [Lizenz](#lizenz)
- [Quellen](#quellen)



## Einleitung

## Vorbereitung

### Voraussetzungen

Die Applikation wurde mit folgenden Versionen getestet:

- [MariaDB 10.11.2](https://mariadb.org/)
- [NodeJS 18.15.0](https://nodejs.org/en/)
- [NPM 9.5.0](https://www.npmjs.com/)

## Installation

Starte die Installation der Abhängigkeiten mit `npm install` im Projektverzeichnis (Hauptverzeichnis).

## Konfiguration

Starte anschliessend den Setup Prozess mit `npm run setup` und folge den Anweisungen. Das Skript erstellt die benötigten 
.env Dateien sowie die Datenbank.

### Hinweis zur Verwendung von SSL

Die Applikation unterstützt die Verwendung von SSL. Dazu muss ein gültiges Zertifikat und ein privater Schlüssel im PEM
Format vorhanden sein. Diese müssen im Verzeichnis `certs` abgelegt werden. Die Dateinamen müssen `cert.pem`
und `key.pem` lauten.

Das Setup Skript kann automatisch ein Zertifikat und einen privaten Schlüssel generieren (Siehe hierzu die entsprechenden
Fragen im Prozess), diese werden im Verzeichnis `certs` abgelegt. Da es sich hierbei um ein Selbst signiertes Zertifikat
handelt, muss es vom Browser akzeptiert werden.

öffne dazu die URL `https://localhost:{ PORT }` (Ersetze beim Aufruf im Browser **{ PORT }** mit dem von dir definierten 
API Port aus dem Setup Prozess, standardmässig wird der Port **3000** verwendet). Der Browser wird eine Warnung anzeigen, dass das Zertifikat nicht
vertrauenswürdig ist. Klicke auf "Erweitert" und anschliessend auf "Zertifikat ansehen". Anschliessend kannst du
auswählen, das dem Zertifikat vertraut werden soll.

Hinweis: Das Vorgehen kann von Browser zu Browser variieren.

## Benutzung (Lokal)

Starte die Applikation mit `npm run devStart` im Projektverzeichnis (Hauptverzeichnis).

Hinweis: Wird die Applikation mit aktiver SSL-Option gestartet muss bei der ersten Verwendung im jeweiligen Browser 
das Zertifikat akzeptiert werden.

## Entwickler

**NXD | nx-designs**  
Marco Rensch  
[Webseite](https://nx-designs.ch)

## Lizenz

[MIT](LICENSE) © [Marco Rensch](https://nx-designs.ch)

## Quellen
