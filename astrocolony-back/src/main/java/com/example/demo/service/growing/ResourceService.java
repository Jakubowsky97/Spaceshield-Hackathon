package com.example.demo.service.growing;

import com.example.demo.config.GreenhouseConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ResourceService {
    @Autowired
    private GreenhouseConfig config;

    private double waterLevel = 1000.0;

    @Scheduled(fixedRate = 300000)
    public void manageResources() {
        double consumption = calculateWaterConsumption();
        waterLevel -= consumption;

        if(waterLevel < config.getWaterCapacity() * 0.2) {
            recycleWater();
        }
    }

    private double calculateWaterConsumption() {
        return 10.0; // Stałe zużycie dla uproszczenia
    }

    private void recycleWater() {
        waterLevel += 500.0;
    }
}
