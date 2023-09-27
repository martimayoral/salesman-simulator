import * as PIXI from 'pixi.js'
import { PillButton } from "./PillButton"
import { GameApp } from '../app'

export class GraphicButton extends PillButton {
    sprite: PIXI.Sprite | PIXI.Graphics
    _selected: boolean

    constructor(x: number, y: number, width: number, height: number,
        child: PIXI.Sprite | PIXI.Graphics, spriteX: number, spriteY: number,
        spriteWidth: number, spriteHeight: number, spriteAngle: number
    ) {
        super(x, y, width, height)

        this.sprite = this.addChild(child)
        this.sprite.width = spriteWidth
        this.sprite.height = spriteHeight
        this.sprite.angle = spriteAngle
        this.sprite.y = spriteY
        this.sprite.x = spriteX
        this.alpha = 0
    }

    set selected(selected: boolean) {
        this._selected = selected
        this.changeTheme()
    }

    changeTheme() {
        if (this._selected) {
            this.tint = GameApp.theme?.mainColor
            this.sprite.tint = GameApp.theme?.bgColor
        } else {
            this.tint = GameApp.theme?.secondaryColor
            this.sprite.tint = GameApp.theme?.bgColor
        }
    }
}