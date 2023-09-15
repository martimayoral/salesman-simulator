import * as PIXI from 'pixi.js'
import { PillButton } from './PillButton'
import { App } from '../../main'
import { ButtonBase } from './ButtonBase'
import { ease } from 'pixi-ease'

const textStyle: Partial<PIXI.TextStyle> = { fill: 0xffffff }

// PREV AND NEXT BUTTON
const initialOffset = -10
const hoverOffset = 5
const buttonSize = 50
const prevButton = new PillButton(initialOffset, 0, buttonSize, buttonSize)
prevButton.onClick = () => App.previousAlgorithm()
const onPrevPointerOver = () => {
    ease.add(prevButton, { x: hoverOffset }, { duration: 100 })
    prevButton.on('pointerout', onPrevPointerOut)
}
const onPrevPointerOut = () => {
    ease.add(prevButton, { x: initialOffset }, { duration: 100 })
    prevButton.off('pointerout', onPrevPointerOut)
}
prevButton.on('pointerover', onPrevPointerOver)

const nextButton = new PillButton(0, 0, buttonSize, buttonSize)
nextButton.onClick = () => App.nextAlgorithm()
const onNextPointerOver = () => {
    ease.add(nextButton, { x: App.screen.width - hoverOffset }, { duration: 100 })
    nextButton.on('pointerout', onNextPointerOut)
}

const onNextPointerOut = () => {
    ease.add(nextButton, { x: App.screen.width - initialOffset }, { duration: 100 })
    nextButton.off('pointerout', onNextPointerOut)
}
nextButton.on('pointerover', onNextPointerOver)

// START BUTTON
const startStopButton = new PillButton(buttonSize, 0, buttonSize, buttonSize)
startStopButton
    .beginFill(0x00ffff)
    .moveTo(buttonSize * .3, buttonSize * .2)
    .lineTo(buttonSize * .3, buttonSize * .8)
    .lineTo(buttonSize * .8, buttonSize * .5)
    .lineTo(buttonSize * .3, buttonSize * .2)
startStopButton.onClick = () => { App.togglePlayPause() }

export class UI extends PIXI.Container {
    _genNumText: PIXI.Text
    _bestDistText: PIXI.Text
    _algorithmNameText: PIXI.Text

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

        this._algorithmNameText = new PIXI.Text("", textStyle)
        this._algorithmNameText.x = 10
        this._algorithmNameText.y = 70
        this.algorithmNameText = ""

        this.addChild(this._genNumText)
        this.addChild(this._bestDistText)
        this.addChild(this._algorithmNameText)

        this.addChild(prevButton)
        this.addChild(nextButton)
        this.addChild(startStopButton)
    }

    createPlayPauseButton() {

    }

    resize() {
        setTimeout(() => {
            // PREV AND NEXT BUTTON
            prevButton.y = App.screen.height / 2
            nextButton.x = App.screen.width - initialOffset
            nextButton.y = App.screen.height / 2

            // START STOP BUTTON
            startStopButton.y = App.screen.height - buttonSize
        })
    }


    setGenNumText(genNum: number, genMax?: number) {
        this._genNumText.text = "Gen num: " + genNum.toFixed(0)
        if (genMax)
            this._genNumText.text += "/" + genMax.toFixed(0)
    }
    set bestDistText(bestDist: number) {
        this._bestDistText.text = "Best dist: " + bestDist.toFixed(0) + "km"
    }
    set algorithmNameText(algorithm: string) {
        this._algorithmNameText.text = "Algorithm: " + algorithm
    }

}