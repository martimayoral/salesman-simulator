import * as PIXI from 'pixi.js'
import { CHANGE_ALGORITHM_TRANSITION_DURATION, gameApp, nodes } from "../../main";
import { NodeGraphic } from "../node/NodeGraphic";
import { ButtonBase } from "./ButtonBase";
import { HIDDEN_BUTTONS_TRANSITION_DURATION, buttonSize } from "./ui";
import { EaseParams, ease } from 'pixi-ease';
import trash from './../../assets/images/trash-can.png'
import dice from './../../assets/images/dice.png'
import { GameApp } from '../app';
import { PillButton } from './PillButton';
import { TextButton } from './TextButton';
import { GraphicButton } from './GraphicButton';

function onDragStart(this: RemoveNodeButton, e: PIXI.InteractionEvent) {
    nodes.startDraggingNode(nodes.addNode())
    // this.buttons.hideButtons()
}

const animationDuration = 50
const easeParamsShow: EaseParams = { alpha: 1, scale: 1, rotation: 0 }
const easeParamsHide: EaseParams = { alpha: 0, scale: 0, rotation: 1 }

export class RemoveNodeButton extends NodeGraphic {
    buttons: NodesButtons

    constructor(buttons: NodesButtons, x: number, y: number, nodeSize?: number) {
        super(x, y, nodeSize)
        this.buttons = buttons
        this.on("pointerdown", onDragStart)
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
export class NodesButtons extends ButtonBase {
    trashContainer: PIXI.Container
    trashIcon: PIXI.Sprite

    nodeButton: RemoveNodeButton

    addNodes: TextButton
    removeNodes: TextButton

    randomize: GraphicButton

    constructor() {
        super()
        this.nodeButton = new RemoveNodeButton(this, 0, 0, buttonSize / 2)
        this.onClickAlpha = 1

        setTimeout(() => {
            this.nodeButton.changeColor()
            this.nodeButton.text.style.fontSize = buttonSize / 2
            this.nodeButton.text.resolution = 2
            this.nodeButton.setText("+")
        });
        this.nodeButton.tint = 0xffffff
        this.nodeButton.centerGraphic.tint = 0xffffff

        this.nodeButton.addChild(this.trashContainer = new PIXI.Container())
        this.trashIcon = new PIXI.Sprite(PIXI.Texture.from(trash))
        this.trashIcon.width = this.trashIcon.height = buttonSize / 2
        this.trashIcon.anchor.x = this.trashIcon.anchor.y = 0.5
        this.trashContainer.addChild(this.trashIcon)
        this.trashContainer.alpha = 0

        this.onHoverScale = 1.05

        this.addNodes = new TextButton(0, 0, 0, 0, "     +10", {}, 90, 30)
        this.removeNodes = new TextButton(0, 0, 0, 0, "     -10", {}, 90, 30)
        this.addNodes.y = -15
        this.removeNodes.y = 15
        this.removeNodes.alpha = 0
        this.addNodes.alpha = 0

        this.removeNodes.onClick = () => {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    nodes.deleteNode(Math.floor(Math.random() * nodes.numNodes))
                }, i * 50);
            }
        }

        this.addNodes.onClick = () => {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    nodes.addNode()
                }, i * 50);
            }
        }

        this.randomize = new GraphicButton(0, 0, 40, 60, new PIXI.Sprite(PIXI.Texture.from(dice)), 2.5, 0, 35, 35, 0)
        this.randomize.alpha = 1
        this.randomize.selected = true

        this.randomize.onClick = () => {
            nodes.reArrangeNodes()
        }

        this.hideButtons()

        this.addChild(this.addNodes)
        this.addChild(this.removeNodes)
        this.addChild(this.randomize)

        this.addChild(this.nodeButton)

        this.onPointerOver = () => {
            if (!!!nodes.draggingNode)
                this.showButtons()
        }

        this.onPointerOut = () => {
            this.hideButtons()
        }
    }

    resize() {
        this.x = 2 * buttonSize / 3
        this.y = gameApp.screen.height - 2 * buttonSize / 3
    }

    onNodeOnTop() {
        ease.add([this.nodeButton, this], { alpha: 1 }, { duration: 100 })

        ease.add(this.nodeButton.text, easeParamsHide, { duration: animationDuration })
        ease.add(this.trashContainer, easeParamsShow, { duration: animationDuration })
    }

    onNodeOut() {
        ease.add(this.nodeButton.text, easeParamsShow, { duration: animationDuration })
        ease.add(this.trashContainer, easeParamsHide, { duration: animationDuration })
    }

    changeTheme() {
        this.nodeButton.changeColor()
        ease.add(
            [this.trashIcon, this.nodeButton.text, this.addNodes, this.removeNodes],
            { blend: [this.tint, GameApp.theme?.mainColor] }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION }
        )
        ease.add(
            [this.addNodes._text, this.removeNodes._text],
            { blend: [this.tint, GameApp.theme?.bgColor] }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION }
        )
        this.randomize.changeTheme()
    }


    showButtons() {
        ease.add([this.addNodes, this.removeNodes], { x: 35, alpha: 1, scaleX: 1 }, { duration: HIDDEN_BUTTONS_TRANSITION_DURATION })
        ease.add(this.randomize, { y: -35, alpha: 1,scaleY: 1  }, { duration: HIDDEN_BUTTONS_TRANSITION_DURATION })
    }
    hideButtons() {
        ease.add([this.addNodes, this.removeNodes], { x: 20, alpha: 0, scaleX: .1 }, { duration: HIDDEN_BUTTONS_TRANSITION_DURATION })
        ease.add(this.randomize, { y: -10, alpha: 0,scaleY: .5 }, { duration: HIDDEN_BUTTONS_TRANSITION_DURATION })
    }
}
