package com.example.demo.controller.growthController;

import com.example.demo.model.EnviromentAdjustmentDTO;
import com.example.demo.model.GreenhouseEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/environment")
public class EnvironmentController {
    @Autowired
    private GreenhouseEnvironment environment;

    @GetMapping
    public ResponseEntity<Map<String, Double>> getEnvironment() {
        return ResponseEntity.ok(Map.of(
                "temperature", environment.getTemperature(),
                "co2Level", environment.getCo2Level(),
                "humidity", environment.getHumidity(),
                "lightIntensity", environment.getLightIntensity(),
                "nutrientLevel", environment.getNutrientLevel(),
                "radiationLevel", environment.getRadiationLevel()
        ));
    }

    @PostMapping("/adjust")
    public ResponseEntity<String> adjustEnvironment(@RequestBody EnviromentAdjustmentDTO adjustment) {
        environment.setTemperature(adjustment.getTemperature());
        environment.setCo2Level(adjustment.getCo2Level());
        environment.setLightIntensity(adjustment.getLightIntensity());
        environment.setNutrientLevel(adjustment.getNutrientLevel());
        return ResponseEntity.ok("Environment adjusted");
    }
}