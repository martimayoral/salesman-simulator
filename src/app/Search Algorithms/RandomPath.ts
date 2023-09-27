import { nodes } from "../../main";
import { SearchAlgorithmBase } from "./SearchAlgorithmBase";



export class RandomPathAlgorithm extends SearchAlgorithmBase {

    constructor(algorithmName: string) {
        super(algorithmName)
    }

    async computeGeneration() {
        this.generations.push([])

        const allNodes = nodes.allNodes

        const getRandomNode = () => {
            return Math.floor(Math.random() * allNodes.length)
        }

        var node: number
        while (this.generations[this.generations.length - 1].length !== nodes.numNodes) {
            node = getRandomNode()
            if (!this.generations[this.generations.length - 1].includes(node))
                this.addPath(node)
        }
    }
}