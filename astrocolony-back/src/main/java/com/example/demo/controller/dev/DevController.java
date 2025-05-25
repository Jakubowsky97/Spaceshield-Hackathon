package com.example.demo.controller.dev;

import com.example.demo.service.growing.GrowthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dev")
public class DevController {

    @Autowired
    private GrowthService growthService;

    @PostMapping("/simulate-growth")
    public String simulateGrowth(@RequestParam int minutes) {
        for (int i = 0; i < minutes; i++) {
            growthService.growPlants();
        }
        return "Symulacja wykonana dla " + minutes + " minut";
    }
}