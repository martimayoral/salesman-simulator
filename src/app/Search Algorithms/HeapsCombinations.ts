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

var startId = "0"


export class HeapsCombinations extends SearchAlgorithmBase {

    constructor() {
        super()
        this.start()
    }

    start(): void {
        this._generationsRunning = 0
        startId = getRandomId()

        super.start()

        this.maxGens = (factorialize(nodes.numNodes)) / 2
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

            if (i < nodes.allNodes.length && genStartId === startId)
                this.startNewGen(ids, order, i, genStartId, loop + 1)
        })
    }

    newGeneration(): void {
        console.clear()

        const order = Array(nodes.numNodes).fill(0)

        const startingId = Array(nodes.numNodes).fill(0).map((zero, i) => i)

        // this.generations.push(startingId)
        // this.checkIfIsBestDist()

        console.log(startingId)
        this.startNewGen(startingId, order, 0, startId, 0)

    }


}