package com.example.demo.controller.powerController;

import com.example.demo.service.power.PowerOutputService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/power")
public class PowerOutputController {

    private final PowerOutputService service;

    public PowerOutputController(PowerOutputService service) {
        this.service = service;
    }

    @GetMapping("/SolarOutput")
    public Mono<Double> getOutput(@RequestParam double meters) {
        return service.calculateSolarPanelOutput(meters);
    }

    @GetMapping("/SolarEfficiency")
    public Mono<Double> getEfficiency(@RequestParam double meters) {
        return service.calculateSolarPanelEfficiency(meters);
    }
}
