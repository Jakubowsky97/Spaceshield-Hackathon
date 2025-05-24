package com.example.demo.service.power;

import com.example.demo.client.WeatherApiClient;
import com.example.demo.model.WeatherResponse;
import com.example.demo.service.weather.MarsWeatherService;
import org.springframework.web.reactive.function.client.WebClient;


public class PowerOutputService {
    double standardSunRadiation = 590;
    WeatherApiClient weatherApiClient = new WeatherApiClient(WebClient.builder());
    double topSpeed = new WeatherResponse(weatherApiClient.getLatestWeather()).getMaxWindSpeed();
    double minSpeed =  new WeatherResponse(weatherApiClient.getLatestWeather()).getMinWindSpeed();

    public double calculateSolarPanelOutput(double solarPanelsInMeters){
        double efficiency;
        if ((topSpeed - minSpeed) > 15){
             efficiency = standardSunRadiation * 0.2 * 1 * solarPanelsInMeters;
        }
        else {
            efficiency = standardSunRadiation * 0.8 * 0.95 * standardSunRadiation;
        }
        return efficiency;
    }

}
