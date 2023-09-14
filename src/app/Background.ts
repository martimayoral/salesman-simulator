import * as PIXI from 'pixi.js'
import { nodes } from './app'

const MS_TO_CREATE_NODE = 200
let clickData: { time: number, x: number, y: number } = { time: 0, x: 0, y: 0 }

function onPointerDown(this: Background, e: PIXI.InteractionEvent) {
    // console.log(e.data)
    clickData = { time: Date.now(), x: e.data.global.x, y: e.data.global.y }
}
function onPointerUp(this: Background, e: PIXI.InteractionEvent) {
    // console.log(e.data)
    if (clickData.time + MS_TO_CREATE_NODE < Date.now()
        && clickData.x === e.data.global.x
        && clickData.y === e.data.global.y)
        nodes.addNode(e.data.global.x, e.data.global.y)
}


export class Background extends PIXI.Graphics {

    constructor() {
        super()

        this.beginFill(0x232334)
            .drawRect(0, 0, window.innerWidth, window.innerHeight)
            .endFill()

        this.interactive = true
        this.on("pointerdown", onPointerDown)
        this.on("pointerup", onPointerUp)
    }
}
