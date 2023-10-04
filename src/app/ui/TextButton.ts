import * as PIXI from 'pixi.js'
import { PillButton } from "./PillButton"

const defaultStlye: Partial<PIXI.TextStyle> = {
    align: "center", fill: 0xffffff
}

export class TextButton extends PillButton {
    _text: PIXI.Text
    _centerX: number
    _centerY: number
    _offsetX: number
    _offsetY: number
    _fixedWidth: number | undefined
    _fixedHeight: number | undefined

    constructor(x: number, y: number, offsetY: number, offsetX: number, text: string, style: Partial<PIXI.ITextStyle> = {}, fixedWidth?: number, fixedHeight?: number) {
        super()
        this._centerX = x
        this._centerY = y
        this._offsetX = offsetX
        this._offsetY = offsetY
        this._fixedWidth = fixedWidth
        this._fixedHeight = fixedHeight

        this._text = new PIXI.Text(text, { ...defaultStlye, ...style })
        this._text.x = offsetX
        this._text.y = offsetY
        this.addChild(this._text)
        this.setText(text)
    }


    setText(text: string) {
        this._text.text = text
        this.setDimensions(
            this._centerX,
            this._centerY,
            this._fixedWidth ? this._fixedWidth : this._text.width + this._offsetX * 2,
            this._fixedHeight ? this._fixedHeight : this._text.height + this._offsetY * 2
        )
        // center text
        if (this._fixedWidth)
            this._text.position.x = this._fixedWidth / 2 - this._text.width / 2
    }
}