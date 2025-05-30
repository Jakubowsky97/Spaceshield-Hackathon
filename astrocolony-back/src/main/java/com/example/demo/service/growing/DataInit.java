package com.example.demo.service.growing;


import com.example.demo.model.Plant;
import com.example.demo.repository.PlantRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInit {

    @Bean
    CommandLineRunner initDatabase(PlantRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.saveAll(List.of(

                ));
            }
        };
    }

    public Plant createPlant(String species, double progress) {
        Plant plant = new Plant();
        plant.setSpecies(species);
        plant.setGrowthProgress(progress);
        plant.setHealth(0.9);
        plant.setGrowthStage(Plant.GrowthStage.SEEDLING);
        return plant;
    }
}