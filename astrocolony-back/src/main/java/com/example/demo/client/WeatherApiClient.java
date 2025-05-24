package com.example.demo.client;

import com.example.demo.model.WeatherResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.ArrayList;
import java.util.List;

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
                    double tempavg = solData.get("AT").get("av").asDouble();
                    double tempmin = solData.get("AT").get("mn").asDouble();
                    double tempmax = solData.get("AT").get("mx").asDouble();
                    double presavg = solData.get("PRE").get("av").asDouble();
                    double presmin = solData.get("PRE").get("mn").asDouble();
                    double presmax = solData.get("PRE").get("mx").asDouble();
                    double windspeedavg = solData.get("HWS").get("av").asDouble();
                    double windspeedmin = solData.get("HWS").get("mn").asDouble();
                    double windspeedmax = solData.get("HWS").get("mx").asDouble();
                    double winddir = solData.get("WD").get("most_common").get("compass_point").asDouble();

                    return new WeatherResponse(latestSol, date, tempavg, tempmin, tempmax,
                            presavg, presmin, presmax, windspeedavg, windspeedmin, windspeedmax, winddir);
                });
    }

    public Mono<List<WeatherResponse>> getAllSolsWeather() {
        return webClient.get()
                .uri("/insight_weather/?api_key=MBmhP7gFl4BnlvEbubXRhk86TH0tRsT0JcagGPHP&feedtype=json&ver=1.0")
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(json -> {
                    List<WeatherResponse> responses = new ArrayList<>();
                    JsonNode solKeys = json.get("sol_keys");

                    for (JsonNode solNode : solKeys) {
                        String sol = solNode.asText();
                        JsonNode solData = json.get(sol);

                        String date = solData.get("First_UTC").asText();

                        double tempavg = solData.get("AT").get("av").asDouble();
                        double tempmin = solData.get("AT").get("mn").asDouble();
                        double tempmax = solData.get("AT").get("mx").asDouble();

                        double presavg = solData.get("PRE").get("av").asDouble();
                        double presmin = solData.get("PRE").get("mn").asDouble();
                        double presmax = solData.get("PRE").get("mx").asDouble();

                        double windspeedavg = solData.get("HWS").get("av").asDouble();
                        double windspeedmin = solData.get("HWS").get("mn").asDouble();
                        double windspeedmax = solData.get("HWS").get("mx").asDouble();

                        // Niektóre dane w WD mogą nie istnieć, więc obsłuż to bez wyjątku
                        double winddir = Double.NaN;
                        if (solData.has("WD") && solData.get("WD").has("most_common")) {
                            JsonNode mostCommon = solData.get("WD").get("most_common");
                            if (mostCommon.has("compass_degrees")) {
                                winddir = mostCommon.get("compass_degrees").asDouble();
                            }
                        }

                        WeatherResponse response = new WeatherResponse(sol, date, tempavg, tempmin, tempmax,
                                presavg, presmin, presmax, windspeedavg, windspeedmin, windspeedmax, winddir);

                        responses.add(response);
                    }

                    return responses;
                });
    }
}
