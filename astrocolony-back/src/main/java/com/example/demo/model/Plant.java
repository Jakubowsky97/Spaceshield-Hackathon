package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "plants")
public class Plant {
    public enum GrowthStage { SEEDLING, VEGETATIVE, FLOWERING, FRUITING, MATURE, HARVESTED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String species;
    private double growthProgress; // 0.0-1.0
    private double health;         // 0.0-1.0
    private double yieldPotential; // 0.0-1.0
    private double actualYield;    // kg/m²

    @Enumerated(EnumType.STRING)
    private GrowthStage growthStage;

    private LocalDateTime plantedAt;
    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        plantedAt = LocalDateTime.now();
        lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}