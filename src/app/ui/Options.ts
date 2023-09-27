import { directionToWidth } from "../Background"
import { GameApp } from "../app"
import { TextButton } from "./TextButton"

export class TextOption extends TextButton {
    constructor(title: string, onClick: () => void) {
        super(35, 55, 10, 10, title, { fill: 0xffffff }, 100)
        this.centerX = false
        this.setText(title)
        setTimeout(() => {

            this.tint = GameApp.theme?.mainColor
            this._text.tint = GameApp.theme?.bgColor

        });

        this.onClick = onClick
    }
}