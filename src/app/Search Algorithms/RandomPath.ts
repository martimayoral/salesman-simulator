import { nodes, ui } from "../app";
import { SearchAlgorithmBase } from "./SearchAlgorithmBase";



export class RandomPathAlgorithm extends SearchAlgorithmBase {

    constructor() {
        super()
        this.algorithmName = "Random Path"
    }

    async computeGeneration() {
        this.generations.push([])

        const allNodes = nodes.allNodes

        const getRandomNode = () => {
            return Math.floor(Math.random() * allNodes.length)
        }

        var node: number
        while (this.currentGeneration.length !== nodes.numNodes) {
            node = getRandomNode()
            if (!this.currentGeneration.includes(node))
                this.addPath(node)
        }
    }
}