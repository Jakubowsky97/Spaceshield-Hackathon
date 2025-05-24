package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class Plant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String species;
    private double growthStage; // 0.0-1.0
    private double health; // 0.0-1.0
    private LocalDateTime plantedAt;

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

    public double getGrowthStage() {
        return growthStage;
    }

    public void setGrowthStage(double growthStage) {
        this.growthStage = growthStage;
    }

    public double getHealth() {
        return health;
    }

    public void setHealth(double health) {
        this.health = health;
    }

    public LocalDateTime getPlantedAt() {
        return plantedAt;
    }

    public void setPlantedAt(LocalDateTime plantedAt) {
        this.plantedAt = plantedAt;
    }
}
