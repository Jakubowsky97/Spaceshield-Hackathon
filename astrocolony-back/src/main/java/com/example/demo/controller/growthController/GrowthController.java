package com.example.demo.controller.growthController;

import com.example.demo.model.Plant;
import com.example.demo.service.growing.GrowthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plants")
public class GrowthController {

    private final GrowthService plantService;

    @Autowired
    public GrowthController(GrowthService plantService) {
        this.plantService = plantService;
    }

    @GetMapping("/getAll")
    public List<Plant> getAllPlants() {
        return plantService.getAllPlants();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plant> getPlantById(@PathVariable Long id) {
        return ResponseEntity.ok(plantService.getPlantById(id));
    }

    @GetMapping("/health-status")
    public String getHealthStatus() {
        return plantService.getPlantsHealthStatus();
    }
}