# 📘 Projektbeschreibung: QR-basierte Zeiterfassung
**Technologie-Stack:**
- **Backend:** Java Spring Boot
- **Frontend:** React
- **Datenbank:** PostgreSQL

**Ziel des Projekts:**  
Ein System, mit dem Mitarbeiter*innen mittels **QR-Code** ein- und ausstempeln können. Das System generiert QR-Codes für „Einstempeln“ und „Ausstempeln“.  
Neu: **Jeder generierte QR-Code ist nur N Sekunden gültig**, wobei **N vom Admin veränderbar** ist.

---

# 1. Projektrequirements

## 1.1 Funktionale Anforderungen
1. Das System soll zwei Arten von QR-Codes generieren können:
    - **Einstempeln**
    - **Ausstempeln**
2. QR-Codes sind nur **N Sekunden gültig**.
    - Admin kann N im System konfigurieren (z. B. über Umgebungsvariable, Admin-UI oder Config-Datei).
3. Ein Benutzer soll im Frontend zwei Buttons sehen:
    - „Einstempeln“
    - „Ausstempeln“
4. Nach Klick auf einen Button wird ein QR-Code erzeugt und angezeigt.
5. Der QR-Code enthält eine **Ablaufzeit (`expiresAt`)**, nach der er ungültig wird.
6. Das Produktionsgerät (Scanner-Client) liest den QR-Code ein und sendet den enthaltenen Payload an das Backend.
7. Das Backend validiert die Signatur, die QR-Aktion (IN/OUT) und die Ablaufzeit.
8. Bei gültigem QR-Code wird der Stempelvorgang persistiert.
9. Bei abgelaufenem QR-Code wird eine Fehlermeldung zurückgegeben.
10. Benutzer können (optional) ihre eigenen Log-Einträge einsehen.
11. Administratoren können (optional) alle Logs einsehen.

## 1.2 Nicht-funktionale Anforderungen
- System soll **hohe Verfügbarkeit** haben.
- Response-Zeit für QR-Erzeugung < 1s.
- QR-Gültigkeitsdauer N soll ohne Codeänderung veränderbar sein.
- Backend und Frontend sollen containerisierbar sein.
- Kommunikation über REST-API (JSON).

---

# 2. Use Cases / User Stories

## 2.1 User Stories
### **US-001 – QR-Code zum Einstempeln erzeugen**
*Als Mitarbeiter möchte ich einen QR-Code „Einstempeln“ erzeugen, der für N Sekunden gültig ist.*

### **US-002 – QR-Code zum Ausstempeln erzeugen**
*Als Mitarbeiter möchte ich einen QR-Code „Ausstempeln“ erzeugen, der für N Sekunden gültig ist.*

### **US-003 – Einstempeln durch QR-Scan**
*Als Scanner möchte ich nach dem Scannen eines gültigen QR-Codes einen API-Call zum Backend senden, der das Einstempeln persistiert.*

### **US-004 – Ausstempeln durch QR-Scan**
*Als Scanner möchte ich einen gültigen QR-Code „Ausstempeln“ verarbeiten.*

### **US-005 – QR-Code abgelaufen**
*Als System möchte ich bei Ablauf des QR-Codes eine Fehlermeldung erzeugen, damit kein Missbrauch stattfinden kann.*

### **US-006 – Konfiguration der QR-Gültigkeitsdauer**
*Als Administrator möchte ich die Gültigkeitsdauer N der QR-Codes ändern können.*

### **US-007 – Logs einsehen (optional)**
*Als Mitarbeiter möchte ich meine bisherigen Stempelvorgänge einsehen können.*

---

# 3. Architektur & Systemdesign

## 3.1 Überblick
**Frontend (React)**
- UI: Buttons zum Erzeugen der QR-Codes
- Anzeige des QR-Codes
- Optional: Admin-Oberfläche zur Anpassung der Gültigkeitsdauer N

