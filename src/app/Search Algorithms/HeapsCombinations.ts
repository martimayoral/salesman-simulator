import { App } from "../../main";
import { nodes, ui } from "../app";
import { getRandomId } from "../utils";
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
    finished: boolean

    constructor() {
        super()

        this.algorithmName = "Heaps Combinations"
    }

    reset(): void {
        this.maxGens = (factorialize(nodes.numNodes)) / 2
        if (this.finished)
            this.isRunning = true
        super.reset()
    }


    startNewGen(ids: number[], order: number[], i: number, genStartId: string, loop: number) {
        new Promise((resolve) => {
            var isBest = false

            if (order[i] < i) {
                if (i % 2 === 0) {
                    // Swap the first and i-th element
                    [ids[0], ids[i]] = [ids[i], ids[0]];
                } else {
                    if (ids[order[i]] !== ids[i])
                        // Swap the current element and i-th element
                        [ids[order[i]], ids[i]] = [ids[i], ids[order[i]]];
                }

                const reversed = [...ids].reverse()
                const isUnique = this.generations.every((perm) => perm.join('') !== reversed.join(''));
                if (isUnique) {
                    this.generations.push([...ids]);
                    isBest = this.checkIfIsBestDist()
                }

                // console.log("GENERATIONS", ids)
                order[i]++;
                i = 0;
            } else {
                order[i] = 0;
                i++;
            }

            if (isBest)
                setTimeout(() => {
                    resolve("")
                }, 10)
            else if (loop % 25 === 0) {
                setTimeout(() => {
                    resolve("")
                })
            }
            else
                resolve("")

        }).then(() => {
            ui.setGenNumText(this.generations.length, this.maxGens)

            if (genStartId === this._startId && this.isRunning) {
                if (i < nodes.allNodes.length)
                    this.startNewGen(ids, order, i, genStartId, loop + 1)
                else
                    this.finished = true
            }
        })
    }

    newGeneration(genStartId: string): void {
        // console.clear()

        const order = Array(nodes.numNodes).fill(0)

        const startingOrder = Array(nodes.numNodes).fill(0).map((zero, i) => i)

        // this.generations.push(startingId)
        // this.checkIfIsBestDist()

        this.finished = false

        // console.log(startingOrder)
        this.startNewGen(startingOrder, order, 0, genStartId, 0)

    }

    async computeGeneration() {
        this.generations.push([])

        const nodesId = nodes.allNodes
        for (let i = 0; i < nodesId.length; i++) {
            this.addPath(i)
        }
    }
}