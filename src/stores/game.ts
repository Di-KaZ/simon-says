import {get, writable} from "svelte/store";
import colors from "tailwindcss/colors";
import {sendNotification} from "./notifications";

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class Colors {
    public static readonly red = new Colors('red', 'bg-red-500 active:bg-red-800',  'bg-red-800 scale-90', 'col-start-2 ');
    public static readonly blue = new Colors('blue', 'bg-blue-500 active:bg-blue-800',  'bg-blue-800 scale-90', 'col-start-3 row-start-2');
    public static readonly green = new Colors('green', 'bg-green-500 active:bg-green-800',  'bg-green-800 scale-90', 'row-start-2');
    public static readonly yellow = new Colors('yellow', 'bg-yellow-500 active:bg-yellow-800',  'bg-yellow-800 scale-90', 'col-start-2 row-start-3');
    public static readonly ALL = [Colors.red, Colors.blue, Colors.green, Colors.yellow];

    private constructor(public readonly color: string, public readonly classNames: string, public readonly activeByBot: string,public readonly  position: string) {
    }
}

export enum SimonStatus {
    initial,
    saying,
    answering,
    lost,
}
export const status = writable<SimonStatus>(SimonStatus.initial);
export const sequence = writable<Colors[]>([]);
export const round = writable(1);
export const bestRound = writable(1);
export const colorPressedByBot = writable<Colors | null>(null);
export const colorPressedByPlayer = writable<Colors | null>(null);
export const idxOfColorToCheck = writable(0);

export function vibrate() {
    navigator.vibrate(200);
}

export function answerListener(color: Colors) {
    if (checkColor(color)) simonSay();
}

const vocab = '#JSGF V1.0; grammar colors; public <color> = bleu | vert | rouge | jaune;';

const recognition = new SpeechRecognition();
const list = new SpeechGrammarList();
list.addFromString(vocab, 1);
recognition.grammars = list;
recognition.lang = 'fr-FR';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

export function playWithVoice() {
    recognition.start()
    recognition.onresult = (event: SpeechRecognitionEvent) => {
        const color = event.results[0][0].transcript;
        console.log(color);
    };
}

export function checkColor(color: Colors) {
    if (!color) return;
    const seq = get(sequence);
    const idx = get(idxOfColorToCheck);
    if (seq[idx] !== color) {
        status.set(SimonStatus.lost);
        sendNotification(`You lasted ${get(round)} round(s) !\nTry again 🤷🏿`)
        idxOfColorToCheck.set(0);
        colorPressedByPlayer.set(null);
        sequence.set([]);
        if (get(bestRound) < get(round))
            bestRound.set(get(round))
        return false;
    }
    if (idx + 1 === seq.length) {
        idxOfColorToCheck.set(0);
        round.update(round => round + 1);
        return true;
    }
    idxOfColorToCheck.set(idx + 1);
    return false;
}
function addColorToSequence(sequence: Colors[], num: number): Colors[] {
    for (let i = 0; i < num; i++) {
        sequence.push(Colors.ALL[Math.floor(Math.random() * Colors.ALL.length)])
    }
    return sequence;
}

export async function playSequence(sequence: Colors[]) {
    for (const color of sequence) {
        colorPressedByBot.set(color);
        await sleep(200);
        colorPressedByBot.set(null);
        await sleep(800);
    }
}

const notifSound = new Audio('/notification.mp3');
export async function simonSay(): Promise<void> {
    notifSound.play();
    if (get(status) === SimonStatus.lost) round.set(1);
    const seq = addColorToSequence(get(sequence), !get(sequence).length ? 4 : 1);
    status.set(SimonStatus.saying);
    await sleep(2000)
    await playSequence(seq);
    sequence.set(seq);
    status.set(SimonStatus.answering);
}