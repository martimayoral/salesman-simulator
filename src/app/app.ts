import * as PIXI from 'pixi.js'
import { Nodes } from './node/Nodes';
import { RandomPathAlgorithm } from './Search Algorithms/RandomPath';
import { SearchAlgorithmBase } from './Search Algorithms/SearchAlgorithmBase';
import { UI } from './ui';
import { Background } from './Background';
import { InOrderAlgorithm } from './Search Algorithms/InOrderAlgorithm';
import { HeapsCombinations } from './Search Algorithms/HeapsCombinations';
import { AntColonyAlgorithm } from './Search Algorithms/AntColonyAlgorithm';

const N_INITIAL_NODES = 10

export const nodes = new Nodes()
export const ui = new UI()
export const bg = new Background()

export class GameApp extends PIXI.Application {
    searchAlgorithm: SearchAlgorithmBase

    constructor(parent: HTMLElement, width: number, height: number) {
        super({ width, height, backgroundColor: 0x232334, antialias: true })
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
        // this.searchAlgorithm = this.stage.addChild(new InOrderAlgorithm())
        // this.searchAlgorithm = this.stage.addChild(new RandomPathAlgorithm())
        // this.searchAlgorithm = this.stage.addChild(new HeapsCombinations())
        this.searchAlgorithm = this.stage.addChild(new AntColonyAlgorithm())
        this.stage.addChild(nodes.graphic)
        this.stage.addChild(ui)

        document.body.onresize = () => this.resizeRenderer()
        this.resizeRenderer()
    }

    onNodesChange() {
        // console.clear()
        this.searchAlgorithm.start()
    }

    resizeRenderer() {
        if (!this || !this.renderer)
            return

        this.renderer.resize(window.innerWidth, window.innerHeight)

    }

}
