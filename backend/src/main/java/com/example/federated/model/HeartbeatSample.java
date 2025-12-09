package com.example.federated.model;

import java.util.List;

public record HeartbeatSample(List<Double> values, double predictedRisk) { }
