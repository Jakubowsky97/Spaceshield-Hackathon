package com.example.demo.controller;

import com.example.demo.model.WeatherResponse;
import com.example.demo.service.weather.MarsWeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController

public class MarsWeatherController {

    private final MarsWeatherService service;

    public MarsWeatherController(MarsWeatherService service) {
        this.service = service;
    }

    @GetMapping("/getOneSol")
    public Mono<WeatherResponse> getWeather() {
        return service.getWeather();
    }

    @GetMapping("/getAll")
    public Mono<List<WeatherResponse>> getAllSols() {
        return service.getAllSols();
    }
}