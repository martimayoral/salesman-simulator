import * as PIXI from 'pixi.js'
import { DistanceBetweenNodes, NodeData, NodeGroup } from '../node/Nodes'
import { algorithmGraphic } from '../app'
import { getRandomId } from '../utils'
import { nodes, ui } from '../../main'

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

export class SearchAlgorithmBase {

    private _algorithmName: string
    get algorithmName() { return this._algorithmName }

    generations: number[][]
    bestGenerations: number[][]
    bestDist: number | undefined
    _startId: string

    isRunning = false

    maxGens: number = 10000

    get currentGeneration() {
        return this.generations[this.generations.length - 1]
    }

    constructor(algorithmName: string) {
        this._algorithmName = algorithmName
        // this.reset()
    }

    reset() {
        algorithmGraphic.clear()
        this.bestDist = undefined
        this.generations = []
        this.bestGenerations = []
        this._startId = getRandomId()
        this.computeGeneration()
        // console.log("DRAW ROUTE", this.isRunning)
        this.uiSetGenNumText()

        const genDist = getRouteDist(this.generations[this.generations.length - 1])
        ui.bestDistText = genDist

        algorithmGraphic.lineStyle(3, 0xffffff)
        drawRoute(algorithmGraphic, this.generations[0])
    }

    start() {
        // console.log("start", this.algorithmName)
        this.isRunning = true
        this.newGeneration(this._startId)
    }

    stop() {
        this.isRunning = false
        // console.log("stop", this.algorithmName)
    }

    async computeGeneration(generationData: any = undefined) {
        // TO DO IN CHILD
        console.warn("No generation algorithm running")
    }

    uiSetGenNumText() {
        ui.setGenNumText(this.generations.length, this.maxGens)
    }

    newGeneration(genStartId: string): void {

        new Promise((resolve) => {
            // console.log("START PROMISE", genStartId, this._startId)
            this.computeGeneration()

            this.checkIfIsBestDist()

            setTimeout(() => {
                resolve('resolved');
            });
        }).then(() => {
            // console.log("THEN PROMISE", genStartId, this._startId)
            if (this.generations.length < this.maxGens && this._startId === genStartId && this.isRunning) {
                this.uiSetGenNumText()
                this.newGeneration(genStartId)
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

        // console.log("new best genDist", genDist)

        ui.bestDistText = genDist

        this.bestDist = genDist
        this.bestGenerations.push(this.currentGeneration)

        algorithmGraphic.clear()
        this.drawBestGeneration()
        return true
    }


    drawBestGeneration(num: number = this.bestGenerations.length - 1) {
        if (num < 0) return

        algorithmGraphic.lineStyle(3, 0xffffff)
        // console.log("draw generation")

        const generation = this.bestGenerations[num]
        if (!generation) {
            console.error("generation", num, "not found")
            return
        }

        drawRoute(algorithmGraphic, generation)
    }
}