import * as PIXI from 'pixi.js'
import { App, CHANGE_ALGORITHM_TRANSITION_DURATION, nodes } from '../main'
import { ease } from 'pixi-ease'
import { appBgColor } from './app'

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

export type BgChangeDirection = "right" | "left" | "instant"
const spaceBetweenBg = 150

export class Background extends PIXI.Container {
    mainBg: PIXI.Graphics
    transitionBg: PIXI.Graphics

    constructor() {
        super()

        this.addChild(this.transitionBg = new PIXI.Graphics)
        this.addChild(this.mainBg = new PIXI.Graphics)

        this.interactive = true
        this.on("pointerdown", onPointerDown)
        this.on("pointerup", onPointerUp)
    }

    resize() {
        setTimeout(() => {
            this.mainBg.clear()
                .beginFill(0xffffff)
                .drawRoundedRect(0, 0, App.screen.width, App.screen.height, 50)
                .endFill()
            this.transitionBg.clear()
                .beginFill(0xffffff)
                .drawRoundedRect(0, 0, App.screen.width, App.screen.height, 50)
                .endFill()

            // this.mainBg.tint = 0x232334
        })
    }

    changeBg(color: number, direction: BgChangeDirection = "instant") {
        if (direction === "instant") {
            this.mainBg.tint = color
            this.transitionBg.tint = color
            return
        }
        // console.log("going from", this.transitionBg.tint.toString(16), "to", color.toString(16), this.mainBg.x)
        this.mainBg.tint = this.transitionBg.tint
        this.transitionBg.tint = color

        const invert = direction === "left" ? 1 : -1

        const moveMain = ease.add(this.mainBg, { x: (App.screen.width + spaceBetweenBg) * invert }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION })
        this.transitionBg.x = -(App.screen.width + spaceBetweenBg) * invert
        ease.add(this.transitionBg, { x: 0 }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION })
        moveMain.once("complete", () => {
            this.mainBg.x = 0
            this.mainBg.tint = color
        });
    }
}
