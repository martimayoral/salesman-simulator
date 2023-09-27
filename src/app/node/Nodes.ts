import * as PIXI from 'pixi.js'
import { NodeGraphic } from "./NodeGraphic"
import { gameApp, CHANGE_ALGORITHM_TRANSITION_DURATION, nodes } from '../../main'
import { getRandomId } from '../utils'
import Cookies from 'js-cookie'
import { ease } from 'pixi-ease'
import { GameApp } from '../app'

export interface NodeData {
    x: number,
    y: number
}

export type NodeGroup = NodeData[]

export function DistanceBetweenNodes(node1: NodeData, node2: NodeData) {
    return Math.sqrt((node2.x - node1.x) * (node2.x - node1.x) + (node2.y - node1.y) * (node2.y - node1.y))
}

function getRandomNodePosition() {
    return {
        x: gameApp.screen.width > 300 ? 200 + Math.floor(Math.random() * (gameApp.screen.width - 300)) : Math.floor(Math.random() * gameApp.screen.width),
        y: gameApp.screen.height > 200 ? 100 + Math.floor(Math.random() * (gameApp.screen.height - 200)) : Math.floor(Math.random() * gameApp.screen.height),
    }
}

const MIN_NODES = 2
const MAX_NODES = 50

export class Nodes {
    private _nodesGraphic: PIXI.Container<NodeGraphic>
    private _nodes: NodeGroup = []
    public get graphic() { return this._nodesGraphic }

    constructor() {
        this._nodesGraphic = new PIXI.Container<NodeGraphic>()

        var rawNodesPositions = Cookies.get("nodesPositions")
        // if (!rawNodesPositions) {

        // }

        if (rawNodesPositions) {
            const nodes = JSON.parse(rawNodesPositions)
            for (let i = 0; i < nodes.length; i++) {
                this.addNode(nodes[i].x, nodes[i].y, { triggerOnNodesChange: false })
            }
            this.updateNodesText()
        }
        console.log("aaa")
    }

    updateNodesText() {
        this._nodesGraphic.children.forEach(n => n.updateText())
    }

    onNodesChange() {
        console.log("nodes changed")
        gameApp.onNodesChange()
        Cookies.set("nodesPositions", JSON.stringify(this._nodes))
        this.updateNodesText()
    }

    getNode(nodeIndex: number) {
        const node = this._nodes[nodeIndex]
        if (!node) {
            console.warn("error with node", node)
            return undefined
        }
        return node
    }

    reArrangeNodes() {
        // const nodesGraphics = [...this._nodesGraphic.children]
        const nodeData = [...this._nodes]

        this._nodes = []
        this._nodesGraphic.removeChildren()

        for (let i = 0; i < nodeData.length; i++) {
            this.addNode()
        }

        this.onNodesChange()
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

    moveNodeData(index: number, x: number, y: number) {
        // console.log("moveNodeData", index)
        this._nodes[index].x = x
        this._nodes[index].y = y
        this.onNodesChange()
    }

    getNodeGraphics(): NodeGraphic[] {
        return this._nodesGraphic.children.filter(n => !n.deleted)
    }

    deleteNode(nodeIndex: number) {
        if (!this._nodes[nodeIndex])
            return
        if (this.numNodes <= MIN_NODES)
            return

        this._nodes.splice(nodeIndex, 1)

        this.getNodeGraphics()[nodeIndex].destroy()

        // const graphics = this._nodesGraphic.children.filter(graphic => graphic.id === nodeIndex)
        // if (graphics.length === 0)
        // return
        // graphics[0].destroy(true)

        this.onNodesChange()
        // this._nodes = { ...this._nodes, nodeId: undefined }
    }


    addNode(
        x: number | undefined = undefined,
        y: number | undefined = undefined,
        options: { triggerOnNodesChange: boolean } = { triggerOnNodesChange: true }
    ) {
        if (this.numNodes > MAX_NODES)
            return

        if (x === undefined || y === undefined) {
            const randomPosition = getRandomNodePosition()
            x = randomPosition.x
            y = randomPosition.y
        }

        this._nodes.push({ x, y })

        this._nodesGraphic.addChild(new NodeGraphic(x, y))
        if (options.triggerOnNodesChange)
            this.onNodesChange()
    }

    changeNodesColor(instant?: boolean) {
        this._nodesGraphic.children.forEach(n => {
            n.changeColor(instant)
        })
    }
}