**Backend (Spring Boot)**
- Endpunkt `/api/qrcode/in` → erzeugt Einstempel-QR
- Endpunkt `/api/qrcode/out` → erzeugt Ausstempel-QR
- Enthält Business-Logik für Signierung, Ablaufzeit und Sicherheitsprüfung
- Endpunkt `/api/scan` → wird vom Scanner aufgerufen
- Persistiert IN/OUT Vorgänge in PostgreSQL
- Konfigurierbare Gültigkeitsdauer N (z. B. in `application.properties`)

**Database (PostgreSQL)**

Tabelle **time_logs**  
| id | user_id | action (IN/OUT) | timestamp |

Optionale Tabelle **system_settings**  
| key | value |  
(z. B. `"qr.expiration.seconds"`)

## 3.2 QR-Payload
```json
{
  "userId": "12345",
  "action": "IN",
  "issuedAt": "2025-01-01T12:00:00Z",
  "expiresAt": "2025-01-01T12:00:15Z",
  "signature": "…"
}
```

# 4. Technische Entscheidungen (ADRs)

## ADR-001 – QR-Code Format & Ablaufzeit

**Entscheidung:**  
QR-Code enthält `issuedAt` und `expiresAt` und wird serverseitig signiert.  
Die Ablaufzeit N Sekunden wird zentral konfiguriert (Umgebungsvariable oder DB).

**Begründung:**  
Erhöhte Sicherheit, verhindert Replay Attacks.

---

## ADR-002 – Technologieauswahl

- Frontend: **React**
- Backend: **Spring Boot**
- Datenbank: **PostgreSQL**

Begründung: moderne, etablierte, skalierbare Architektur.

---

## ADR-003 – QR-Code Library

**Backend verwendet ZXing**, da es stabil, weit verbreitet und optimal für Java geeignet ist.

---

## ADR-004 – Verwaltung der QR-Gültigkeitsdauer

**Entscheidung:**  
Die Ablaufzeit N wird über eine zentrale Konfiguration definiert:

- **Option A:** `application.properties` + Hot Reload
- **Option B:** Admin UI + DB-Eintrag (optional)

**Begründung:**  
Flexibilität für Administratoren, keine Codeänderung notwendig.

---

# 5. Testkonzept & Testplan

## 5.1 Testarten

- **Unit Tests**
    - QR-Erzeugung
    - Ablaufprüfung
    - Signierung
- **Integrationstests**
    - Scanner → Backend → Datenbank
- **UI Tests**
    - Buttons
    - QR-Code-Anzeige

---

## 5.2 Testfälle

| Testfall | Beschreibung | Erwartung |
|----------|--------------|-----------|
| TC-001 | IN-QR generieren | QR wird angezeigt |
| TC-002 | OUT-QR generieren | QR wird angezeigt |
| TC-003 | Scan gültiger IN-QR | DB enthält IN Eintrag |
| TC-004 | Scan gültiger OUT-QR | DB enthält OUT Eintrag |
| TC-005 | QR nach Ablaufzeit N Sekunden scannen | Fehler „QR expired“ |
| TC-006 | Admin ändert N | Neue QR-Codes nutzen neuen N-Wert |

---

# 6. Iterativer Entwicklungsplan

## Iteration 1 – Basis-Setup
- React Grundgerüst
- Spring Boot Grundprojekt
- Datenbankmigrationen
- API-Struktur / Basis-Endpoints

## Iteration 2 – QR-Funktionalität
- QR-Code Generator
- Ablaufzeit N integrieren
- Signierlogik implementieren
- Frontend UI für QR-Generierung

## Iteration 3 – Scanner-Flow
- Scan-Endpunkt implementieren
- Ablaufprüfung
- Persistierung in DB

## Iteration 4 – Admin-Funktion (optional)
- Endpoint zur Änderung der Ablaufzeit
- UI für Administrator (optional)

## Iteration 5 – Test & Dokumentation
- Unit- und Integrationstests
- Docker-Setup
- README & KI-Protokoll fertigstellen

---

# 7. Empfohlene Repository-Struktur
```
/backend
/frontend
/docs
requirements.md
architecture.md
adr/
tests.md
docker-compose.yml
README.md
```
