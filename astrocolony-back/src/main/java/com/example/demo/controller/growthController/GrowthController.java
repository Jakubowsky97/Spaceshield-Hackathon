package com.example.demo.controller.growthController;

import com.example.demo.service.growing.GrowthService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/growth")
public class GrowthController {

    private final GrowthService growPlants;

    public GrowthController(GrowthService growPlants) {
        this.growPlants = growPlants;
    }

    @RequestMapping("/simulateGrowth")
    public String simulateGrowth() {
        growPlants.growPlants(); // Zaktualizuje wszystkie rośliny w bazie
        return "Growth simulation complete.";
    }
}
