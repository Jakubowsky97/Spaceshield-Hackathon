package com.example.demo.model;


import reactor.core.publisher.Mono;

public class WeatherResponse {
    private String sol;
    private String terrestrialDate;
    private double avgTemperature;
    private double minTemperature;
    private double maxTemperature;
    private double avgPressure;
    private double minPressure;
    private double maxPressure;
    private double avgWindSpeed;
    private double minWindSpeed;
    private double maxWindSpeed;
    private double windDirection;


    public WeatherResponse(String sol, String terrestrialDate, double avgTemperature, double minTemperature, double maxTemperature, double avgPressure, double minPressure, double maxPressure, double avgWindSpeed, double minWindSpeed, double maxWindSpeed, double windDirection) {
        this.sol = sol;
        this.terrestrialDate = terrestrialDate;
        this.avgTemperature = avgTemperature;
        this.minTemperature = minTemperature;
        this.maxTemperature = maxTemperature;
        this.avgPressure = avgPressure;
        this.minPressure = minPressure;
        this.maxPressure = maxPressure;
        this.avgWindSpeed = avgWindSpeed;
        this.minWindSpeed = minWindSpeed;
        this.maxWindSpeed = maxWindSpeed;
        this.windDirection = windDirection;
    }

    public WeatherResponse(Mono<WeatherResponse> latestWeather) {
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

    public double getMinTemperature() {
        return minTemperature;
    }

    public double getMaxTemperature() {
        return maxTemperature;
    }

    public double getAvgPressure() {
        return avgPressure;
    }

    public double getMinPressure() {
        return minPressure;
    }

    public double getMaxPressure() {
        return maxPressure;
    }

    public double getAvgWindSpeed() {
        return avgWindSpeed;
    }

    public double getMinWindSpeed() {
        return minWindSpeed;
    }

    public double getMaxWindSpeed() {
        return maxWindSpeed;
    }

    public double getWindDirection() {
        return windDirection;
    }
}