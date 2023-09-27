import * as PIXI from 'pixi.js'
import { PillButton } from './PillButton'
import { gameApp, CHANGE_ALGORITHM_TRANSITION_DURATION, Theme, searchAlgorithms } from '../../main'
import { ButtonBase } from './ButtonBase'
import { ease } from 'pixi-ease'
import { TextButton } from './TextButton'
import { BgChangeDirection, directionToWidth } from '../Background'
import { GameApp } from '../app'
import fast from './../../assets/images/startup.png'
import med from './../../assets/images/hare.png'
import slow from './../../assets/images/snail.png'
import { GraphicButton } from './GraphicButton'
import { AlgorithmSpeed } from '../Search Algorithms/SearchAlgorithmBase'

const textStyle: Partial<PIXI.TextStyle> = { fill: 0xffffff, fontSize: 20 }

class AlgorithmTitle extends TextButton {
    prevButton: PillButton
    nextButton: PillButton
    prevButtonArrow: PIXI.Graphics
    nextButtonArrow: PIXI.Graphics

    private _bestDistText: PIXI.Text


    constructor() {
        super(0, 40, 5, 50, "", { fontSize: 35, fill: 0xffffff })


        this.addChild(this._bestDistText = new PIXI.Text("", textStyle))
        this._bestDistText.y = 5 + this.height
        this._bestDistText.anchor.x = 0.5

        const prevAndNextButtonSize = this.geometry.bounds.maxY / 1.2
        const bigArrowOffset = prevAndNextButtonSize / 4
        this.prevButton = new PillButton(
            prevAndNextButtonSize / 2 + (this.geometry.bounds.maxY - prevAndNextButtonSize) / 2,
            prevAndNextButtonSize / 2 + (this.geometry.bounds.maxY - prevAndNextButtonSize) / 2,
            prevAndNextButtonSize,
            prevAndNextButtonSize)

        this.prevButton.onClick = () => gameApp.previousAlgorithm()
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
            0, // computed on resize
            prevAndNextButtonSize / 2 + (this.geometry.bounds.maxY - prevAndNextButtonSize) / 2,
            prevAndNextButtonSize,
            prevAndNextButtonSize)
        this.nextButton.onClick = () => gameApp.nextAlgorithm()

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

        this.alpha = 0
        ease.add(this, { alpha: 1 }, { duration: 100, wait: 100 })
    }

    setBestDist(bestDist?: number) {
        if (!GameApp.currentSearchAlgorithmName) {
            setTimeout(() => {
                this.setBestDist()
            })
            return
        }

        if (this._bestDistText && searchAlgorithms) {
            var bd = bestDist ? bestDist : searchAlgorithms[GameApp.currentSearchAlgorithmName]?.algorithm?.bestDist
            if (bd === undefined)
                bd = 0
            this._bestDistText.text = bd?.toFixed() + "km"
            this._bestDistText.x = this.geometry.bounds.maxX / 2
        }
    }

    setText(text: string): void {
        super.setText(text)
        this.removeChild(this.nextButton)
        const prevAndNextButtonSize = this.height / 1.2

        if (this._bestDistText)
            this._bestDistText.x = this.geometry.bounds.maxX / 2
        if (this.nextButton) {
            this.nextButton.x = this.geometry.bounds.maxX - (prevAndNextButtonSize / 2 + (this.geometry.bounds.maxY - prevAndNextButtonSize) / 2)
            this.addChild(this.nextButton)
        }
    }

    setTheme(theme: Theme) {
        this.tint = theme.mainColor
        this._bestDistText.tint = theme.mainColor
        this._text.tint = theme.bgColor
        this.nextButton.tint = this.prevButton.tint = theme.secondaryColor
        this.nextButtonArrow.tint = this.prevButtonArrow.tint = theme.bgColor
    }

    changeTheme(algorithmName: string, direction: BgChangeDirection = "instant") {
        if (direction === "instant") {
            this.setText(algorithmName)
            this.setTheme(GameApp.theme)
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
        cpy.x += directionToWidth(direction)
        cpy.setTheme(GameApp.theme)

        cpy.setBestDist()

        // ease.add(cpy, { x: this.geometry.bounds.maxX / 2 }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION })
        ease.add(this, { x: this.x - directionToWidth(direction) }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION })
            .once('complete', () => {
                this.setText(algorithmName)
                this.setTheme(GameApp.theme)
                this.x = gameApp.screen.width / 2
                this.setBestDist()
                cpy.destroy(true)
            })
    }

}


// () => new TextOption("+10", () => {
//     for (let i = 0; i < 10; i++) {
//         setTimeout(() => {
//             nodes.addNode()
//         }, i * 50);
//     }
// }),
// () => new TextOption("-10", () => {
//     for (let i = 0; i < 10; i++) {
//         setTimeout(() => {
//             nodes.deleteNode(Math.floor(Math.random() * nodes.numNodes))
//         }, i * 50);
//     }
// }),
// () => new TextOption("rand", () => {
//     nodes.reArrangeNodes()
// })

