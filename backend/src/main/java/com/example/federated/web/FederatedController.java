package com.example.federated.web;

import com.example.federated.model.HeartbeatSample;
import com.example.federated.model.RoundMetrics;
import com.example.federated.model.SimulateRequest;
import com.example.federated.service.FedAvgService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FederatedController {

    private final FedAvgService service;

    public FederatedController(FedAvgService service) {
        this.service = service;
    }

    @GetMapping("/status")
    public ResponseEntity<String> status() {
        return ResponseEntity.ok("Federated backend running");
    }

    @GetMapping("/heartbeat")
    public HeartbeatSample heartbeat(@RequestParam(name = "points", defaultValue = "60") int points) {
        int safePoints = Math.max(10, Math.min(points, 300));
        return service.sampleHeartbeats(safePoints);
    }

    @PostMapping("/fl/simulate")
    public List<RoundMetrics> simulate(@RequestBody(required = false) SimulateRequest req) {
        if (req == null) {
            req = new SimulateRequest();
        }
        int clients = Math.max(1, Math.min(req.getClients(), 50));
        int rounds = Math.max(1, Math.min(req.getRounds(), 50));
        return service.simulate(clients, rounds);
    }
}
