package com.example.demo.service.weather;

import com.example.demo.client.WeatherApiClient;
import com.example.demo.model.WeatherResponse;
import reactor.core.publisher.Mono;

import java.util.List;

public class DustStormWarning {

    private final WeatherApiClient weatherApiClient;

    public DustStormWarning(WeatherApiClient weatherApiClient) {
        this.weatherApiClient = weatherApiClient;
    }
    public boolean isDustStormIminent() {
        boolean isdustStorm = false;
        List<WeatherResponse> weatherResponse = weatherApiClient.getAllSolsWeather().block();
        for (WeatherResponse weatherResponse1:weatherResponse){
            double avg = weatherResponse1.getAvgWindSpeed();
            double max = weatherResponse1.getMaxWindSpeed();
            if ((max-avg)>15){
                isdustStorm = true;
            }

        }
        return isdustStorm;
    }


    }

