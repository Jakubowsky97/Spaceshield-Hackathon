package com.example.demo.controller;

import com.example.demo.client.WeatherResponse;
import com.example.demo.service.MarsWeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class MarsWeatherController {

    private final MarsWeatherService service;

    public MarsWeatherController(MarsWeatherService service) {
        this.service = service;
    }

    @GetMapping("/mars-weather")
    public Mono<WeatherResponse> getWeather() {
        return service.getWeather();
    }
}