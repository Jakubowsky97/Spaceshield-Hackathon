package com.example.demo.service;
import com.example.demo.client.WeatherApiClient;
import com.example.demo.client.WeatherResponse;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class MarsWeatherService {

        private final WeatherApiClient client;

        public MarsWeatherService(WeatherApiClient client) {
            this.client = client;
        }

        public Mono<WeatherResponse> getWeather() {
            return client.getLatestWeather();
        }

}
