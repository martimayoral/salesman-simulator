import { nodes } from "../app";
import { SearchAlgorithmBase } from "./SearchAlgorithmBase";

export class InOrderAlgorithm extends SearchAlgorithmBase {
    constructor() {
        super()
        this.start()
    }

    async computeGeneration() {
        const nodesId = nodes.allNodes
        for (let i = 0; i < nodesId.length; i++) {
            this.addPath(i)
        }
    }
}