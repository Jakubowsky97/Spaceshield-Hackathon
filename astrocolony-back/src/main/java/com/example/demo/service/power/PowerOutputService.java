package com.example.demo.service.power;

import com.example.demo.client.WeatherApiClient;
import com.example.demo.model.WeatherResponse;
import com.example.demo.service.weather.DustStormWarning;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PowerOutputService {

    private final WeatherApiClient weatherApiClient;
    DustStormWarning dustStormWarning;
    private final double standardSunRadiation = 590.0;

    public PowerOutputService(WeatherApiClient weatherApiClient) {
        this.weatherApiClient = weatherApiClient;
    }

    public double calculateSolarPanelOutput(double solarPanelsInMeters) {
            if (dustStormWarning.isDustStormIminent()) {
                return standardSunRadiation * solarPanelsInMeters * 0.2 ;
            } else {
                return standardSunRadiation * standardSunRadiation * 0.8 * 0.90;
            }

    }

    public double calculateSolarPanelEfficiency(double solarPanelsInMeters) {
        return calculateSolarPanelOutput(standardSunRadiation/solarPanelsInMeters);

    }
}
