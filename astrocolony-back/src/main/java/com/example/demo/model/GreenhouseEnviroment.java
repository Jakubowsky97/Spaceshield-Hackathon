package com.example.demo.model;

import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicReference;

@Service
public class GreenhouseEnviroment {
    private final AtomicReference<Double> temperature = new AtomicReference<>(22.0);
    private final AtomicReference<Double> co2Level = new AtomicReference<>(400.0);
    private final AtomicReference<Double> humidity = new AtomicReference<>(60.0);
    private final AtomicReference<Double> lightIntensity = new AtomicReference<>(15000.0);
    private final AtomicReference<Double> nutrientLevel = new AtomicReference<>(0.8);
    private final AtomicReference<Double> radiationLevel = new AtomicReference<>(0.1);

    // Gettery dla surowych wartości
    public double getHumidity() {
        return humidity.get();
    }

    public double getCo2Level() {
        return co2Level.get();
    }


    // Gettery dla współczynników
    public double getTemperatureFactor() {
        return 1 - Math.abs(temperature.get() - 22.0) / 20.0;
    }

    public double getLightFactor() {
        return Math.min(1.0, lightIntensity.get() / 15000.0);
    }

    public double getNutrientFactor() {
        return nutrientLevel.get();
    }

    public double getRadiationFactor() {
        return 1 - (radiationLevel.get() * 0.5);
    }

    // Metody aktualizacji
    public void setHumidity(double value) {
        humidity.set(Math.max(0.0, Math.min(100.0, value)));
    }

    public void setCo2Level(double value) {
        co2Level.set(Math.max(300.0, Math.min(2000.0, value)));
    }

    // Gettery dla surowych wartości
    public double getTemperature() {
        return temperature.get();
    }

    public double getLightIntensity() {
        return lightIntensity.get();
    }

    public double getNutrientLevel() {
        return nutrientLevel.get();
    }

    public double getRadiationLevel() {
        return radiationLevel.get();
    }

    public double getYieldFactor() {
        return (this.getLightFactor() + this.getNutrientFactor()) / 2;
    }

    public double getHealthImpactFactor() {
        return (this.getTemperatureFactor() + this.getNutrientFactor()) / 2 -
                (this.getRadiationLevel() * 0.3);
    }
}