const PLAY_PAUSE_TRANSITION_DURATION = 200
const buttonSize = 60

// START BUTTON
class StartStopButton extends PillButton {
    isStopped: boolean

    bar1: PIXI.Graphics
    bar2: PIXI.Graphics
    bar3: PIXI.Graphics

    button: PillButton

    slowSpeedButton: GraphicButton
    normalSpeedButton: GraphicButton
    fastSpeedButton: GraphicButton

    nextGenButton: GraphicButton
    prevGenButton: GraphicButton

    _genNumText: PIXI.Text

    constructor() {
        super()
        this.button = new PillButton(0, 0, buttonSize, buttonSize)
        this.isStopped = false
        this.button.onClick = () => {
            if (!this.isStopped)
                gameApp.stopAlgorithm()
            else
                gameApp.startAlgorithm()
        }

        this.onClickAlpha = 1

        this.slowSpeedButton = new GraphicButton(0, 0, 48, 60, new PIXI.Sprite(PIXI.Texture.from(slow)), 3.5, 10, 24, 24, -30)
        this.slowSpeedButton.angle = -45
        this.slowSpeedButton.onClick = () => gameApp.changeAlgorithmSpeed("slow")

        this.normalSpeedButton = new GraphicButton(0, 0, 48, 60, new PIXI.Sprite(PIXI.Texture.from(med)), 6, -2.5, 36, 36, 0)
        this.normalSpeedButton.selected = true
        this.normalSpeedButton.onClick = () => gameApp.changeAlgorithmSpeed("normal")

        this.fastSpeedButton = new GraphicButton(0, 0, 48, 60, new PIXI.Sprite(PIXI.Texture.from(fast)), 22, 30, 24, 24, 250)
        this.fastSpeedButton.angle = 45
        this.fastSpeedButton.onClick = () => gameApp.changeAlgorithmSpeed("fast")

        const arrowGraphic = new PIXI.Graphics().lineStyle(3, 0xffffff).moveTo(0, 0).lineTo(10, 10).lineTo(20, 0)

        this.nextGenButton = new GraphicButton(0, 0, 40, 60, arrowGraphic, 11, 45, 20, 10, 0)
        this.nextGenButton.angle = -90
        this.nextGenButton.onClick = () => gameApp.showNextGen()

        this.prevGenButton = new GraphicButton(0, 0, 40, 60, arrowGraphic.clone(), 11, 45, 20, 10, 0)
        this.prevGenButton.angle = 90
        this.prevGenButton.onClick = () => gameApp.showPrevGen()

        this.addChild(this.nextGenButton)
        this.addChild(this.prevGenButton)
        this.addChild(this.slowSpeedButton)
        this.addChild(this.fastSpeedButton)
        this.addChild(this.normalSpeedButton)

        this.addChild(this.button)
        this.onPointerOver = () => {
            if (this.isStopped)
                this.showPlayBackButtons()
            else
                this.showSpeedButtons()
        }
        this.onPointerOut = () => {
            this.hideSpeedButtons()
            this.hidePlayBackButtons()
            this.showGenNum()
        }

        this.button.addChild(this.bar1 = new PIXI.Graphics())
        this.button.addChild(this.bar2 = new PIXI.Graphics())
        this.button.addChild(this.bar3 = new PIXI.Graphics())

        this.bar1.beginFill(0xffffff)
            .drawRoundedRect(
                -buttonSize * .1,
                0,
                buttonSize * .2,
                buttonSize * .5,
                buttonSize)
        this.bar2.beginFill(0xffffff)
            .drawRoundedRect(
                -buttonSize * .1,
                0,
                buttonSize * .2,
                buttonSize * .45,
                buttonSize)
        this.bar3.beginFill(0xffffff)
            .drawRoundedRect(
                -buttonSize * .1,
                0,
                buttonSize * .2,
                buttonSize * .45,
                buttonSize)

        this._genNumText = new PIXI.Text("", textStyle)
        this._genNumText.anchor.x = 0.5
        this._genNumText.anchor.y = 1
        // this._genNumText.y = -this.height / 2
        this._genNumText.hitArea = new PIXI.Polygon()


        this.alpha = 0
        ease.add(this, { alpha: 1 }, { duration: 100, wait: 100 })
        this.setStop()
        this.hideSpeedButtons()

        this.addChild(this._genNumText)
    }

