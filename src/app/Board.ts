import * as PIXI from 'pixi.js'

export type BoardPos = { bx: number, by: number }

const createBoardPattern = (graphics: PIXI.Graphics, w: number, h: number, wn: number, hn: number, color1?: number, color2?: number) => {
    graphics.beginFill(color1 | 0xe4dabd)
    graphics.drawRect(0, 0, w, h)
    graphics.beginFill(color2 | 0xdcbc8c)
    for (let i = 0; i < wn; i++) {
        for (let j = 0; j < hn; j++) {
            if ((i + j) % 2) {
                graphics.drawRect((w / wn) * i, (h / hn) * j, w / wn, h / hn)
            }
        }
    }
}

export class Board extends PIXI.Graphics {
    private _nw: number | undefined = 10
    private _nh: number | undefined = 10
    private _w = 100
    private _h = 100
    private _sqW: number | undefined = undefined
    private _sqH: number | undefined = undefined

    constructor() {
        super()

        // this.lineStyle(2, 0xffffff)

        // this.interactive = true
    }

    setBoardSize(w: number, h?: number) {
        if (!h) h = w
        this._w = w
        this._h = h
        return this
    }

    setSquareNum(w: number, h?: number) {
        if (!h) h = w
        this._nw = w
        this._nh = h
        this._sqH = undefined
        this._sqW = undefined
        return this
    }

    setSquareSize(w: number, h?: number) {
        if (!h) h = w
        this._sqW = w
        this._sqH = h
        this._nw = undefined
        this._nh = undefined
        return this
    }

    drawBoardPattern() {
        this.clear()
        if (this._nw)
            createBoardPattern(this, this._w, this._h, this._nw, this._nh)
        else
            createBoardPattern(this, this._w, this._h, this._w / this._sqW, this._h / this._sqH)
        return this
    }
}