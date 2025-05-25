// PlantRepository.java
package com.example.demo.repository;

import com.example.demo.model.Plant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlantRepository extends JpaRepository<Plant, Long> {
    @Override
    List<Plant> findAll();

    long countByGrowthStage(Plant.GrowthStage stage);
}