import { Background } from "./app/Background";
import { AntColonyAlgorithm } from "./app/Search Algorithms/AntColonyAlgorithm";
import { HeapsCombinations } from "./app/Search Algorithms/HeapsCombinations";
import { InOrderAlgorithm } from "./app/Search Algorithms/InOrderAlgorithm";
import { RandomPathAlgorithm } from "./app/Search Algorithms/RandomPath";
import { SearchAlgorithmBase } from "./app/Search Algorithms/SearchAlgorithmBase";
import { GameApp } from "./app/app";
import { Nodes } from "./app/node/Nodes";
import { UI } from "./app/ui/ui";

export const CHANGE_ALGORITHM_TRANSITION_DURATION = 500

export const nodes = new Nodes()

export const gameApp = new GameApp(document.body, window.innerWidth, window.innerHeight);
export const ui = new UI()
export const bg = new Background()

export interface Theme {
    bgColor: number
    mainColor: number
    secondaryColor: number
    contrastColor: number
}

export const searchAlgorithms: {
    [key: string]: {
        algorithm: SearchAlgorithmBase,
        theme: Theme
    }
} = {
    "In order": {
        algorithm: new InOrderAlgorithm("In order"),
        theme: {
            bgColor: 0xA4BC92,
            mainColor: 0xDDFFBB,
            secondaryColor: 0xC7E9B0,
            contrastColor: 0x000000
        }
    },
    "Random path": {
        algorithm: new RandomPathAlgorithm("Random path"),
        theme: {
            bgColor: 0x424874,
            mainColor: 0xF4EEFF,
            secondaryColor: 0xDCD6F7,
            contrastColor: 0xA6B1E1
        }
    },
    "Heaps combinations": {
        algorithm: new HeapsCombinations("Heaps combinations"),
        theme: {
            bgColor: 0x8EC3B0,
            mainColor: 0xDEF5E5,
            secondaryColor: 0xBCEAD5,
            contrastColor: 0x9ED5C5
        }
    },
    "Ant colony optimization": {
        algorithm: new AntColonyAlgorithm("Ant colony optimization"),
        theme: {
            bgColor: 0xAA4A30,
            mainColor: 0xEDCFA9,
            secondaryColor: 0xE89F71,
            contrastColor: 0xD57149
        }
    },
}