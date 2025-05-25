package com.example.demo.model;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Random;

@Component
public class GreenhouseEnvironment {
    private final Random random = new Random();

    // Bazowe wartości środowiskowe
    private double baseTemperature = 22.0;
    private double baseCo2Level = 420.0;
    private double baseHumidity = 65.0;
    private double baseLightIntensity = 12000.0;
    private double baseNutrientLevel = 0.75;
    private double baseRadiationLevel = 0.1;

    // Aktualne wartości z fluktuacjami
    private double temperature;
    private double co2Level;
    private double humidity;
    private double lightIntensity;
    private double nutrientLevel;
    private double radiationLevel;

    public GreenhouseEnvironment() {
        updateEnvironmentalConditions();
    }

    /**
     * Aktualizuje warunki środowiskowe z uwzględnieniem cyklu dobowego i losowych fluktuacji
     */
    public void updateEnvironmentalConditions() {
        LocalTime now = LocalTime.now();
        int hour = now.getHour();

        // Temperatura - wyższa w dzień, niższa w nocy
        double tempVariation = calculateDayNightVariation(hour, 3.0);
        this.temperature = baseTemperature + tempVariation + getRandomFluctuation(0.5);

        // CO2 - wyższy w nocy (brak fotosyntezy), niższy w dzień
        double co2Variation = -calculateDayNightVariation(hour, 50.0);
        this.co2Level = baseCo2Level + co2Variation + getRandomFluctuation(15.0);

        // Wilgotność - wyższa rano i wieczorem
        double humidityVariation = calculateHumidityVariation(hour);
        this.humidity = baseHumidity + humidityVariation + getRandomFluctuation(3.0);

        // Intensywność światła - symuluje naturalne oświetlenie
        this.lightIntensity = calculateLightIntensity(hour) + getRandomFluctuation(500.0);

        // Poziom składników odżywczych - powoli maleje, wymaga uzupełniania
        this.nutrientLevel = Math.max(0.1, baseNutrientLevel + getRandomFluctuation(0.05));

        // Poziom promieniowania - związany z intensywnością światła
        this.radiationLevel = (lightIntensity / 100000.0) + getRandomFluctuation(0.02);

        // Ograniczenia wartości do realistycznych zakresów
        applyRealisticConstraints();
    }

    /**
     * Oblicza wariację dzień/noc dla parametrów środowiskowych
     */
    private double calculateDayNightVariation(int hour, double amplitude) {
        // Maksimum około 14:00, minimum około 4:00
        double radians = ((hour - 4) * 2 * Math.PI) / 24;
        return amplitude * Math.sin(radians);
    }

    /**
     * Oblicza wariację wilgotności - wyższa rano i wieczorem
     */
    private double calculateHumidityVariation(int hour) {
        if (hour >= 6 && hour <= 8) return 8.0; // Wysoka wilgotność rano
        if (hour >= 18 && hour <= 20) return 5.0; // Podwyższona wieczorem
        if (hour >= 12 && hour <= 16) return -5.0; // Niższa w południe
        return 0.0;
    }

    /**
     * Oblicza intensywność światła w zależności od pory dnia
     */
    private double calculateLightIntensity(int hour) {
        if (hour >= 6 && hour <= 18) {
            // Dzień - symuluje krzywą słoneczną
            double dayProgress = (hour - 6) / 12.0;
            double intensity = Math.sin(dayProgress * Math.PI);
            return intensity * 25000.0 + 5000.0; // 5000-30000 lux
        } else {
            // Noc - tylko sztuczne oświetlenie
            return 500.0 + getRandomFluctuation(100.0);
        }
    }

    /**
     * Generuje losowe fluktuacje
     */
    private double getRandomFluctuation(double range) {
        return (random.nextDouble() - 0.5) * 2 * range;
    }

    /**
     * Stosuje realistyczne ograniczenia do wszystkich parametrów
     */
    private void applyRealisticConstraints() {
        temperature = Math.max(15.0, Math.min(35.0, temperature));
        co2Level = Math.max(300.0, Math.min(2000.0, co2Level));
        humidity = Math.max(30.0, Math.min(95.0, humidity));
        lightIntensity = Math.max(0.0, Math.min(50000.0, lightIntensity));
        nutrientLevel = Math.max(0.0, Math.min(1.0, nutrientLevel));
        radiationLevel = Math.max(0.0, Math.min(1.0, radiationLevel));
    }

    /**
     * Symuluje zewnętrzne zakłócenia (np. zmiana pogody)
     */
    public void simulateWeatherDisturbance() {
        double disturbanceFactor = random.nextDouble();

        if (disturbanceFactor < 0.1) { // 10% szans na zakłócenie
            // Symuluj pochmurny dzień
            lightIntensity *= 0.3;
            humidity += 10.0;
            temperature -= 2.0;
        } else if (disturbanceFactor < 0.05) { // 5% szans na burzę
            humidity += 20.0;
            temperature -= 5.0;
            lightIntensity *= 0.1;
        }

        applyRealisticConstraints();
    }

    /**
     * Zmniejsza poziom składników odżywczych (zużycie przez rośliny)
     */
    public void consumeNutrients(double amount) {
        this.baseNutrientLevel = Math.max(0.1, this.baseNutrientLevel - amount);
        this.nutrientLevel = Math.max(0.1, this.nutrientLevel - amount);
    }

    /**
     * Uzupełnia składniki odżywcze
     */
    public void refillNutrients(double amount) {
        this.baseNutrientLevel = Math.min(1.0, this.baseNutrientLevel + amount);
    }

    // Gettery i settery
    public double getTemperature() {
        return Math.round(temperature * 100.0) / 100.0; // Zaokrąglenie do 2 miejsc po przecinku
    }

    public void setTemperature(double temperature) {
        this.baseTemperature = temperature;
    }

    public double getCo2Level() {
        return Math.round(co2Level * 10.0) / 10.0;
    }

    public void setCo2Level(double co2Level) {
        this.baseCo2Level = co2Level;
    }

    public double getHumidity() {
        return Math.round(humidity * 10.0) / 10.0;
    }

    public void setHumidity(double humidity) {
        this.baseHumidity = humidity;
    }

    public double getLightIntensity() {
        return Math.round(lightIntensity);
    }

    public void setLightIntensity(double lightIntensity) {
        this.baseLightIntensity = lightIntensity;
    }

    public double getNutrientLevel() {
        return Math.round(nutrientLevel * 1000.0) / 1000.0;
    }

    public void setNutrientLevel(double nutrientLevel) {
        this.baseNutrientLevel = nutrientLevel;
    }

    public double getRadiationLevel() {
        return Math.round(radiationLevel * 1000.0) / 1000.0;
    }

    public void setRadiationLevel(double radiationLevel) {
        this.baseRadiationLevel = radiationLevel;
    }

    /**
     * Zwraca informacje o aktualnych warunkach środowiskowych
     */
    public String getEnvironmentStatus() {
        return String.format(
                "Temperatura: %.1f°C, CO2: %.0f ppm, Wilgotność: %.1f%%, " +
                        "Światło: %.0f lux, Składniki: %.2f, Promieniowanie: %.3f",
                temperature, co2Level, humidity, lightIntensity, nutrientLevel, radiationLevel
        );
    }
}