package com.example.demo.model;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;


@Data
public class EnviromentAdjustmentDTO {
    @Min(0)
    @Max(50)
    private double temperature;

    @Min(300)
    @Max(2000)
    private double co2Level;

    @Min(0)
    @Max(100000)
    private double lightIntensity;

    @DecimalMin("0.0")
    @DecimalMax("1.0")
    private double nutrientLevel;

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
}