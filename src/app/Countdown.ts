import * as PIXI from 'pixi.js'


export class Countdown extends PIXI.Graphics {
    ticker: PIXI.Ticker
    currentTimeMs: number = 0
    finished: boolean = false

    constructor({
        onCountdownEnd,
        timeMs = 2000,
        lineColor = 0x000000,
        lineWidth = 20,
        radius = 10
    }: {
        onCountdownEnd: () => void,
        timeMs?: number,
        lineColor?: number,
        radius?: number,
        lineWidth?: number
    }) {
        super()
        this.filters = [new PIXI.filters.BlurFilter(1)]
        this.ticker = new PIXI.Ticker()
        this.ticker.start()
        this.ticker.add(() => {
            this.clear()
                .lineStyle(lineWidth, lineColor)
                .arc(0, 0, radius, 0, (this.currentTimeMs / timeMs) * 2 * Math.PI)

            this.currentTimeMs += this.ticker.deltaMS
            if (this.currentTimeMs >= timeMs && !this.finished) {
                onCountdownEnd()
                this.finished = true
            }
        })
    }

    destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean }): void {
        this.ticker.destroy()
        super.destroy(options)
    }

}
