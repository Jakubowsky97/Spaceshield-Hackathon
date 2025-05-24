package com.example.demo.service.weather;
import com.example.demo.client.WeatherApiClient;
import com.example.demo.model.WeatherResponse;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class MarsWeatherService {

        private final WeatherApiClient client;

        public MarsWeatherService(WeatherApiClient client) {
            this.client = client;
        }

        public Mono<WeatherResponse> getWeather() {
            return client.getLatestWeather();
        }

        public Mono<List<WeatherResponse>> getAllSols() {
            return client.getAllSolsWeather();
        }

}
