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

    public Plant(Long id, String species, LocalDateTime plantedAt) {
        this.id = id;
        this.species = species;
        this.plantedAt = plantedAt;
    }

    public Plant() {
    }

    @PrePersist
    protected void onCreate() {
        plantedAt = LocalDateTime.now();
        lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public double getGrowthProgress() {
        return growthProgress;
    }

    public void setGrowthProgress(double growthProgress) {
        this.growthProgress = growthProgress;
    }

    public double getHealth() {
        return health;
    }

    public void setHealth(double health) {
        this.health = health;
    }

    public double getYieldPotential() {
        return yieldPotential;
    }

    public void setYieldPotential(double yieldPotential) {
        this.yieldPotential = yieldPotential;
    }

    public double getActualYield() {
        return actualYield;
    }

    public void setActualYield(double actualYield) {
        this.actualYield = actualYield;
    }

    public GrowthStage getGrowthStage() {
        return growthStage;
    }

    public void setGrowthStage(GrowthStage growthStage) {
        this.growthStage = growthStage;
    }

    public LocalDateTime getPlantedAt() {
        return plantedAt;
    }

    public void setPlantedAt(LocalDateTime plantedAt) {
        this.plantedAt = plantedAt;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}