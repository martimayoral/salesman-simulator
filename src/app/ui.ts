import * as PIXI from 'pixi.js'

const textStyle: Partial<PIXI.TextStyle> = { fill: 0xffffff }

export class UI extends PIXI.Container {
    _genNumText: PIXI.Text
    _bestDistText: PIXI.Text

    constructor() {
        super()

        this._genNumText = new PIXI.Text("", textStyle)
        this._genNumText.x = 10
        this._genNumText.y = 10
        this.setGenNumText(0)

        this._bestDistText = new PIXI.Text("", textStyle)
        this._bestDistText.x = 10
        this._bestDistText.y = 40
        this.bestDistText = 0

        this.addChild(this._genNumText)
        this.addChild(this._bestDistText)
    }

    setGenNumText(genNum: number, genMax?: number) {
        this._genNumText.text = "Gen num: " + genNum.toFixed(0)
        if (genMax)
            this._genNumText.text += "/" + genMax.toFixed(0)
    }
    set bestDistText(bestDist: number) {
        this._bestDistText.text = "Best dist: " + bestDist.toFixed(0) + "km"
    }

}