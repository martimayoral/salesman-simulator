import * as PIXI from 'pixi.js'
import { DistanceBetweenNodes, NodeData, NodeGroup } from '../node/Nodes'
import { algorithmGraphic } from '../app'
import { getRandomId } from '../utils'
import { nodes, ui } from '../../main'
import { TextOption } from '../ui/Options'
import { ButtonBase } from '../ui/ButtonBase'

export type AlgorithmSpeed = "slow" | "normal" | "fast"

export function getRouteDist(route: number[]) {
    if (!route)
        return

    var tourDist = 0
    for (let i = 0; i < route.length - 1; i++) {
        const node1 = nodes.getNode(route[i])
        const node2 = nodes.getNode(route[i + 1])

        tourDist += DistanceBetweenNodes(node1, node2)
    }
    tourDist += DistanceBetweenNodes(nodes.getNode(route[route.length - 1]), nodes.getNode(route[0]))

    return tourDist
}

function drawRoute(graphic: PIXI.Graphics, route: number[], pathColor?: number) {
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

    static speed: AlgorithmSpeed

    generations: number[][]
    bestGenerations: number[]
    bestDist: number | undefined
    _startId: string
    clearOnDraw: boolean

    isRunning = false

    maxGens: number = 10000

    options: (() => ButtonBase)[]

    currentGenNum: number

    constructor(algorithmName: string) {
        this._algorithmName = algorithmName
        // this.reset()
        this.options = []
        this.clearOnDraw = true
        this.reset()
        this.drawGeneration()
    }

    reset() {
        algorithmGraphic.clear()
        this.currentGenNum = 0
        this.bestDist = undefined
        this.generations = []
        this.bestGenerations = [0]
        this._startId = getRandomId()
    }

    computeFirstGen() {
        // console.log("COMPUTUE FIRTS GEN", nodes.allNodes)
        if (nodes.allNodes?.length <= 1) return

        if (this.generations.length > 0) {
            // console.log("this.generations.length > 0", this.algorithmName)
            return
        }

        for (let i = 0; i < 1000 || this.generations.length === 0; i++) {

            if (this.generations.length === 0) {
                // console.log("computing gen", nodes.allNodes.length)
                this.computeGeneration()
            }
        }

        if (this.generations.length === 0)
            throw Error("Couldnt compute First Gen")

        this.updateBestDist()
    }

    updateBestDist() {
        if (this.generations.length === 0) this.computeFirstGen()
        // console.log("gen:", this.generations, getRouteDist(this.generations[this.generations.length - 1]))
        this.bestDist = getRouteDist(this.generations[this.bestGenerations[this.bestGenerations.length - 1]])
        ui.updateBestDist()
    }

    drawGeneration(genNum?: number, updateUI?: boolean) {
        if (this.generations.length === 0) return

        var num = this.generations.length - 1 // draw last generation
        if (genNum !== undefined && genNum < this.generations.length) // if we can draw gen num just draw gen num
            num = genNum
        else if ( // if there is best generation
            this.bestGenerations.length > 0 &&
            this.bestGenerations[this.bestGenerations.length - 1] < this.generations.length
        ) {
            num = this.bestGenerations[this.bestGenerations.length - 1]
        }

        // console.log("Draw gen", num, genNum, updateUI)

        // console.log("Drawing gen", num)
        if (this.clearOnDraw)
            algorithmGraphic.clear()
        algorithmGraphic.lineStyle(3, 0xffffff)


        this.currentGenNum = num
        drawRoute(algorithmGraphic, this.generations[num])

        if (updateUI) {
            ui.setGenNumText(num)
            ui.bestDistText = getRouteDist(this.generations[num])
        }
    }

    canDrawPrevGen() {
        return this.generations[this.currentGenNum - 1]
    }
    drawPrevGen() {
        if (!this.canDrawPrevGen()) return

        // console.log("drawPrevGen", this.currentGenNum - 1)
        this.drawGeneration(this.currentGenNum - 1, true)
    }
    canDrawNextGen() {
        return this.generations[this.currentGenNum + 1]
    }
    drawNextGen() {
        if (!this.canDrawNextGen()) return

        this.drawGeneration(this.currentGenNum + 1, true)
    }

    start() {
        // console.log("start", this.algorithmName)
        this.isRunning = true
        this.newGeneration(this._startId)
    }

    stop() {
        // console.log("stop", this.algorithmName)
        this.isRunning = false
    }

    async computeGeneration(generationData: any = undefined) {
        // TO DO IN CHILD
        console.warn("No generation algorithm running")
    }

    newGeneration(genStartId: string): void {
        ui.setGenNumText(this.generations.length)

        new Promise((resolve) => {
            // console.log("START PROMISE", genStartId, this._startId)
            this.computeGeneration()

            this.checkIfIsBestDist()

            setTimeout(() => {
                resolve('resolved');
            });
        }).then(() => {
            // console.log("THEN PROMISE", genStartId, this._startId)
            setTimeout(() => {
                if (this.conditionToContinue(genStartId)) {
                    ui.setGenNumText(this.generations.length)
                    this.newGeneration(genStartId)
                    this.currentGenNum = this.generations.length - 1
                    // console.log("set gen num", this.currentGenNum,this.generations.length - 1)
                }
            }, SearchAlgorithmBase.speed === "fast" ? 0 : SearchAlgorithmBase.speed === "normal" ? 50 : 1000);
        })
    }

    conditionToContinue(genStartId: string) {
        // console.log("conditionToContinue", this.generations.length <= this.maxGens, this._startId === genStartId, this.isRunning)
        return this.generations.length <= this.maxGens && this._startId === genStartId && this.isRunning
    }

    addPath(nodeIndex: number) {
        this.generations[this.generations.length - 1].push(nodeIndex)
    }

    checkIfIsBestDist() {
        const genNum = this.generations.length - 1
        const genDist = getRouteDist(this.generations[genNum])
        if (genDist >= this.bestDist) // find shortest
            // if (genDist < this.bestDist) // find longest
            // if (this.bestDist) // only run once
            return false

        // console.log("new best genDist", genDist)
        ui.updateBestDist()

        this.bestDist = genDist
        this.bestGenerations.push(genNum)

        this.drawGeneration(genNum)
        return true
    }

    drawBestGeneration() {
        // console.log("drawbestGen")
        const lastBestNum = this.bestGenerations[this.bestGenerations.length - 1]
        this.drawGeneration(lastBestNum)
    }
}