# 🚀 AstroColony

AstroColony to interaktywny symulator kolonii na Marsie stworzony podczas 24-godzinnego hackathonu. Projekt pozwala użytkownikom eksplorować mapę Marsa, oznaczać miejsca pod farmy, zarządzać danymi środowiskowymi (jak tlen, woda, energia) oraz symulować cykl dnia i nocy.

## 🧩 Stack technologiczny

### Frontend
- ⚡ **Vite** + **TypeScript**
- ⚛️ **React**
- 🗺️ **React Leaflet** – interaktywna mapa Marsa
- 📊 **Recharts** – wizualizacja danych środowiskowych
- 🧭 **OpenPlanetary Map** – [Mapa Marsa (Global Viking MDIM 2.1)](https://www.openplanetary.org/opm-basemaps/global-viking-mdim2-1-colorized-mosaic)

### Backend
- ☕ **Spring Boot**
- 🌐 **Spring Web**
- ⏱ **Spring Scheduler** – automatyczna aktualizacja danych środowiskowych i symulacja cyklu dnia/nocy

---

## 🔧 Funkcjonalności

### ✅ Gotowe
- Interaktywna mapa Marsa z możliwością oznaczania farm
- Wybór typu farmy, nazwy oraz wizualizacja danych
- Symulacja dnia i nocy (automatyczna zmiana parametrów co określony czas)
- Backend z harmonogramem i punktami API do zarządzania danymi

### 🔜 Planowane / Rozwojowe
- Zaawansowane modele symulacyjne (np. wpływ typów farm na poziomy zasobów)
- Historia zmian i log aktywności
- Więcej typów struktur i interakcji z mapą

---

## 🖥️ Uruchamianie projektu lokalnie

### 🔽 Klonowanie repozytorium

```bash
git clone https://github.com/TwojeKonto/astrocolony.git
cd astrocolony
```

### 🚀 Frontend

```bash
cd frontend
npm install
npm run dev
```

Domyślnie uruchomi się na: `http://localhost:5173`

### ☕ Backend

```bash
cd backend
./mvnw spring-boot:run
```
Backend działa na: `http://localhost:8080`

## 🤝 Zespół
Projekt stworzony podczas hackathonu przez zespół:

Jakub Mądry (frontend + integracja mapy + UI)
Szymon Kasprzyk (backend + API Nasa Insight)
Natalia Gregorzyk (Prezentacja + UI)
Aleksander Galek (Demo aplikacji)