    showPlayBackButtons() {
        ease.add(this.prevGenButton, { x: -23, alpha: 1 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
        ease.add(this.nextGenButton, { x: 23, alpha: 1 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
    }

    hidePlayBackButtons() {
        ease.add(this.prevGenButton, { x: 0, alpha: 0 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
        ease.add(this.nextGenButton, { x: 0, alpha: 0 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
    }

    showSpeedButtons() {
        ease.add(this.slowSpeedButton, { x: -24, y: -30, alpha: 1 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
        ease.add(this.normalSpeedButton, { y: -36, alpha: 1 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
        ease.add(this.fastSpeedButton, { x: 24, y: -30, alpha: 1 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
        this.hideGenNum()
    }

    hideSpeedButtons() {
        ease.add(this.slowSpeedButton, { x: 0, y: 0, alpha: 0 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
        ease.add(this.normalSpeedButton, { y: 0, alpha: 0 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
        ease.add(this.fastSpeedButton, { x: 0, y: 0, alpha: 0 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
        this.showGenNum()
    }

    showGenNum() {
        // console.log("asfa", this.geometry.bounds.maxY)
        ease.add(this._genNumText, { y: -this.button.geometry.bounds.maxY / 2 - 5, scale: 1 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
    }

    hideGenNum() {
        ease.add(this._genNumText, { y: -75, scale: .7 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
    }

    changeSpeedGraphic(speed: AlgorithmSpeed) {
        switch (speed) {
            case "slow":
                this.slowSpeedButton.selected = true
                this.normalSpeedButton.selected = false
                this.fastSpeedButton.selected = false
                break
            case "normal":
                this.slowSpeedButton.selected = false
                this.normalSpeedButton.selected = true
                this.fastSpeedButton.selected = false
                break
            case "fast":
                this.slowSpeedButton.selected = false
                this.normalSpeedButton.selected = false
                this.fastSpeedButton.selected = true
                break
        }
    }

    resize() {
        this.x = gameApp.screen.width / 2
        this.y = gameApp.screen.height - 2 * buttonSize / 3
    }

    changeTheme() {
        ease.add([this.button, this._genNumText], { blend: [this.button.tint, GameApp.theme.mainColor] }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION })
        ease.add([this.bar1, this.bar2, this.bar3], { blend: [this.bar1.tint, GameApp.theme.bgColor] }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION })

        this.slowSpeedButton.changeTheme()
        this.normalSpeedButton.changeTheme()
        this.fastSpeedButton.changeTheme()
        this.prevGenButton.changeTheme()
        this.nextGenButton.changeTheme()
    }

    setStop() {
        this.isStopped = false
        this.showSpeedButtons()
        this.hidePlayBackButtons()

        ease.add(this.bar1, { x: buttonSize * .35, y: buttonSize * .25 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
        ease.add(this.bar2, { x: buttonSize * .65, y: buttonSize * .25, rotation: 0 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
        ease.add(this.bar3, { x: buttonSize * .65, y: buttonSize * .75, rotation: -Math.PI }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
    }

    setPlay() {
        this.isStopped = true
        this.hideSpeedButtons()
        this.showPlayBackButtons()

        ease.add(this.bar1, { x: buttonSize * .43, y: buttonSize * .25 }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
        ease.add(this.bar2, { x: buttonSize * .35, y: buttonSize * .25, rotation: -55 * PIXI.DEG_TO_RAD }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
        ease.add(this.bar3, { x: buttonSize * .35, y: buttonSize * .7, rotation: -125 * PIXI.DEG_TO_RAD }, { duration: PLAY_PAUSE_TRANSITION_DURATION })
    }
}

export class UI extends PIXI.Container {
    algorithmTextTitle: AlgorithmTitle
    startStopButton: StartStopButton

    algorithmOptions: ButtonBase[]

    constructor() {
        super()

        this.algorithmOptions = []

        this.algorithmTextTitle = new AlgorithmTitle()
        this.addChild(this.algorithmTextTitle)

        this.addChild(this.startStopButton = new StartStopButton())

    }

    resize() {
        setTimeout(() => {
            // START STOP BUTTON
            this.startStopButton.resize()

            // Title
            this.algorithmTextTitle.x = gameApp.screen.width / 2
        })
    }

    changeSpeedGraphic(speed: AlgorithmSpeed) {
        this.startStopButton.changeSpeedGraphic(speed)
    }


    setGenNumText(genNum: number) {
        this.startStopButton._genNumText.text = genNum.toFixed(0)
    }

    set bestDistText(bestDist: number) {
        this.algorithmTextTitle.setBestDist(bestDist)
    }

    updateBestDist() {
        // console.log("updatebestdist")
        this.algorithmTextTitle.setBestDist()
    }

    changeTheme(algorithmName: string, direction: BgChangeDirection = "instant") {
        //     this.algorithmTextTitle.setText("Algorithm: " + algorithm)
        this.algorithmTextTitle.changeTheme(algorithmName, direction)
    }

    changeAlgorithmOptions(algorithmOptionsData: (() => ButtonBase)[], direction: BgChangeDirection = "instant") {
        const directionWidth = directionToWidth(direction)

        // destroy olds
        this.algorithmOptions.forEach(ao => {
            ease.add(ao, { x: ao.x - directionWidth }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION })
                .once("complete", () =>
                    ao.destroy(true)
                )
        })

        this.algorithmOptions = []
        for (let i = 0; i < algorithmOptionsData.length; i++) {
            const element = algorithmOptionsData[i];
            const newOption = element()
            this.algorithmOptions.push(newOption)

            newOption.x += directionWidth
            newOption.y += 60 * i
            ease.add(newOption, { x: newOption.x - directionWidth }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION })

            this.addChild(newOption)
        }

        this.startStopButton.changeTheme()
    }

}