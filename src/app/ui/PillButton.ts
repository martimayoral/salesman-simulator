import * as PIXI from 'pixi.js'
import { ButtonBase } from './ButtonBase';

export class PillButton extends ButtonBase {
    centerX: boolean = true
    centerY: boolean = true

    constructor(x?: number, y?: number, width?: number, height?: number) {
        super()
        if (x !== undefined)
            this.setDimensions(x, y, width, height)
    }

    setDimensions(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y

        if (this.centerX)
            this.pivot.x = width / 2
        else
            this.pivot.x = 0
        if (this.centerY)
            this.pivot.y = height / 2
        else
            this.pivot.y = 0


        this.clear()
            .beginFill(0xFFFFFF)
            .drawRoundedRect(0, 0, width, height, width + height)
    }
}