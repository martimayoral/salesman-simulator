import { nodes } from "../../main";
import { SearchAlgorithmBase } from "./SearchAlgorithmBase";


function factorialize(num) {
    // Si el número es menor que 0, rechacelo. 
    if (num < 0)
        return -1;

    // Si el número es 0, su factorial es 1.
    else if (num == 0)
        return 1;

    // De otra forma, llama al procedimiento de nuevo
    else {
        return (num * factorialize(num - 1));
    }
}

export class HeapsCombinations extends SearchAlgorithmBase {
    ids: number[]
    order: number[]
    i: number
    genStartId: string
    loop: number
    finished: boolean

    constructor(algorithmName: string) {
        super(algorithmName)
    }

    reset(): void {
        this.maxGens = (factorialize(nodes.numNodes)) / 2
        if (this.finished && this.isRunning)
            this.isRunning = true

        this.order = Array(nodes.numNodes).fill(0)
        this.ids = Array(nodes.numNodes).fill(0).map((zero, i) => i)
        this.i = 0
        this.loop = 0
        this.finished = false

        super.reset()

    }

    start(): void {
        if (this.finished) {
            this.reset()
            this.computeFirstGen()
        }
        super.start()
    }

    async computeGeneration() {
        // var isBest = false
        // console.log("computeGeneration", this.generations)

        if (this.order[this.i] < this.i) {
            if (this.i % 2 === 0) {
                // Swap the first and i-th element
                [this.ids[0], this.ids[this.i]] = [this.ids[this.i], this.ids[0]];
            } else {
                if (this.ids[this.order[this.i]] !== this.ids[this.i])
                    // Swap the current element and i-th element
                    [this.ids[this.order[this.i]], this.ids[this.i]] = [this.ids[this.i], this.ids[this.order[this.i]]];
            }

            const reversed = [...this.ids].reverse()
            const isUnique = this.generations.every((perm) => perm.join('') !== reversed.join(''));
            if (isUnique) {
                this.generations.push([...this.ids])
                // isBest = this.checkIfIsBestDist()
            }

            // console.log("GENERATIONS", this.ids)
            this.order[this.i]++;
            this.i = 0;
        } else {
            this.order[this.i] = 0;
            this.i++;
        }
    }

    conditionToContinue(genStartId: string): boolean {
        if (super.conditionToContinue(genStartId)) {
            if (this.i < nodes.allNodes.length)
                return true

            this.finished = true
            return false
        }
    }
}