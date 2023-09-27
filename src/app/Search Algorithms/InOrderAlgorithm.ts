import { nodes } from "../../main";
import { SearchAlgorithmBase } from "./SearchAlgorithmBase";

export class InOrderAlgorithm extends SearchAlgorithmBase {
    constructor(algorithmName: string) {
        super(algorithmName)

        this.maxGens = 0
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
    
    drawBestGeneration(): void {
        this.drawGeneration()
    }
}