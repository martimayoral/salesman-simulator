import * as PIXI from 'pixi.js'
import { PillButton } from './PillButton'
import { App, CHANGE_ALGORITHM_TRANSITION_DURATION, Theme } from '../../main'
import { ButtonBase } from './ButtonBase'
import { ease } from 'pixi-ease'
import { TextButton } from './TextButton'
import { BgChangeDirection } from '../Background'

const textStyle: Partial<PIXI.TextStyle> = { fill: 0xffffff }

// PREV AND NEXT BUTTON
const buttonSize = 50

class AlgorithmTitle extends TextButton {
    prevButton: PillButton
    nextButton: PillButton
    prevButtonArrow: PIXI.Graphics
    nextButtonArrow: PIXI.Graphics

    constructor() {
        super(0, 40, 5, 50, "", { fontSize: 35, fill: 0xffffff })

        const prevAndNextButtonSize = this.height / 1.2
        const bigArrowOffset = prevAndNextButtonSize / 4
        this.prevButton = new PillButton(
            prevAndNextButtonSize / 2 + (this.height - prevAndNextButtonSize) / 2,
            prevAndNextButtonSize / 2 + (this.height - prevAndNextButtonSize) / 2,
            prevAndNextButtonSize,
            prevAndNextButtonSize)

        this.prevButton.onClick = () => App.previousAlgorithm()
        this.prevButtonArrow = this.prevButton
            .addChild(new PIXI.Graphics())
            .lineStyle(3, 0xffffff)
            .moveTo(-bigArrowOffset + 3 * prevAndNextButtonSize / 4, prevAndNextButtonSize / 4)
            .lineTo(-bigArrowOffset + prevAndNextButtonSize / 2, prevAndNextButtonSize / 2)
            .lineTo(-bigArrowOffset + 3 * prevAndNextButtonSize / 4, 3 * prevAndNextButtonSize / 4)

            .moveTo(4 * prevAndNextButtonSize / 6, 2 * prevAndNextButtonSize / 6)
            .lineTo(prevAndNextButtonSize / 2, prevAndNextButtonSize / 2)
            .lineTo(4 * prevAndNextButtonSize / 6, 4 * prevAndNextButtonSize / 6)


        this.nextButton = new PillButton(
            this.geometry.bounds.maxX - (prevAndNextButtonSize / 2 + (this.height - prevAndNextButtonSize) / 2),
            prevAndNextButtonSize / 2 + (this.height - prevAndNextButtonSize) / 2,
            prevAndNextButtonSize,
            prevAndNextButtonSize)
        this.nextButton.onClick = () => App.nextAlgorithm()

        this.nextButtonArrow = this.nextButton
            .addChild(new PIXI.Graphics())
            .lineStyle(3, 0xffffff)
            .moveTo(bigArrowOffset + prevAndNextButtonSize / 4, prevAndNextButtonSize / 4)
            .lineTo(bigArrowOffset + prevAndNextButtonSize / 2, prevAndNextButtonSize / 2)
            .lineTo(bigArrowOffset + prevAndNextButtonSize / 4, 3 * prevAndNextButtonSize / 4)

            .moveTo(2 * prevAndNextButtonSize / 6, 2 * prevAndNextButtonSize / 6)
            .lineTo(prevAndNextButtonSize / 2, prevAndNextButtonSize / 2)
            .lineTo(2 * prevAndNextButtonSize / 6, 4 * prevAndNextButtonSize / 6)

        this.onHoverScale = 1

        this.addChild(this.prevButton)
        this.addChild(this.nextButton)
    }

    setText(text: string): void {
        super.setText(text)
        this.removeChild(this.nextButton)
        const prevAndNextButtonSize = this.height / 1.2
        if (this.nextButton) {
            this.nextButton.x = this.geometry.bounds.maxX - (prevAndNextButtonSize / 2 + (this.height - prevAndNextButtonSize) / 2)
            this.addChild(this.nextButton)
        }
    }

    setTheme(theme: Theme) {
        this.tint = theme.mainColor
        this._text.tint = theme.bgColor
        this.nextButton.tint = this.prevButton.tint = theme.secondaryColor
        this.nextButtonArrow.tint = this.prevButtonArrow.tint = theme.bgColor
    }

    changeTheme(algorithmName: string, theme: Theme, direction: BgChangeDirection = "instant") {
        if (direction === "instant") {
            this.setText(algorithmName)
            this.setTheme(theme)
            return
        }

        const cpy = new AlgorithmTitle()
        this.addChild(cpy)
        cpy.setText(algorithmName)
        cpy.y = 0
        cpy.pivot.y = 0

        // cpy.x = 0
        // cpy.pivot.x = 0
        cpy.x = this.geometry.bounds.maxX / 2
        cpy.x += direction === "left" ? -App.screen.width : App.screen.width
        cpy.setTheme(theme)

        // ease.add(cpy, { x: this.geometry.bounds.maxX / 2 }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION })
        ease.add(this, { x: this.x + (direction === "left" ? App.screen.width : - App.screen.width) }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION })
            .once('complete', () => {
                this.setText(algorithmName)
                this.setTheme(theme)
                this.x = App.screen.width / 2
                cpy.destroy(true)
            })


    }
}

// START BUTTON
class StartStopButton extends PillButton {
    buttonState: boolean

    constructor() {
        super(buttonSize, 0, buttonSize, buttonSize)
        this.buttonState = false
        this.onClick = () => {
            if (this.buttonState)
                App.stopAlgorithm()
            else
                App.startAlgorithm()
        }
    }

    setStop() {
        this.buttonState = false
        this.beginFill(0xff0000)
            .moveTo(buttonSize * .3, buttonSize * .2)
            .lineTo(buttonSize * .3, buttonSize * .8)
            .lineTo(buttonSize * .8, buttonSize * .5)
            .lineTo(buttonSize * .3, buttonSize * .2)
    }
    setPlay() {
        this.buttonState = true
        this.beginFill(0x00ff00)
            .moveTo(buttonSize * .3, buttonSize * .2)
            .lineTo(buttonSize * .3, buttonSize * .8)
            .lineTo(buttonSize * .8, buttonSize * .5)
            .lineTo(buttonSize * .3, buttonSize * .2)
    }
}

export class UI extends PIXI.Container {
    _genNumText: PIXI.Text
    _bestDistText: PIXI.Text
    algorithmTextTitle: AlgorithmTitle
    startStopButton: StartStopButton

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

        this.algorithmTextTitle = new AlgorithmTitle()
        this.addChild(this.algorithmTextTitle)

        this.addChild(this._genNumText)
        this.addChild(this._bestDistText)

        this.addChild(this.startStopButton = new StartStopButton())
    }

    resize() {
        setTimeout(() => {
            // START STOP BUTTON
            this.startStopButton.y = App.screen.height - buttonSize

            // Title
            this.algorithmTextTitle.x = App.screen.width / 2
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

    changeTheme(algorithmName: string, theme: Theme, direction: BgChangeDirection = "instant") {
        //     this.algorithmTextTitle.setText("Algorithm: " + algorithm)
        this.algorithmTextTitle.changeTheme(algorithmName, theme, direction)
    }

}