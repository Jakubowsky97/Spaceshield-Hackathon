package com.example.demo.controller.growthController;

import com.example.demo.model.GreenhouseEnviroment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/environment")
public class GreenhouseEnvironment {
    private final GreenhouseEnviroment environmentService;

    public GreenhouseEnvironment(GreenhouseEnviroment environmentService) {
        this.environmentService = environmentService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Double>> getEnvironment() {
        return ResponseEntity.ok(Map.of(
                "temperature", environmentService.getTemperature(),
                "co2Level", environmentService.getCo2Level(),
                "humidity", environmentService.getHumidity(),
                "lightIntensity", environmentService.getLightIntensity(),
                "nutrientLevel", environmentService.getNutrientLevel(),
                "radiationLevel", environmentService.getRadiationLevel()
        ));
    }

    @GetMapping("/factors")
    public ResponseEntity<Map<String, Double>> getEnvironmentFactors() {
        return ResponseEntity.ok(Map.of(
                "temperatureFactor", environmentService.getTemperatureFactor(),
                "lightFactor", environmentService.getLightFactor(),
                "nutrientFactor", environmentService.getNutrientFactor(),
                "radiationFactor", environmentService.getRadiationFactor()
        ));
    }
}