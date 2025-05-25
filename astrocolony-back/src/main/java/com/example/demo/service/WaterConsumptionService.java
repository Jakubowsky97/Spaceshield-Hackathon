package com.example.demo.service;

import org.springframework.stereotype.Service;

@Service
public class WaterConsumptionService {

    // Średnie zużycie wody w litrach na 1 m² dziennie (bez strat)
    private static final double BASE_WATER_USAGE_PER_M2 = 4.0;

    // Zakładane minimalne straty parowania w hermetycznej szklarni (%)
    private static final double EVAPORATION_LOSS_PERCENTAGE = 0.03; // 3%
    double efficiencyFactor = 0.90;
    /**
     * Oblicza dzienne zużycie wody dla szklarni, uwzględniając sprawność i straty przez parowanie.
     *
     * @param areaM2           powierzchnia szklarni w metrach kwadratowych

     * @return dzienne zużycie wody w litrach (z uwzględnieniem strat)
     */
    public double calculateDailyWaterUsage(double areaM2) {
        if (efficiencyFactor <= 0 || efficiencyFactor > 1) {
            throw new IllegalArgumentException("Sprawność musi być w zakresie 0.0 < x ≤ 1.0");
        }

        double baseUsage = areaM2 * (BASE_WATER_USAGE_PER_M2 / efficiencyFactor);
        double evaporationLoss = baseUsage * EVAPORATION_LOSS_PERCENTAGE;

        return baseUsage + evaporationLoss;
    }
}
