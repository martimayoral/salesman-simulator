import * as PIXI from 'pixi.js'
import { Nodes } from './node/Nodes';
import { RandomPathAlgorithm } from './Search Algorithms/RandomPath';
import { SearchAlgorithmBase } from './Search Algorithms/SearchAlgorithmBase';
import { UI } from './ui/ui';
import { Background } from './Background';
import { InOrderAlgorithm } from './Search Algorithms/InOrderAlgorithm';
import { HeapsCombinations } from './Search Algorithms/HeapsCombinations';
import { AntColonyAlgorithm } from './Search Algorithms/AntColonyAlgorithm';

const N_INITIAL_NODES = 10

export const nodes = new Nodes()
export const ui = new UI()
export const bg = new Background()
export const algorithmGraphic = new PIXI.Graphics()

export class GameApp extends PIXI.Application {
    searchAlgorithms: SearchAlgorithmBase[]
    currentSearchAlgorithmIndex: number

    constructor(parent: HTMLElement, width: number, height: number) {
        super({ width, height, backgroundColor: 0x832334, antialias: true })
        parent.replaceChild(this.view, parent.lastElementChild) // Hack for parcel HMR

        this.stage.hitArea = this.screen;
        this.stage.interactive = true

        for (let i = 0; i < N_INITIAL_NODES; i++) {
            nodes.addNode(
                Math.floor(Math.random() * this.screen.width),
                Math.floor(Math.random() * this.screen.height),
                { triggerOnNodesChange: false }
            )
        }


        this.stage.addChild(bg)

        this.searchAlgorithms = []
        this.searchAlgorithms.push(new InOrderAlgorithm())
        this.searchAlgorithms.push(new RandomPathAlgorithm())
        this.searchAlgorithms.push(new HeapsCombinations())
        this.searchAlgorithms.push(new AntColonyAlgorithm())


        this.currentSearchAlgorithmIndex = 0
        this.searchAlgorithms[this.currentSearchAlgorithmIndex].reset()
        this.searchAlgorithms[this.currentSearchAlgorithmIndex].start()

        // this.stage.addChild(this.searchAlgorithms[this.currentSearchAlgorithmIndex])

        this.stage.addChild(algorithmGraphic)
        this.stage.addChild(nodes.graphic)
        this.stage.addChild(ui)

        document.body.onresize = () => {
            this.resizeRenderer()
        }
        this.resizeRenderer()
    }

    setAlgorithm(index: number) {
        const wasRunning = this.searchAlgorithms[this.currentSearchAlgorithmIndex].isRunning
        this.searchAlgorithms[this.currentSearchAlgorithmIndex].stop()

        this.currentSearchAlgorithmIndex = index
        if (this.currentSearchAlgorithmIndex >= this.searchAlgorithms.length)
            this.currentSearchAlgorithmIndex = 0

        if (this.currentSearchAlgorithmIndex < 0)
            this.currentSearchAlgorithmIndex = this.searchAlgorithms.length - 1

        this.searchAlgorithms[this.currentSearchAlgorithmIndex].reset()

        if (wasRunning)
            this.searchAlgorithms[this.currentSearchAlgorithmIndex].start()
    }

    nextAlgorithm() {
        this.setAlgorithm(this.currentSearchAlgorithmIndex + 1)
    }
    previousAlgorithm() {
        this.setAlgorithm(this.currentSearchAlgorithmIndex - 1)
    }

    onNodesChange() {
        // console.clear()
        this.searchAlgorithms[this.currentSearchAlgorithmIndex].reset()
        if(this.searchAlgorithms[this.currentSearchAlgorithmIndex].isRunning)
        this.searchAlgorithms[this.currentSearchAlgorithmIndex].start()
    }

    togglePlayPause() {
        if (this.searchAlgorithms[this.currentSearchAlgorithmIndex].isRunning)
            this.searchAlgorithms[this.currentSearchAlgorithmIndex].stop()
        else
            this.searchAlgorithms[this.currentSearchAlgorithmIndex].start()
    }

    resizeRenderer() {
        if (!this || !this.renderer)
            return

        this.renderer.resize(window.innerWidth, window.innerHeight)

        ui.resize()
    }

}
