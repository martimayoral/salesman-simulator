import { nodes, ui } from "../app";
import { SearchAlgorithmBase } from "./SearchAlgorithmBase";

export class InOrderAlgorithm extends SearchAlgorithmBase {
    constructor() {
        super()
        this.maxGens = 0
        this.algorithmName = "In Order Algorithm"
    }

    start(): void {
        this.isRunning = true
    }

    async computeGeneration() {
        this.generations.push([])

        const nodesId = nodes.allNodes
        for (let i = 0; i < nodesId.length; i++) {
            this.addPath(i)
        }
    }
}