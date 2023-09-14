import * as PIXI from 'pixi.js'
import { App } from '../../main';
import { nodes } from '../app';

const MS_TO_DELETE_NODE = 200

let dragTarget: NodeGraphic = null;
let clickData: { time: number, x: number, y: number } = { time: 0, x: 0, y: 0 }

function onDragMove(event: PIXI.InteractionEvent) {
    if (dragTarget) {
        dragTarget.parent.toLocal(event.data.global, null, dragTarget.position);
    }
}

function onDragStart(e: PIXI.InteractionEvent) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    // this.data = event.data;
    this.alpha = 0.5
    dragTarget = this
    clickData = { time: Date.now(), x: e.data.global.x, y: e.data.global.y }

    App.stage.on('pointermove', onDragMove)
    App.stage.on('pointerup', onDragEnd)
    App.stage.on('pointerupoutside', onDragEnd)
}

function onDragEnd(e: PIXI.InteractionEvent) {
    if (dragTarget) {
        App.stage.off('pointermove', onDragMove);
        App.stage.off('pointerup', onDragEnd)
        App.stage.off('pointerupoutside', onDragEnd)
        dragTarget.alpha = 1;

        const index = dragTarget.parent.getChildIndex(dragTarget)

        if (clickData.time + MS_TO_DELETE_NODE < Date.now()
            && clickData.x === e.data.global.x
            && clickData.y === e.data.global.y)
            nodes.deleteNode(index)
        else
            nodes.moveNodeData(index, dragTarget.x, dragTarget.y)


        dragTarget = null;
    }
}

export class NodeGraphic extends PIXI.Graphics {
    constructor(x: number, y: number) {
        super()

        this.beginFill(0x00ff00)
            .drawCircle(0, 0, 10)
        this.x = x
        this.y = y

        this.interactive = true
        this.on("pointerdown", onDragStart)

        const text = this.addChild(new PIXI.Text("", { fill: 0xffffff }))
        setTimeout(() => {
            App.ticker.add(() => {
                text.text = this.parent?.getChildIndex(this)
            }, this)
        }, 200);
    }

}