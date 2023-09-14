import * as PIXI from 'pixi.js'
import { DistanceBetweenNodes, NodeData, NodeGroup } from '../node/Nodes'
import { nodes, ui } from '../app'

export function getRouteDist(route: number[]) {
    var tourDist = 0
    for (let i = 0; i < route.length - 1; i++) {
        const node1 = nodes.getNode(route[i])
        const node2 = nodes.getNode(route[i + 1])

        tourDist += DistanceBetweenNodes(node1, node2)
    }
    tourDist += DistanceBetweenNodes(nodes.getNode(route[route.length - 1]), nodes.getNode(route[0]))

    return tourDist
}

export function drawRoute(graphic: PIXI.Graphics, route: number[], pathColor?: number) {
    if (pathColor)
        graphic.lineStyle(3, pathColor)

    const node0 = nodes.allNodes[route[0]]
    graphic.moveTo(node0.x, node0.y)

    for (let i = 1; i < route.length; i++) {
        const node = nodes.getNode(route[i])
        graphic.lineTo(node.x, node.y)
    }
    graphic.lineTo(node0.x, node0.y)
}

export class SearchAlgorithmBase extends PIXI.Graphics {
    generations: number[][]
    bestGenerations: number[][]
    bestDist: number | undefined
    _generationsRunning: number = 0
    _generationsToRun: number = 1

    maxGens: number = 10000

    get currentGeneration() {
        return this.generations[this.generations.length - 1]
    }

    constructor() {
        super()
        this.reset()
    }

    reset() {
        this.clear()
        this.bestDist = undefined
        this.generations = []
        this.bestGenerations = []
    }


    start(): void {
        console.log("start")
        this.reset()

        var gensRunnedLoop = 0
        while (this._generationsRunning < this._generationsToRun && gensRunnedLoop < this._generationsToRun) {
            this._generationsRunning++
            gensRunnedLoop++
            this.newGeneration()
        }
    }

    async computeGeneration(generationData: any = undefined) {
        // TO DO IN CHILD
        console.warn("No generation algorithm running")
    }

    newGeneration(): void {
        this.generations.push([])

        new Promise((resolve) => {
            // console.log("START PROMISE")
            this.computeGeneration()

            // console.log("this.generations", this.generations)
            // if (this.currentGeneration.length > 0)
            this.checkIfIsBestDist()

            setTimeout(() => {
                resolve('resolved');
            });
        }).then(() => {
            // console.log("THEN PROMISE")
            ui.setGenNumText(this.generations.length, this.maxGens)
            if (this.generations.length < this.maxGens) {
                this.newGeneration()
            } else {
                this._generationsRunning--
            }
        })
    }

    addPath(nodeIndex: number) {
        this.generations[this.generations.length - 1].push(nodeIndex)
    }

    checkIfIsBestDist() {
        const genDist = getRouteDist(this.generations[this.generations.length - 1])
        if (genDist >= this.bestDist) // find shortest
            // if (genDist < this.bestDist) // find longest
            // if (this.bestDist) // only run once
            return false

        console.log("genDist", genDist)

        ui.bestDistText = genDist

        this.bestDist = genDist
        this.bestGenerations.push(this.currentGeneration)
        this.drawGeneration()
        return true
    }


    drawGeneration(num: number = this.bestGenerations.length - 1) {
        this.clear()
        this.lineStyle(3, 0x0000ff)
        // console.log("draw generation")

        const generation = this.bestGenerations[num]
        if (!generation) {
            console.error("generation", num, "not found")
            return
        }

        drawRoute(this, generation)
    }
}