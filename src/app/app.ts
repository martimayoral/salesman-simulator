import * as PIXI from 'pixi.js'
import { Nodes } from './node/Nodes';
import { RandomPathAlgorithm } from './Search Algorithms/RandomPath';
import { SearchAlgorithmBase } from './Search Algorithms/SearchAlgorithmBase';
import { UI } from './ui/ui';
import { Background, BgChangeDirection } from './Background';
import { InOrderAlgorithm } from './Search Algorithms/InOrderAlgorithm';
import { HeapsCombinations } from './Search Algorithms/HeapsCombinations';
import { AntColonyAlgorithm } from './Search Algorithms/AntColonyAlgorithm';
import Cookies from "js-cookie";
import { CHANGE_ALGORITHM_TRANSITION_DURATION, Theme, bg, nodes, searchAlgorithms, ui } from '../main';
import { ease } from 'pixi-ease';

const N_INITIAL_NODES = 10

export const algorithmGraphic = new PIXI.Graphics()
export const appBgColor = 0x121212

export class GameApp extends PIXI.Application {
    static theme: Theme
    currentSearchAlgorithmName: string

    constructor(parent: HTMLElement, width: number, height: number) {
        super({ width, height, backgroundColor: appBgColor, antialias: true })
        parent.replaceChild(this.view, parent.lastElementChild) // Hack for parcel HMR

        this.stage.hitArea = this.screen;
        this.stage.interactive = true

        if (nodes.numNodes === 0)
            for (let i = 0; i < N_INITIAL_NODES; i++) {
                nodes.addNode(
                    Math.floor(Math.random() * this.screen.width),
                    Math.floor(Math.random() * this.screen.height),
                    { triggerOnNodesChange: false }
                )
            }


        setTimeout(() => {
            var algorithmToRun = Cookies.get("currentSearchAlgorithmName")
            if (!algorithmToRun)
                algorithmToRun = "Heaps combinations"

            this.setAlgorithm(algorithmToRun)
            // searchAlgorithms[this.currentSearchAlgorithmName].algorithm.reset()
            // this.startAlgorithm()

            // this.stage.addChild(this.searchAlgorithms[this.currentSearchAlgorithmIndex])

            this.stage.addChild(bg)
            this.stage.addChild(algorithmGraphic)
            this.stage.addChild(nodes.graphic)
            this.stage.addChild(ui)
            this.resizeRenderer()
        })

        document.body.onresize = () => {
            this.resizeRenderer()
        }
    }

    changeTheme(algorithmName: string, theme: Theme, direction: BgChangeDirection = "instant") {
        bg.changeBg(theme.bgColor, direction)
        ui.changeTheme(algorithmName, theme, direction)
        nodes.changeNodesColor()
        ease.add(algorithmGraphic, { blend: [algorithmGraphic.tint, theme.mainColor] }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION })
    }

    setAlgorithm(name: string, direction: BgChangeDirection = "instant") {
        const newAlgorithmToRun = searchAlgorithms[name]
        if (!newAlgorithmToRun) {
            console.warn("algorithm", name, "not found")
            return
        }
        var wasPrevAlgorithmRunning: boolean = true
        if (this.currentSearchAlgorithmName) {
            const prevAlgorithmRunning = searchAlgorithms[this.currentSearchAlgorithmName].algorithm
            wasPrevAlgorithmRunning = prevAlgorithmRunning.isRunning
            prevAlgorithmRunning.stop()
        }


        newAlgorithmToRun.algorithm.reset()
        if (wasPrevAlgorithmRunning)
            newAlgorithmToRun.algorithm.start()

        this.currentSearchAlgorithmName = name
        GameApp.theme = newAlgorithmToRun.theme
        this.changeTheme(this.currentSearchAlgorithmName, newAlgorithmToRun.theme, direction)

        Cookies.set("currentSearchAlgorithmName", name)
    }

    nextAlgorithm() {
        const algorithmsList = Object.keys(searchAlgorithms)
        for (let i = 0; i < algorithmsList.length; i++) {
            if (algorithmsList[i] === this.currentSearchAlgorithmName) {
                if (i + 1 < algorithmsList.length)
                    this.setAlgorithm(algorithmsList[i + 1], "right")
                else
                    this.setAlgorithm(algorithmsList[0], "right")
                return
            }
        }
    }
    previousAlgorithm() {
        const algorithmsList = Object.keys(searchAlgorithms)
        for (let i = 0; i < algorithmsList.length; i++) {
            if (algorithmsList[i] === this.currentSearchAlgorithmName) {
                if (i - 1 >= 0)
                    this.setAlgorithm(algorithmsList[i - 1], "left")
                else
                    this.setAlgorithm(algorithmsList[algorithmsList.length - 1], "left")
                return
            }
        }

    }

    onNodesChange() {
        // console.clear()
        searchAlgorithms[this.currentSearchAlgorithmName].algorithm.reset()
        if (searchAlgorithms[this.currentSearchAlgorithmName].algorithm.isRunning)
            searchAlgorithms[this.currentSearchAlgorithmName].algorithm.start()
    }

    stopAlgorithm() {
        searchAlgorithms[this.currentSearchAlgorithmName].algorithm.stop()
        ui.startStopButton.setStop()
    }
    startAlgorithm() {
        searchAlgorithms[this.currentSearchAlgorithmName].algorithm.start()
        ui.startStopButton.setPlay()
    }

    resizeRenderer() {
        if (!this || !this.renderer)
            return

        this.renderer.resize(window.innerWidth, window.innerHeight)

        ui.resize()
        bg.resize()
    }

}
