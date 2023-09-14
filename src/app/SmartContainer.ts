import * as PIXI from 'pixi.js'

export class SmartContainer extends PIXI.Container {
    aspectRatio: number
    margin: number
    canvasWidth: number
    canvasHeight: number

    constructor({
        aspectRatio = 1,
        margin = 0,
        canvasWidth = 1000,
        canvasHeight
    }: {
        aspectRatio?: number,
        margin?: number,
        canvasWidth?: number,
        canvasHeight?: number
    } = {}) {
        super()
        this.aspectRatio = aspectRatio
        this.margin = margin
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight ? canvasHeight : canvasWidth * aspectRatio
        this.resize()
    }

    resize(width: number = window.innerWidth, height: number = window.innerHeight) {

        var w: number
        var h: number

        const horizontal = height < width * this.aspectRatio
        // console.log(width, height, width * aspectRatio, height * aspectRatio, condition)
        if (horizontal) {
            w = height / this.aspectRatio - this.margin
            h = height - this.margin
        } else {
            w = width - this.margin
            h = width * this.aspectRatio - this.margin
        }

        this.scale.set(w / this.canvasWidth, h / this.canvasHeight)


        this.position.x = width / 2 - w / 2
        this.position.y = height / 2 - h / 2
    }

}