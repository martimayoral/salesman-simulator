import * as PIXI from 'pixi.js'
import { gameApp, CHANGE_ALGORITHM_TRANSITION_DURATION, nodes } from '../../main';
import { Ease, ease } from 'pixi-ease'
import { ButtonBase } from '../ui/ButtonBase';
import { GameApp } from '../app';
import { NodeGraphic } from './NodeGraphic';



function onDragStart(e: PIXI.InteractionEvent) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    // this.data = event.data;
    nodes.startDraggingNode(this)
}


export class AlgorithmNode extends NodeGraphic {
    centerGraphic: PIXI.Graphics
    text: PIXI.Text
    deleted: boolean = false

    constructor(x: number, y: number) {
        super(x, y)


        this.interactive = true
        this.on("pointerdown", onDragStart)

    }

    updateText() {
        this.setText(this.index.toString());
    }

    get index() { return this.parent?.getChildIndex(this) }


}