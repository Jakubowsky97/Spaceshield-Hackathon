package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;

import java.util.*;

@Data
public class MarsWeatherData {

    @JsonProperty("sol_keys")
    private List<String> solKeys;

    @JsonProperty("validity_checks")
    private Map<String, Object> validityChecks; // pomijamy walidację

    private Map<String, SolData> sols = new HashMap<>();

    @JsonAnySetter
    public void setDynamicSol(String key, Object value) {
        if (solKeys != null && solKeys.contains(key)) {
            SolData sol = new ObjectMapper().convertValue(value, SolData.class);
            sols.put(key, sol);
        }
    }

    @Data
    public static class SolData {
        public SensorData atmospheric_temperature;
        public SensorData horizontal_wind_speed;
        public SensorData pressure_data;
        public WindData wind_data;

        @JsonProperty("First_UTC")
        public String firstUTC;

        @JsonProperty("Last_UTC")
        public String lastUTC;

        public String Season;
    }

    @Data
    public static class SensorData {
        public Double av;
        public Double ct;
        public Double mn;
        public Double mx;
    }

    @Data
    public static class WindData {
        @JsonProperty("most_common")
        public WindDirection mostCommon;

        public Map<String, WindDirection> directions = new HashMap<>();

        @JsonAnySetter
        public void setAny(String key, WindDirection value) {
            if (!"most_common".equals(key)) {
                directions.put(key, value);
            }
        }
    }

    @Data
    public static class WindDirection {
        @JsonProperty("compass_degrees")
        public Double compassDegrees;

        @JsonProperty("compass_point")
        public String compassPoint;

        @JsonProperty("compass_right")
        public Double compassRight;

        @JsonProperty("compass_up")
        public Double compassUp;

        public Integer ct;
    }
}
