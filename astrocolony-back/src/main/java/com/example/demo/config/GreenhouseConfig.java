package com.example.demo.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "greenhouse")
@Data
public class GreenhouseConfig {
    private double maxRadiation = 500.0;
    private int lightHours = 16;
    private double waterCapacity = 1000.0;

    public double getMaxRadiation() {
        return maxRadiation;
    }

    public void setMaxRadiation(double maxRadiation) {
        this.maxRadiation = maxRadiation;
    }

    public int getLightHours() {
        return lightHours;
    }

    public void setLightHours(int lightHours) {
        this.lightHours = lightHours;
    }

    public double getWaterCapacity() {
        return waterCapacity;
    }

    public void setWaterCapacity(double waterCapacity) {
        this.waterCapacity = waterCapacity;
    }
}