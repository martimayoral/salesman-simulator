import * as PIXI from 'pixi.js'
import { gameApp, CHANGE_ALGORITHM_TRANSITION_DURATION, nodes } from '../../main';
import { Ease, ease } from 'pixi-ease'
import { ButtonBase } from '../ui/ButtonBase';
import { GameApp } from '../app';

const MS_TO_DELETE_NODE = 200

const animationDuration = 100

let dragTarget: NodeGraphic = null;
let clickData: { time: number, x: number, y: number } = { time: 0, x: 0, y: 0 }

function onDragMove(event: PIXI.InteractionEvent) {
    if (dragTarget) {
        dragTarget.parent.toLocal(event.data.global, null, dragTarget.position)
        nodes.moveNodeData(dragTarget.index, dragTarget.x, dragTarget.y)
    }
}

function onDragStart(e: PIXI.InteractionEvent) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    // this.data = event.data;
    dragTarget = this
    clickData = { time: Date.now(), x: e.data.global.x, y: e.data.global.y }

    gameApp.stage.on('pointermove', onDragMove)
    gameApp.stage.on('pointerup', onDragEnd)
    gameApp.stage.on('pointerupoutside', onDragEnd)
}

function onDragEnd(e: PIXI.InteractionEvent) {
    if (dragTarget) {
        gameApp.stage.off('pointermove', onDragMove);
        gameApp.stage.off('pointerup', onDragEnd)
        gameApp.stage.off('pointerupoutside', onDragEnd)

        const index = dragTarget.index

        if (clickData.time + MS_TO_DELETE_NODE < Date.now()
            && clickData.x === e.data.global.x
            && clickData.y === e.data.global.y)
            nodes.deleteNode(index)
        else
            nodes.moveNodeData(index, dragTarget.x, dragTarget.y)


        dragTarget = null;
    }
}

const nodeSize = 10
const nodeMargin = 4

export class NodeGraphic extends ButtonBase {
    centerGraphic: PIXI.Graphics
    text: PIXI.Text
    deleted: boolean = false

    constructor(x: number, y: number) {
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

        this.interactive = true
        this.on("pointerdown", onDragStart)

        this.text = this.addChild(new PIXI.Text("", { fill: 0xffffff, fontSize: 10 }))

        this.scale.set(0)

        ease.add(
            this,
            { scale: 1 },
            { duration: animationDuration, ease: 'easeOutBack' }
        )
    }

    updateText() {

        this.text.text = this.index
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

    get index() { return this.parent?.getChildIndex(this) }

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