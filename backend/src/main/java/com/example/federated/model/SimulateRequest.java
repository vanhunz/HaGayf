package com.example.federated.model;

public class SimulateRequest {
    private int clients = 5;
    private int rounds = 8;
    private int seqLen = 60;

    public int getClients() {
        return clients;
    }

    public void setClients(int clients) {
        this.clients = clients;
    }

    public int getRounds() {
        return rounds;
    }

    public void setRounds(int rounds) {
        this.rounds = rounds;
    }

    public int getSeqLen() {
        return seqLen;
    }

    public void setSeqLen(int seqLen) {
        this.seqLen = seqLen;
    }
}
