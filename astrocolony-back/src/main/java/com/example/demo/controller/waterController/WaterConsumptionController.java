package com.example.demo.controller.waterController;

import com.example.demo.service.WaterConsumptionService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/water")
public class WaterConsumptionController {

    WaterConsumptionService waterConsumptionService;

    @RequestMapping("/consumption")
    public double calcWaterConsumption(@RequestBody int m2){
        return  waterConsumptionService.calculateDailyWaterUsage(m2);
    }
}
