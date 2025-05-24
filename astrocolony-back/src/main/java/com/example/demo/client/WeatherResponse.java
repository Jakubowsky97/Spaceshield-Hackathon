package com.example.demo.client;

import java.util.Map;


public class WeatherResponse {
    private String sol;
    private String terrestrialDate;
    private double avgTemperature;
    private double averagePressure;
    private double averageWindSpeed;

    public WeatherResponse(String sol, String terrestrialDate, double avgTemperature,
                           double averagePressure, double averageWindSpeed) {
        this.sol = sol;
        this.terrestrialDate = terrestrialDate;
        this.avgTemperature = avgTemperature;
        this.averagePressure = averagePressure;
        this.averageWindSpeed = averageWindSpeed;
    }

    public String getSol() {
        return sol;
    }

    public String getTerrestrialDate() {
        return terrestrialDate;
    }

    public double getAvgTemperature() {
        return avgTemperature;
    }

    public double getAveragePressure() {
        return averagePressure;
    }

    public double getAverageWindSpeed() {
        return averageWindSpeed;
    }
}