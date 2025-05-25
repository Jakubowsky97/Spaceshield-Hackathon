package com.example.demo.controller.powerController;

import com.example.demo.service.power.PowerUsage;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/power")
public class PowerConsumption {


    @RequestMapping("/calcPowerConsumption")
    public double powerConsumption(@RequestParam double m2){
       return PowerUsage.calculateMarsGreenhouseNightEnergy(m2);
    }


}
