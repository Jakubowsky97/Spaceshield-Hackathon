package com.example.demo.service.power;

import com.example.demo.client.WeatherApiClient;
import com.example.demo.model.WeatherResponse;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PowerOutputService {

    private final WeatherApiClient weatherApiClient;
    private final double standardSunRadiation = 590.0;

    public PowerOutputService(WeatherApiClient weatherApiClient) {
        this.weatherApiClient = weatherApiClient;
    }

    public Mono<Double> calculateSolarPanelOutput(double solarPanelsInMeters) {
        return weatherApiClient.getLatestWeather().map(weather -> {
            double topSpeed = weather.getMaxWindSpeed();
            double minSpeed = weather.getMinWindSpeed();
            if ((topSpeed - minSpeed) > 15) {
                return standardSunRadiation * solarPanelsInMeters * 0.2 ;
            } else {
                return standardSunRadiation * standardSunRadiation * 0.8 * 0.90;
            }
        });
    }

    public Mono<Double> calculateSolarPanelEfficiency(double solarPanelsInMeters) {
        return calculateSolarPanelOutput(solarPanelsInMeters)
                .map(output -> output / (standardSunRadiation * solarPanelsInMeters));
    }
}
