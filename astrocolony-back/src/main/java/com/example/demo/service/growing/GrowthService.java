package com.example.demo.service.growing;

import com.example.demo.model.GreenhouseEnviroment;
import com.example.demo.model.Plant;
import com.example.demo.model.Plant.GrowthStage;
import com.example.demo.repository.PlantRepository;
import lombok.Getter;
import lombok.Setter;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class GrowthService {
    private static final double BASE_GROWTH_RATE = 0.001;
    @Getter
    private volatile boolean simulationActive = false;

    private final PlantRepository plantRepository;
    private final GreenhouseEnviroment environmentService;

    public GrowthService(PlantRepository plantRepository,
                         GreenhouseEnviroment   environmentService) {
        this.plantRepository = plantRepository;
        this.environmentService = environmentService;
    }
    @Setter
    @Getter
    private long currentInterval = 60000;

    @Scheduled(fixedRateString  = "#{growthService.getCurrentInterval()}")
    @Transactional
    public void simulateGrowthCycle() {
        if (!simulationActive) return;
        List<Plant> plants = plantRepository.findAll();
        plants.forEach(plant -> {
            updateGrowthProgress(plant);
            updatePlantHealth(plant);
            calculateYield(plant);
        });
        plantRepository.saveAll(plants);
    }

    public void setCurrentInterval(int speed){
        currentInterval = speed;
    }

    public int getCurrentInterval(){
        return (int) currentInterval;
    }

    private void updateGrowthProgress(Plant plant) {
        if (plant.getGrowthStage() == GrowthStage.HARVESTED) return;

        double growthFactor = calculateGrowthFactor();
        plant.setGrowthProgress(Math.min(1.0,
                plant.getGrowthProgress() + BASE_GROWTH_RATE * growthFactor));

        updateGrowthStage(plant);
    }

    private void updateGrowthStage(Plant plant) {
        double progress = plant.getGrowthProgress();
        if (progress < 0.3) {
            plant.setGrowthStage(GrowthStage.SEEDLING);
        } else if (progress < 0.6) {
            plant.setGrowthStage(GrowthStage.VEGETATIVE);
        } else if (progress < 0.8) {
            plant.setGrowthStage(GrowthStage.FLOWERING);
        } else if (progress < 0.95) {
            plant.setGrowthStage(GrowthStage.FRUITING);
        } else {
            plant.setGrowthStage(GrowthStage.MATURE);
        }
    }
    @Transactional(readOnly = true)
    public Plant getPlantById(Long id) {
            return plantRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Plant> getAllPlants() {
        return plantRepository.findAll();
    }

    private void updatePlantHealth(Plant plant) {
        double healthChange = environmentService.getHealthImpactFactor();
        plant.setHealth(Math.max(0.0, Math.min(1.0,
                plant.getHealth() + healthChange)));
    }

    private void calculateYield(Plant plant) {
        if (plant.getGrowthStage() == GrowthStage.FRUITING ||
                plant.getGrowthStage() == GrowthStage.MATURE) {

            double yieldIncrease = calculateYieldIncrease(plant);
            plant.setActualYield(plant.getActualYield() + yieldIncrease);
        }
    }

    private double calculateYieldIncrease(Plant plant) {
        return environmentService.getYieldFactor() *
                plant.getHealth() *
                getSpeciesMultiplier(plant.getSpecies()) *
                0.01; // 1% wzrostu na cykl
    }

    private double getSpeciesMultiplier(String species) {
        return switch (species.toLowerCase()) {
            case "mars potato" -> 0.9;
            case "red martian tomato" -> 0.75;
            case "space wheat" -> 0.6;
            default -> 0.5;
        };
    }

    private double calculateGrowthFactor() {
        return environmentService.getTemperatureFactor() *
                environmentService.getLightFactor() *
                environmentService.getNutrientFactor() *
                environmentService.getRadiationFactor();
    }

    // Pozostałe metody serwisu
    @Transactional
    public double harvestPlant(Long plantId) {
        Plant plant = plantRepository.findById(plantId)
                .orElseThrow(() -> new RuntimeException("Plant not found"));

        if (plant.getGrowthStage() != GrowthStage.MATURE) {
            throw new IllegalStateException("Plant not ready for harvest");
        }

        double yield = plant.getActualYield();
        plant.setGrowthStage(GrowthStage.HARVESTED);
        plantRepository.save(plant);
        return yield;
    }

    public void startSimulation() { simulationActive = true; }
    public void stopSimulation() { simulationActive = false; }

    public Map<String, Object> getYieldStatistics() {
        List<Plant> plants = plantRepository.findAll();

        return Map.of(
                "totalPlants", plants.size(),
                "readyForHarvest", countPlantsInStage(GrowthStage.MATURE),
                "totalYield", calculateTotalYield(plants),
                "averageHealth", calculateAverageHealth(plants)
        );
    }

    private long countPlantsInStage(GrowthStage stage) {
        return plantRepository.countByGrowthStage(stage);
    }

    private double calculateTotalYield(List<Plant> plants) {
        return plants.stream()
                .mapToDouble(Plant::getActualYield)
                .sum();
    }

    private double calculateAverageHealth(List<Plant> plants) {
        return plants.stream()
                .mapToDouble(Plant::getHealth)
                .average()
                .orElse(0.0);
    }

    public boolean isSimulationRunning() {
        return simulationActive;
    }


}