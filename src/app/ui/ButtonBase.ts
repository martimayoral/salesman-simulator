import * as PIXI from 'pixi.js'
import { App } from '../../main'
import { ease } from 'pixi-ease'

export class ButtonBase extends PIXI.Graphics {
    onClick: () => void = () => { }
    onHoverScale: number = 1.1
    private _active: boolean = false

    constructor() {
        super()

        this.interactive = true
        this.buttonMode = true
        this.on("pointerdown", this.onPointerDown)
        this.on("pointerover", this.onPointerOver)
    }

    private onPointerDown(e: PIXI.InteractionEvent) {
        this.on("pointerup", this.onPointerUp)
        this.on("pointerupoutside", this.onPointerUpOutside)

        this._active = true
        ease.add(this, { alpha: .5 }, { duration: 100 })
    }

    private onPointerOver(e: PIXI.InteractionEvent) {
        this.on("pointerout", this.onPointerOut)
        ease.add(this, { scale: this.onHoverScale }, { duration: 100 })

        if (this._active)
            this.onPointerDown(e)
    }


    private onPointerUp(e: PIXI.InteractionEvent) {
        this.off("pointerup", this.onPointerUp)
        this.off("pointerupoutside", this.onPointerUpOutside)
        this._active = false

        ease.add(this, { alpha: 1 }, { duration: 100 })

        // console.log("Clicked!")
        this.onClick()
    }

    private onPointerUpOutside(e: PIXI.InteractionEvent) {
        this.off("pointerup", this.onPointerUp)
        this.off("pointerupoutside", this.onPointerUpOutside)
        this._active = false

    }

    private onPointerOut(e: PIXI.InteractionEvent) {
        this.off("pointerout", this.onPointerOut)
        ease.add(this, { scale: 1, alpha: 1 }, { duration: 100 })

    }


}