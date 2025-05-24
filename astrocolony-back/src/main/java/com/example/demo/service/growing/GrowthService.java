package com.example.demo.service.growing;

import com.example.demo.model.GreenhouseEnvironment;
import com.example.demo.model.Plant;
import com.example.demo.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GrowthService {
    private static final double BASE_GROWTH_RATE = 0.001;

    @Autowired
    private PlantRepository plantRepository;

    @Autowired
    private GreenhouseEnvironment environment;

    @Autowired
    private RadiationService radiationService;

    @Scheduled(fixedRate = 60000)
    public void growPlants() {
        List<Plant> plants = plantRepository.findAll();
        plants.forEach(this::updatePlant);
        plantRepository.saveAll(plants);
    }

    private void updatePlant(Plant plant) {
        double growthFactor = calculateGrowthFactor();
        double healthImpact = calculateHealthImpact(growthFactor);

        plant.setGrowthStage(
                Math.min(1.0,
                        plant.getGrowthStage() + BASE_GROWTH_RATE * growthFactor)
        );

        plant.setHealth(
                Math.max(0.0,
                        Math.min(1.0, plant.getHealth() + healthImpact))
        );
    }

    private double calculateGrowthFactor() {
        return temperatureFactor() *
                lightFactor() *
                radiationService.getRadiationFactor() *
                nutrientFactor();
    }

    private double temperatureFactor() {
        return 1 - Math.abs(environment.getTemperature() - 22.0) / 20.0;
    }

    private double lightFactor() {
        return environment.getLightIntensity() / 15000.0;
    }

    private double nutrientFactor() {
        return environment.getNutrientLevel();
    }

    private double calculateHealthImpact(double growthFactor) {
        return growthFactor > 0.5 ? 0.005 : -0.01;
    }
}