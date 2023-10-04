import * as PIXI from 'pixi.js'
import { Nodes } from './node/Nodes';
import { RandomPathAlgorithm } from './Search Algorithms/RandomPath';
import { AlgorithmSpeed, SearchAlgorithmBase } from './Search Algorithms/SearchAlgorithmBase';
import { UI } from './ui/ui';
import { Background, BgChangeDirection } from './Background';
import Cookies from "js-cookie";
import { CHANGE_ALGORITHM_TRANSITION_DURATION, Theme, bg, nodes, searchAlgorithms, ui } from '../main';
import { ease } from 'pixi-ease';

const N_INITIAL_NODES = 10

export const algorithmGraphic = new PIXI.Graphics()
export const appBgColor = 0x121212

export class GameApp extends PIXI.Application {
    static theme: Theme
    static currentSearchAlgorithmName: string

    constructor(parent: HTMLElement, width: number, height: number) {
        super({ width, height, backgroundColor: appBgColor, antialias: true })
        parent.replaceChild(this.view, parent.lastElementChild) // Hack for parcel HMR

        // console.log("START")
        this.stage.hitArea = this.screen;
        this.stage.interactive = true

        // setTimeout(() => {
        //     // console.log("REMOVE COOKIES")
        //     Cookies.remove("algorithmSpeed")
        //     Cookies.remove("currentSearchAlgorithmName")
        //     Cookies.remove("nodesPositions")
        // }, 1000);

        setTimeout(() => {
            if (nodes.numNodes === 0) {
                for (let i = 0; i < N_INITIAL_NODES; i++) {
                    nodes.addNode(
                        undefined,
                        undefined,
                        { triggerOnNodesChange: i === N_INITIAL_NODES - 1 }
                    )
                }
            }

            var algorithmToRun = Cookies.get("currentSearchAlgorithmName")
            if (!algorithmToRun)
                algorithmToRun = "Ant colony optimization"

            this.setAlgorithm(algorithmToRun)
            // searchAlgorithms[GameApp.currentSearchAlgorithmName].algorithm.reset()
            // this.startAlgorithm()

            // this.stage.addChild(this.searchAlgorithms[this.currentSearchAlgorithmIndex])
            var algorithmSpeed = Cookies.get("algorithmSpeed")
            if (!algorithmSpeed)
                algorithmSpeed = "normal"
            this.changeAlgorithmSpeed(algorithmSpeed as AlgorithmSpeed)


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
        ui.changeTheme(algorithmName, direction)
        nodes.changeNodesColor(direction === 'instant')
        ease.add(algorithmGraphic, { blend: [algorithmGraphic.tint, theme.mainColor] }, { duration: CHANGE_ALGORITHM_TRANSITION_DURATION })
    }

    changeAlgorithmSpeed(newSpeed: AlgorithmSpeed) {
        // console.log("changeAlgorithmSpeed")
        Cookies.set("algorithmSpeed", newSpeed)
        ui.changeSpeedGraphic(newSpeed)
        SearchAlgorithmBase.speed = newSpeed
    }

    setAlgorithm(name: string, direction: BgChangeDirection = "instant") {
        const newAlgorithmToRun = searchAlgorithms[name]
        if (!newAlgorithmToRun) {
            console.warn("algorithm", name, "not found")
            return
        }
        var wasPrevAlgorithmRunning: boolean = true
        if (GameApp.currentSearchAlgorithmName) {
            const prevAlgorithmRunning = searchAlgorithms[GameApp.currentSearchAlgorithmName].algorithm
            wasPrevAlgorithmRunning = prevAlgorithmRunning.isRunning
            prevAlgorithmRunning.stop()
        }

        newAlgorithmToRun.algorithm.computeFirstGen()
        newAlgorithmToRun.algorithm.drawGeneration()
        ui.setGenNumText(newAlgorithmToRun.algorithm.generations.length)

        // newAlgorithmToRun.algorithm.reset()
        if (wasPrevAlgorithmRunning)
            newAlgorithmToRun.algorithm.start()

        GameApp.currentSearchAlgorithmName = name
        GameApp.theme = newAlgorithmToRun.theme
        this.changeTheme(GameApp.currentSearchAlgorithmName, newAlgorithmToRun.theme, direction)
        ui.changeAlgorithmOptions(newAlgorithmToRun.algorithm.options, direction)

        Cookies.set("currentSearchAlgorithmName", name)
    }

    nextAlgorithm() {
        const algorithmsList = Object.keys(searchAlgorithms)
        for (let i = 0; i < algorithmsList.length; i++) {
            if (algorithmsList[i] === GameApp.currentSearchAlgorithmName) {
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
            if (algorithmsList[i] === GameApp.currentSearchAlgorithmName) {
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
        const algorithms = Object.values(searchAlgorithms)
        for (let i = 0; i < algorithms.length; i++) {
            algorithms[i].algorithm.reset()
        }

        const currentAlgorithm = searchAlgorithms[GameApp.currentSearchAlgorithmName]?.algorithm

        if (!currentAlgorithm)
            return

        currentAlgorithm.reset()
        currentAlgorithm.computeFirstGen()
        currentAlgorithm.updateBestDist()
        currentAlgorithm.drawGeneration()
        ui.setGenNumText(currentAlgorithm.generations.length)

        // searchAlgorithms[GameApp.currentSearchAlgorithmName].algorithm.drawGeneration(0)

        if (currentAlgorithm.isRunning)
            currentAlgorithm.start()
    }

    stopAlgorithm() {
        searchAlgorithms[GameApp.currentSearchAlgorithmName].algorithm.stop()
        ui.startStopButton.setPlay()
    }
    startAlgorithm() {
        searchAlgorithms[GameApp.currentSearchAlgorithmName].algorithm.start()
        ui.startStopButton.setStop()
    }

    showPrevGen() {
        const currentAlgorithm = searchAlgorithms[GameApp.currentSearchAlgorithmName].algorithm
        // console.log("showPrevGen", currentAlgorithm.currentGenNum, currentAlgorithm.generations[currentAlgorithm.currentGenNum - 1])
        currentAlgorithm.drawPrevGen()
    }
    showNextGen() {
        // console.log("showNextGen")
        const currentAlgorithm = searchAlgorithms[GameApp.currentSearchAlgorithmName].algorithm
        currentAlgorithm.drawNextGen()
    }

    resizeRenderer() {
        if (!this || !this.renderer)
            return

        this.renderer.resize(window.innerWidth, window.innerHeight)

        ui.resize()
        bg.resize()
    }

}
