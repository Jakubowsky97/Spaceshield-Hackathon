package com.example.demo.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "greenhouse")
@Data
public class GreenhouseConfig {
    private double maxRadiation = 500.0;
    private int lightHours = 16;
    private double waterCapacity = 1000.0;
}