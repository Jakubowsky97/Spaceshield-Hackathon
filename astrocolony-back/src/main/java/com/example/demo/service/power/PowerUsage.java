package com.example.demo.service.power;

import com.example.demo.client.WeatherApiClient;
import com.example.demo.model.WeatherResponse;
import com.example.demo.service.weather.MarsWeatherService;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class PowerUsage{

    MarsWeatherService marsWeatherService;

    private WeatherApiClient weatherApiClient;
    static final double heightM = 2.5;
    static final double internalTempC = 23;
    static final double uValue = internalTempC * 0.2;           // współczynnik strat cieplnych U (W/m²·K)
    static final   double lightingPowerPerM2 = 300; // moc oświetlenia na m² (W/m²)
    static final  double hours = 12;
    static double extTemp;
    public static double externalTempC = extTemp;

    public double getTemp() {
        WeatherResponse weatherResponse = weatherApiClient.getLatestWeather().block();
        assert weatherResponse != null;
        extTemp  = weatherResponse.getAvgTemperature();
        return extTemp;
    }


    public static double calculateMarsGreenhouseNightEnergy(
           @RequestBody double areaM2

    ) {
        double surfaceArea = (areaM2 * 2) + (4 * heightM * Math.sqrt(areaM2)); // ściany + dach
        double tempDifference = internalTempC - externalTempC;

        // Ogrzewanie – straty cieplne
        double heatLossWatts = uValue * surfaceArea * tempDifference;
        double heatingEnergyKWh = (heatLossWatts * hours) / 1000.0;

        // Oświetlenie
        double lightingWatts = lightingPowerPerM2 * areaM2;
        double lightingEnergyKWh = (lightingWatts * hours) / 1000.0;

        // Całkowite zużycie energii
        return heatingEnergyKWh + lightingEnergyKWh;
    }         // długość nocy marsjańskiej w godzinach
}
