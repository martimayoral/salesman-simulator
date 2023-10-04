import * as PIXI from 'pixi.js'
import { gameApp, CHANGE_ALGORITHM_TRANSITION_DURATION, nodes } from '../../main';
import { Ease, ease } from 'pixi-ease'
import { ButtonBase } from '../ui/ButtonBase';
import { GameApp } from '../app';


const animationDuration = 100

const deafultNodeSize = 10
const nodeMargin = 4

export class NodeGraphic extends ButtonBase {
    centerGraphic: PIXI.Graphics
    text: PIXI.Text
    deleted: boolean = false

    constructor(x: number, y: number, nodeSize: number = deafultNodeSize) {
        super()

        this.beginFill(0xffffff)
            .drawCircle(0, 0, nodeSize)

        this.x = x
        this.y = y
        this.tint = GameApp.theme?.bgColor

        this.centerGraphic = this.addChild(
            new PIXI.Graphics()
                .beginFill(0xffffff)
                .drawCircle(0, 0, nodeSize - nodeMargin)
        )
        this.centerGraphic.tint = GameApp.theme?.bgColor
        if (GameApp.theme)
            this.changeColor()


        this.text = this.addChild(new PIXI.Text("", { fill: 0xffffff, fontSize: 10 }))

        this.scale.set(0)

        ease.add(
            this,
            { scale: 1 },
            { duration: animationDuration, ease: 'easeOutBack' }
        )
    }

    setText(text: string){
        this.text.text = text
        this.text.pivot.x = this.text.width / 2
        this.text.pivot.y = this.text.height / 2
    }

    changeColor(instant?: boolean) {
        if (instant) {
            this.tint = GameApp.theme.mainColor
            this.centerGraphic.tint = GameApp.theme.bgColor
        } else {
            ease.add(this, { blend: [this.tint, GameApp.theme?.mainColor] }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION })
            ease.add(this.centerGraphic, { blend: [this.centerGraphic.tint, GameApp.theme?.bgColor] }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION })
        }
        // this.tint = GameApp.theme?.mainColor
        // this.centerGraphic.tint = GameApp.theme?.secondaryColor
    }

    destroy(options?: PIXI.IDestroyOptions): void {
        this.deleted = true
        ease.add(
            this,
            { scale: 0 },
            { duration: animationDuration, ease: 'easeInBack' }
        ).once("complete", () => {
            super.destroy({ ...options, children: true })
            nodes.updateNodesText()
        })
    }

}