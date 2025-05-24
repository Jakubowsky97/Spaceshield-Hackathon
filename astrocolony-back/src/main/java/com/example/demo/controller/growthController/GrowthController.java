package com.example.demo.controller.growthController;

import com.example.demo.model.EnviromentAdjustmentDTO;
import com.example.demo.model.GreenhouseEnvironment;
import com.example.demo.model.Plant;
import com.example.demo.repository.PlantRepository;


import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static reactor.core.publisher.Mono.when;

import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.service.growing.GrowthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/growth")
@ExtendWith(MockitoExtension.class)
public class GrowthController {

        @Autowired
        private GrowthService growPlants;
        @Autowired
        private PlantRepository plantRepository;


        @RequestMapping("/simulateGrowth")
         private void growth(){
            Plant testPlant = new Plant();
            testPlant.setGrowthStage(0.5);
            testPlant.setHealth(0.8);

            when(plantRepository.findAll()).thenReturn(List.of(testPlant));

            growPlants.growPlants();

            assertTrue(testPlant.getGrowthStage() > 0.5);
        }

}
