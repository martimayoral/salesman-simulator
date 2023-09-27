import * as PIXI from 'pixi.js'
import { gameApp } from '../../main'
import { ease } from 'pixi-ease'

export class ButtonBase extends PIXI.Graphics {
    onClick: () => void = () => { }
    onHoverScale: number = 1.1
    onClickAlpha: number = .5
    private _active: boolean = false

    onPointerDown: undefined | ((e: PIXI.InteractionEvent) => void)
    onPointerOver: undefined | ((e: PIXI.InteractionEvent) => void)
    onPointerUp: undefined | ((e: PIXI.InteractionEvent) => void)
    onPointerUpOutside: undefined | ((e: PIXI.InteractionEvent) => void)
    onPointerOut: undefined | ((e: PIXI.InteractionEvent) => void)



    constructor() {
        super()

        this.interactive = true
        this.buttonMode = true
        this.on("pointerdown", this._onPointerDown)
        this.on("pointerover", this._onPointerOver)
    }

    private _onPointerDown(e: PIXI.InteractionEvent) {
        this.on("pointerup", this._onPointerUp)
        this.on("pointerupoutside", this._onPointerUpOutside)

        this._active = true
        ease.add(this, { alpha: this.onClickAlpha }, { duration: 100 })

        if (this.onPointerDown)
            this.onPointerDown(e)
    }

    private _onPointerOver(e: PIXI.InteractionEvent) {
        this.on("pointerout", this._onPointerOut)
        ease.add(this, { scale: this.onHoverScale }, { duration: 100 })

        if (this._active)
            this._onPointerDown(e)

        if (this.onPointerOver)
            this.onPointerOver(e)
    }


    private _onPointerUp(e: PIXI.InteractionEvent) {
        this.off("pointerup", this._onPointerUp)
        this.off("pointerupoutside", this._onPointerUpOutside)
        this._active = false

        ease.add(this, { alpha: 1 }, { duration: 100 })

        // console.log("Clicked!")
        this.onClick()

        if (this.onPointerUp)
            this.onPointerUp(e)
    }

    private _onPointerUpOutside(e: PIXI.InteractionEvent) {
        this.off("pointerup", this._onPointerUp)
        this.off("pointerupoutside", this._onPointerUpOutside)
        this._active = false

        if (this.onPointerUpOutside)
            this.onPointerUpOutside(e)
    }

    private _onPointerOut(e: PIXI.InteractionEvent) {
        this.off("pointerout", this._onPointerOut)
        ease.add(this, { scale: 1, alpha: 1 }, { duration: 100 })

        if (this.onPointerOut)
            this.onPointerOut(e)
    }

}