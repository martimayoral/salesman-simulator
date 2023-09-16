import * as PIXI from 'pixi.js'
import { PillButton } from "./PillButton"

const defaultStlye = {}

export class TextButton extends PillButton {
    _text: PIXI.Text
    _centerX: number
    _centerY: number
    _offsetX: number
    _offsetY: number

    constructor(x: number, y: number, offsetY: number, offsetX: number, text: string, style: Partial<PIXI.ITextStyle> = {}) {
        super()
        this._centerX = x
        this._centerY = y
        this._offsetX = offsetX
        this._offsetY = offsetY

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
            this._text.width + this._offsetX * 2,
            this._text.height + this._offsetY * 2
        )
    }
}