
package com.example.demo.service.growing;

import com.example.demo.model.Plant;
import com.example.demo.repository.PlantRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInit {

    @Bean
    public CommandLineRunner initData(PlantRepository plantRepository) {
        return args -> {
            if (plantRepository.count() == 0) {
                Plant plant1 = new Plant();
                plant1.setSpecies("Mars Potato");
                plant1.setGrowthStage(0.4);
                plant1.setHealth(0.9);
                plant1.setPlantedAt(LocalDateTime.now());

                Plant plant2 = new Plant();
                plant2.setSpecies("Red Martian Tomato");
                plant2.setGrowthStage(0.7);
                plant2.setHealth(0.6);
                plant2.setPlantedAt(LocalDateTime.now().minusDays(3));

                plantRepository.saveAll(List.of(plant1, plant2));
            }
        };
    }
}