package com.example.demo.client;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import com.fasterxml.jackson.databind.JsonNode;

@Component
public class WeatherApiClient {

    private final WebClient webClient;

    public WeatherApiClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("https://api.nasa.gov").build();
    }

    public Mono<WeatherResponse> getLatestWeather() {
        return webClient.get()
                .uri("/insight_weather/?api_key=MBmhP7gFl4BnlvEbubXRhk86TH0tRsT0JcagGPHP&feedtype=json&ver=1.0")
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(json -> {
                    String latestSol = json.get("sol_keys").get(0).asText();
                    JsonNode solData = json.get(latestSol);
                    String date = solData.get("First_UTC").asText();
                    double temp = solData.get("AT").get("av").asDouble();
                    double pres = solData.get("PRE").get("av").asDouble();
                    double wind = solData.get("HWS").get("av").asDouble();

                    return new WeatherResponse(latestSol, date, temp, pres, wind);
                });
    }
}
