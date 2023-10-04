import * as PIXI from 'pixi.js'
import { AlgorithmNode } from "./AlgorithmNode"
import { gameApp, CHANGE_ALGORITHM_TRANSITION_DURATION, nodes, ui } from '../../main'
import { getRandomId } from '../utils'
import Cookies from 'js-cookie'
import { ease } from 'pixi-ease'
import { GameApp, algorithmGraphic } from '../app'
import { NodesButtons, RemoveNodeButton } from '../ui/NodesButtons'

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

let clickData: { time: number, x: number, y: number } = { time: 0, x: 0, y: 0 }
const MS_TO_DELETE_NODE = 200

function onDragEnd(e: PIXI.InteractionEvent) {
    if (nodes.draggingNode) {
        gameApp.stage.off('pointermove', onDragMove);
        gameApp.stage.off('pointerup', onDragEnd)
        gameApp.stage.off('pointerupoutside', onDragEnd)

        const index = nodes.draggingNode.index


        if (clickData.x === nodes.draggingNode.x
            && clickData.y === nodes.draggingNode.y) {

            if (clickData.time + MS_TO_DELETE_NODE < Date.now() && !(e.target instanceof RemoveNodeButton))
                nodes.deleteNode(index)
        } else {

            if (e.target instanceof RemoveNodeButton) {
                ui.nodesButtons.onNodeOut()
                nodes.deleteNode(index)
                nodes.draggingNode = null;
                return
            }

            if (!(e.target instanceof AlgorithmNode)) {

                const randomPosition = getRandomNodePosition()
                nodes.draggingNode.parent.toLocal(randomPosition, null, nodes.draggingNode.position)
                nodes.moveNodeData(nodes.draggingNode.index, nodes.draggingNode.x, nodes.draggingNode.y)
            }

        }

        nodes.draggingNode = null;
    }
}
function onDragMove(event: PIXI.InteractionEvent) {
    if (nodes.draggingNode) {

        if (event.target instanceof RemoveNodeButton) {
            ui.nodesButtons.onNodeOnTop();
        } else
            ui.nodesButtons.onNodeOut()

        nodes.draggingNode.parent.toLocal(event.data.global, null, nodes.draggingNode.position)
        nodes.moveNodeData(nodes.draggingNode.index, nodes.draggingNode.x, nodes.draggingNode.y)
    }
}

const MIN_NODES = 2
const MAX_NODES = 50

export class Nodes {
    private _nodesGraphic: PIXI.Container<AlgorithmNode>
    private _nodes: NodeGroup = []
    public get graphic() { return this._nodesGraphic }
    draggingNode: AlgorithmNode = null;

    constructor() {
        this._nodesGraphic = new PIXI.Container<AlgorithmNode>()

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
    }

    startDraggingNode(node: AlgorithmNode) {
        this.draggingNode = node

        clickData = { time: Date.now(), x: node.position.x, y: node.position.y }

        gameApp.stage.on('pointermove', onDragMove)
        gameApp.stage.on('pointerup', onDragEnd)
        gameApp.stage.on('pointerupoutside', onDragEnd)
    }

    updateNodesText() {
        this._nodesGraphic.children.forEach(n => n.updateText())
    }

    onNodesChange() {
        // console.log("nodes changed")
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
        // console.log("nodeData:", nodeData)

        this._nodes = []
        this._nodesGraphic.removeChildren()

        for (let i = 0; i < nodeData.length; i++) {
            this.addNode()
        }
        // console.log("nodessData:", this._nodes)

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

    getNodeGraphics(): AlgorithmNode[] {
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

        const algorithmNode = this._nodesGraphic.addChild(new AlgorithmNode(x, y))
        if (options.triggerOnNodesChange)
            this.onNodesChange()

        return algorithmNode
    }

    changeNodesColor(instant?: boolean) {
        this._nodesGraphic.children.forEach(n => {
            n.changeColor(instant)
        })
    }
}