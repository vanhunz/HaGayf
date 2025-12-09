package com.example.federated.service;

import com.example.federated.model.HeartbeatSample;
import com.example.federated.model.RoundMetrics;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class FedAvgService {
    private final Random random = new SecureRandom();

    public List<RoundMetrics> simulate(int clients, int rounds) {
        List<RoundMetrics> history = new ArrayList<>();
        double globalLoss = 0.7 + random.nextDouble(0.2);
        for (int r = 1; r <= rounds; r++) {
            double clientLoss = globalLoss + random.nextDouble(0.1) - 0.05;
            globalLoss = Math.max(0.05, globalLoss - random.nextDouble(0.1));
            history.add(new RoundMetrics(r, round(clientLoss), round(globalLoss)));
        }
        return history;
    }

    public HeartbeatSample sampleHeartbeats(int points) {
        List<Double> values = new ArrayList<>();
        
        // Simulate different heart conditions
        int condition = random.nextInt(5);
        double baseHR = switch(condition) {
            case 0 -> 55 + random.nextDouble(5);  // Bradycardia
            case 1 -> 105 + random.nextDouble(15); // Tachycardia
            case 2 -> 72 + random.nextDouble(10);  // Normal
            case 3 -> 68 + random.nextDouble(12);  // Normal with occasional irregularity
            default -> 80 + random.nextDouble(8);  // Normal
        };
        
        boolean hasArrhythmia = condition == 3;
        int irregularBeats = 0;
        
        for (int i = 0; i < points; i++) {
            // ECG-like waveform: P wave, QRS complex, T wave pattern
            double phase = (i % 20) / 20.0; // Each heartbeat cycle
            double ecgValue = 0;
            
            // QRS complex (sharp spike)
            if (phase > 0.3 && phase < 0.35) {
                ecgValue = baseHR + (phase - 0.3) / 0.05 * 40;
            } else if (phase >= 0.35 && phase < 0.4) {
                ecgValue = baseHR + 40 - (phase - 0.35) / 0.05 * 40;
            }
            // T wave (smaller wave)
            else if (phase > 0.5 && phase < 0.65) {
                ecgValue = baseHR + Math.sin((phase - 0.5) / 0.15 * Math.PI) * 8;
            }
            // Baseline with slight variation
            else {
                ecgValue = baseHR + random.nextGaussian() * 2;
            }
            
            // Add arrhythmia (irregular beats)
            if (hasArrhythmia && random.nextDouble() < 0.08) {
                ecgValue += random.nextGaussian() * 15;
                irregularBeats++;
            }
            
            values.add(round(ecgValue));
        }
        
        // Calculate risk based on pathology
        double riskScore = 0.0;
        if (baseHR < 60) riskScore += 0.3; // Bradycardia risk
        if (baseHR > 100) riskScore += 0.5; // Tachycardia risk
        if (irregularBeats > 2) riskScore += 0.4; // Arrhythmia risk
        
        double predicted = Math.min(1.0, riskScore);
        return new HeartbeatSample(values, round(predicted));
    }

    private double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
