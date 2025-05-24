package com.example.demo.model;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
public class GreenhouseEnvironment {
    private double temperature = 20.0;
    private double co2Level = 400.0;
    private double humidity = 60.0;
    private double lightIntensity = 10000.0;
    private double nutrientLevel = 0.8;
    private double radiationLevel;

    // Synchronizowane gettery i settery


    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public double getCo2Level() {
        return co2Level;
    }

    public void setCo2Level(double co2Level) {
        this.co2Level = co2Level;
    }

    public double getHumidity() {
        return humidity;
    }

    public void setHumidity(double humidity) {
        this.humidity = humidity;
    }

    public double getLightIntensity() {
        return lightIntensity;
    }

    public void setLightIntensity(double lightIntensity) {
        this.lightIntensity = lightIntensity;
    }

    public double getNutrientLevel() {
        return nutrientLevel;
    }

    public void setNutrientLevel(double nutrientLevel) {
        this.nutrientLevel = nutrientLevel;
    }

    public double getRadiationLevel() {
        return radiationLevel;
    }

    public void setRadiationLevel(double radiationLevel) {
        this.radiationLevel = radiationLevel;
    }
}
