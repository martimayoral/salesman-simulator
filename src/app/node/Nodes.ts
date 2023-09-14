import * as PIXI from 'pixi.js'
import { NodeGraphic } from "./NodeGraphic"
import { App } from '../../main'
import { getRandomId } from '../utils'

export interface NodeData {
    x: number,
    y: number
}

export type NodeGroup = NodeData[]

export function DistanceBetweenNodes(node1: NodeData, node2: NodeData) {
    return Math.sqrt((node2.x - node1.x) * (node2.x - node1.x) + (node2.y - node1.y) * (node2.y - node1.y))
}

export class Nodes {
    private _nodesGraphic: PIXI.Container<NodeGraphic>
    private _nodes: NodeGroup = []
    public get graphic() { return this._nodesGraphic }

    constructor() {
        this._nodesGraphic = new PIXI.Container<NodeGraphic>()
    }

    onNodesChange() {
        App.onNodesChange()
        console.log("nodes changed")
    }

    getNode(nodeIndex: number) {
        const node = this._nodes[nodeIndex]
        if (!node) {
            console.warn("error with node", node)
            return undefined
        }
        return node
    }

    computeDistances() {
        var distances: number[][] = []
        const nodes = this._nodes
        for (let i = 0; i < nodes.length; i++) {
            distances.push([])
            for (let j = 0; j < nodes.length; j++) {
                distances[i].push(DistanceBetweenNodes(nodes[i], nodes[j]))
            }
        }

        return distances
    }

    get allNodes() {
        return this._nodes
    }
    get numNodes() {
        return this._nodes.length
    }

    private getRandomNewId() {
        const randomNewId = getRandomId()
        if (this._nodes[randomNewId] !== undefined)
            return this.getRandomNewId()
        return randomNewId
    }

    moveNodeData(index: number, x: number, y: number) {
        console.log("moveNodeData", index)
        this._nodes[index].x = x
        this._nodes[index].y = y
        this.onNodesChange()
    }

    deleteNode(nodeIndex: number) {

        console.log(this._nodes)
        this._nodes.splice(nodeIndex, 1)
        console.log(this._nodes)


        this._nodesGraphic.getChildAt(nodeIndex).destroy()

        // const graphics = this._nodesGraphic.children.filter(graphic => graphic.id === nodeIndex)
        // if (graphics.length === 0)
        // return
        // graphics[0].destroy(true)

        this.onNodesChange()
        // this._nodes = { ...this._nodes, nodeId: undefined }
    }

    addNode(x: number, y: number, options: { triggerOnNodesChange: boolean } = { triggerOnNodesChange: true }) {

        this._nodes.push({ x, y })

        this._nodesGraphic.addChild(new NodeGraphic(x, y))
        if (options.triggerOnNodesChange)
            this.onNodesChange()
    }
}