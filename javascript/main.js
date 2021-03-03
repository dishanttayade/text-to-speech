//Init speechsynth API
let synth = window.speechSynthesis;

// DOM elements
let textForm = document.querySelector('form');
let textInput = document.querySelector('#text-input');
let voiceSelect = document.querySelector('#voice-select');
let rate = document.querySelector('#rate');
let rateValue = document.querySelector('#rate-value');
let pitch = document.querySelector('#pitch');
let pitchValue = document.querySelector('#pitch-value');
let body = document.querySelector('body');

//Init voices  array
let voices = [];

let getVoices = () => {
    voices = synth.getVoices();

    // loop through voices and create an option for each one
    voices.forEach(voice =>{
        //create option element
        let option = document.createElement('option');
        // fill the option with voiceans language
        option.textContent = voice.name + '(' + voice.lang + ')';
        
        //Set needed option attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);

    });
};

getVoices();
if(synth.onvoiceschanged !== undefined ){
    synth.onvoiceschanged = getVoices;
} 

//Speak
let speak = () => {
 
    //Cheak if speaking
    if(synth.speaking){
        console.error('Already speaking....');
        return;
    }
    if(textInput.value !== ''){
        body.style.background = '#141414 url(images/wave.gif)';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '100% 100%';
        body.style.color = 'white';

        // Get speak text
        let speakText = new SpeechSynthesisUtterance(textInput.value);
        //Speak end
        speakText.onend = e => {
            console.log('Done speaking....');
            body.style.background = 'url(images/bg.png)';
            body.style.color = 'black';
        }

        // Speak error
        speakText.onerror = e => {
            console.error('Something went wrong');
        }

        // Selected voices
        let selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

        // Loop through voices
        voices.forEach(voice=>{
            if(voice.name === selectedVoice){
                speakText.voice = voice;
            }
        });

        // Set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        // Speak
        synth.speak(speakText);

        speakText.onpause = e => {
            console.log('paused');
        }
    }
};

// Event Listners

// Text form submit
textForm.addEventListener('submit', e =>{
    e.preventDefault();
    speak();
    textInput.blur();
})

//rate value change
rate.addEventListener('change', e => (rateValue.textContent = rate.value));

// Pitch value change
pitch.addEventListener('change', e => (pitchValue.textContent = pitch.value));

// voice select change
voiceSelect.addEventListener('change', e => speak());
