import { nodes, ui } from "../../main";
import { algorithmGraphic } from "../app";
import { NodeData } from "../node/Nodes";
import { PillButton } from "../ui/PillButton";
import { SearchAlgorithmBase, drawRoute, getRouteDist } from "./SearchAlgorithmBase";

var attractivenesses: number[][]
const dstPower = 4
const pheromonePower = 1
const numAnts = 10
const evaporationRate = 0.2
const pheromoneIntensity = 10

var pheromones: number[][]

const initialPheromoneIntensity = 1

function initPheromones() {
    pheromones = new Array(nodes.numNodes).fill(0).map(() => new Array(nodes.numNodes).fill(initialPheromoneIntensity))
}

function updatePheromoneTrail(routesAndDistances: { route: number[], distance: number }[]) {
    // console.log("update pheromone trail")

    const bestDistance = routesAndDistances[0].distance

    const routesUsed: boolean[][] = new Array(nodes.numNodes).fill(0).map(() => new Array(nodes.numNodes).fill(false))

    // evaporate old pheromone
    for (let phi = 0; phi < pheromones.length; phi++) {
        for (let phj = 0; phj < pheromones[phi].length; phj++) {
            pheromones[phi][phj] = pheromones[phi][phj] * (1 - evaporationRate)
        }
    }

    for (let ii = 0; ii < routesAndDistances.length; ii++) {
        const routeScore = routesAndDistances[ii].distance / bestDistance
        const route = routesAndDistances[ii].route


        // reset routes used
        for (let rui = 0; rui < routesUsed.length; rui++) {
            for (let ruj = 0; ruj < routesUsed[rui].length; ruj++) {
                // console.log("route used", routesUsed)
                routesUsed[rui][ruj] = false
            }
        }

        // set routes used
        for (let j = 0; j < route.length; j++) {
            const nextNode = j + 1 === route.length ? 0 : j + 1
            routesUsed[route[j]][route[nextNode]] = true
        }
        // console.log("RESET ROUTES USED END", route[0], route[1], JSON.stringify(routesUsed))

        for (let phi = 0; phi < pheromones.length; phi++) {
            for (let phj = 0; phj < pheromones[phi].length; phj++) {
                if (routesUsed[phi][phj])
                    pheromones[phi][phj] = pheromones[phi][phj] + pheromoneIntensity / routeScore
                // pheromones[j][nextNode] = pheromones[j][nextNode] * routeScore * (1 - evaporationRate)
            }
        }

    }
}

class Ant {
    path: number[]

    constructor() {

    }

    computeRoute(startingNode: number) {
        this.path = [startingNode]

        var node: number
        while (this.path.length !== nodes.numNodes) {
            const nextGen = this.getNextNode()
            node = nextGen.index
            // console.log("this.path.push", node)
            this.path.push(node)
        }

        // console.log("MY PATH:", this.path)
        return this.path
    }

    getPossibleNodes(): number[] {
        return Array(nodes.numNodes).fill(0).map((n, i) => i).filter(n => !this.path.includes(n))
    }

    getNextNode() {
        const possibleNodes = this.getPossibleNodes()
        if (possibleNodes.length === 0)
            throw new Error("No more possible nodes to getNextNode")


        const fromNode = this.path[this.path.length - 1]
        // console.log("possibleNodes", possibleNodes, "from", fromNode)


        var desirabilities: { index: number, desirability: number }[] = []
        var totalDesirability = 0
        for (let i = 0; i < possibleNodes.length; i++) {
            const potentialNodeIndex = possibleNodes[i]

            const attractiveness = attractivenesses[fromNode][potentialNodeIndex]
            const pheromoneStrenght = pheromones[fromNode][potentialNodeIndex]

            var desirability = Math.pow(attractiveness, dstPower) * Math.pow(pheromoneStrenght, pheromonePower)


            totalDesirability += desirability
            desirabilities.push({ index: potentialNodeIndex, desirability })

            // console.log("desirability", dst, desirability)
        }

        // normalize
        var desirability: number
        desirabilities = desirabilities.map((d) => {
            desirability = d.desirability / totalDesirability
            if (isNaN(desirability)) {
                // console.log("is nan", d.desirability, totalDesirability)
                desirability = 0
            }
            return { index: d.index, desirability: desirability }
        })
        // console.log(desirabilities.reduce((pr, cr) => pr += cr.desirability, 0))
        // console.assert(desirabilities.reduce((pr, cr) => pr += cr.desirability, 0) > 0.99)

        // sort
        desirabilities.sort((a, b) => b.desirability - a.desirability)

        // choose path
        const random01 = Math.random()
        var currentDesirability = 0
        for (let i = 0; i < desirabilities.length; i++) {
            currentDesirability += desirabilities[i].desirability
            if (currentDesirability >= random01) {
                return desirabilities[i]
            }
        }
        return desirabilities[0]
    }
}

export class AntColonyAlgorithm extends SearchAlgorithmBase {
    ants: Ant[]
    _drawPheromones: boolean = true

    constructor(algorithmName: string) {
        super(algorithmName)
        this.maxGens = 9999

        const btn = ui.addChild(new PillButton(100, 600, 40, 40))
        btn.onClick = () => this.showPheromones = !this._drawPheromones
    }

    reset(): void {
        initPheromones()

        attractivenesses = nodes.computeDistances().map(arr => arr.map(dst => 1 / dst))
        this.ants = new Array(numAnts).fill(new Ant())
        super.reset()
    }

    async computeGeneration() {
        // this.clear()

        let routesAndDistances: { route: number[], distance: number }[] = []

        for (let i = 0; i < this.ants.length; i++) {
            const route = this.ants[i].computeRoute(Math.floor(Math.random() * nodes.numNodes))
            routesAndDistances.push({ route, distance: getRouteDist(route) })
        }

        routesAndDistances.sort((a, b) => a.distance - b.distance)

        // drawRoute(this, routesAndDistances[3].route, 0x001111)
        // drawRoute(this, routesAndDistances[2].route, 0x002222)
        // drawRoute(this, routesAndDistances[1].route, 0x004444)
        // drawRoute(this, routesAndDistances[0].route, 0x00ffff)

        updatePheromoneTrail(routesAndDistances)
        // console.log("add path", routesAndDistances[0].route)

        this.generations.pop() // pop the [] from parent - TODO REMOVE
        this.generations.push(routesAndDistances[0].route)

        if (this._drawPheromones)
            this.drawPheromone()

        this.drawBestGeneration()
    }

    set showPheromones(d: boolean) {
        this._drawPheromones = d
        if (d)
            this.drawPheromone()
        else {
            algorithmGraphic.clear()
            this.drawBestGeneration()
        }

    }

    drawPheromone() {
        algorithmGraphic.clear()

        // console.log("draw Pheromones")
        var initialNode: NodeData
        var finalNode: NodeData
        var maxPheromone = 0
        for (let i = 0; i < pheromones.length; i++) {
            for (let j = 0; j < pheromones[i].length; j++) {
                maxPheromone = Math.max(pheromones[i][j], maxPheromone)
            }
        }
        for (let i = 0; i < pheromones.length; i++) {
            for (let j = 0; j < pheromones[i].length; j++) {
                algorithmGraphic.lineStyle(3, 0xffffff, pheromones[i][j] / maxPheromone)

                initialNode = nodes.getNode(i)
                finalNode = nodes.getNode(j)


                algorithmGraphic.moveTo(initialNode.x, initialNode.y)
                algorithmGraphic.lineTo(finalNode.x, finalNode.y)
            }
        }
    }

    // drawGeneration(num?: number): void {
    // }
}