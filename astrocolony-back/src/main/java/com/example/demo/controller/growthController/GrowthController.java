package com.example.demo.controller.growthController;

import com.example.demo.model.Plant;
import com.example.demo.service.growing.GrowthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plants")
public class GrowthController {
    private final GrowthService growthService;

    public GrowthController(GrowthService growthService) {
        this.growthService = growthService;
    }

    @GetMapping
    public ResponseEntity<List<Plant>> getAllPlants() {
        return ResponseEntity.ok(growthService.getAllPlants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plant> getPlantById(@PathVariable Long id) {
        return ResponseEntity.ok(growthService.getPlantById(id));
    }

    @PostMapping("/{id}/harvest")
    public ResponseEntity<?> harvestPlant(@PathVariable Long id) {
        try {
            double yield = growthService.harvestPlant(id);
            return ResponseEntity.ok(Map.of(
                    "yield", yield,
                    "message", "Pomyślnie zebrano plony"
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Nie można zebrać plonów",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        return ResponseEntity.ok(growthService.getYieldStatistics());
    }

    @PostMapping("/simulation/start")
    public ResponseEntity<String> startSimulation() {
        growthService.startSimulation();
        return ResponseEntity.ok("Symulacja rozpoczęta");
    }

    @PostMapping("/simulation/stop")
    public ResponseEntity<String> stopSimulation() {
        growthService.stopSimulation();
        return ResponseEntity.ok("Symulacja zatrzymana");
    }

    @GetMapping("/simulation/status")
    public ResponseEntity<Map<String, Boolean>> getSimulationStatus() {
        return ResponseEntity.ok(Map.of(
                "active", growthService.isSimulationActive()
        ));
    }

    @GetMapping("/simulation/setInterval")
    public void changeInterval(@RequestParam int speed) {
        growthService.setCurrentInterval(speed);
    }


    @GetMapping("/simulation/getInterval")
    public long getInterval() {
      return  growthService.getCurrentInterval();
    }
}