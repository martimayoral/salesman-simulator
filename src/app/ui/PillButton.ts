import * as PIXI from 'pixi.js'
import { ButtonBase } from './ButtonBase';

export class PillButton extends ButtonBase {
    constructor(x: number, y: number, width: number, height: number) {
        super()

        this.x = x
        this.y = y

        this.pivot.x = width / 2
        this.pivot.y = height / 2

        this.beginFill(0xFFFFFF)
            .drawRoundedRect(0, 0, width, height, width + height)
    }
}