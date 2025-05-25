package com.example.demo.controller.dev;

import com.example.demo.service.GrowthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulation")
public class DevController {

    @Autowired
    private GrowthService growthService;

    @PostMapping("/stop")
    public String stop() {
        growthService.stopSimulation();
        return "Symulacja zatrzymana";
    }

    @PostMapping("/start")
    public String start() {
        growthService.startSimulation();
        return "Symulacja wznowiona";
    }

    @GetMapping("/status")
    public boolean status() {
        return growthService.isSimulationRunning();
    }
}