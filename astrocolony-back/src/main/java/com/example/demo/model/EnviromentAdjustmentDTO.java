package com.example.demo.model;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;


@Data
public class EnviromentAdjustmentDTO {
    @Min(0)
    @Max(50)
    private double temperature;

    @Min(300)
    @Max(2000)
    private double co2Level;

    @Min(0)
    @Max(100000)
    private double lightIntensity;

    @DecimalMin("0.0")
    @DecimalMax("1.0")
    private double nutrientLevel;
}