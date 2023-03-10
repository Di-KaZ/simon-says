import {get, writable} from "svelte/store";
import {sendNotification} from "./notifications";

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent


const vocab = '#JSGF V1.0; grammar colors; public <color> = bleu | vert | rouge | jaune;';
const recognition = new SpeechRecognition();
const list = new SpeechGrammarList();
list.addFromString(vocab, 1);
recognition.grammars = list;
recognition.continuous = true;
recognition.lang = 'fr-FR';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

export function playWithVoice() {
    recognition.start();
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class Colors {
    public static readonly red = new Colors('rouge', 'bg-red-500', 'bg-red-800 scale-90', 'rounded-tl-full');
    public static readonly blue = new Colors('bleu', 'bg-blue-500', 'bg-blue-800 scale-90', 'rounded-tr-full');
    public static readonly green = new Colors('vert', 'bg-green-500', 'bg-green-800 scale-90', 'rounded-bl-full');
    public static readonly yellow = new Colors('jaune', 'bg-yellow-500', 'bg-yellow-800 scale-90', 'rounded-br-full');
    public static readonly ALL = [Colors.red, Colors.blue, Colors.green, Colors.yellow];

    private constructor(public readonly color: string, public readonly inactive: string, public readonly active: string, public readonly position: string) {
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

let idx = 0;

export function answerListener(color: Colors) {
    if (checkColor(color)) simonSay();
}

export function statusListener() {
    if (get(status) === SimonStatus.answering) {
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const guessedColor = event.results[idx][0].transcript.toLowerCase();
            const color =
                Colors.ALL.find(color => guessedColor.includes(color.color));
            if (!color) {
                idx += 1;
                return;
            }
            colorPressedByPlayer.set(color);
             sleep(800).then(_ => colorPressedByPlayer.set(null));
            idx += 1;
        };
    } else {
        recognition.onresult = null;
    }
}
export function checkColor(color: Colors) {
    if (!color) return;
    const seq = get(sequence);
    const idx = get(idxOfColorToCheck);
    if (seq[idx] !== color) {
        status.set(SimonStatus.lost);
        sendNotification(`You lasted ${get(round)} round(s) !\nTry again ????????`)
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