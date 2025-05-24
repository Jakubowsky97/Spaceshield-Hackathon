package com.example.demo.service.growing;

import com.example.demo.config.GreenhouseConfig;
import com.example.demo.model.GreenhouseEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RadiationService {
    @Autowired
    private GreenhouseEnvironment environment;

    @Autowired
    private GreenhouseConfig config;

    public double getRadiationFactor() {
        double radiation = environment.getRadiationLevel();
        return radiation > config.getMaxRadiation() ? 0.3 : 1.0;
    }


}
