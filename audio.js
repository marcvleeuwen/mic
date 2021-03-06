let volume = 100;
let isMuted = false;
let gainNode;

function initAudio() {
    document.getElementById('volumeAmount').innerHTML = volume;
    navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;

    var ctx;
    var source;
    var destination;

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(
            { audio: true }).then((stream) => {
                ctx = isSafari() ? new webkitAudioContext() : new AudioContext();

                source = ctx.createMediaStreamSource(stream);

                // set destination to be the origin (device speakers)
                destination = ctx.destination;

                // gainNode to control volume
                gainNode = ctx.createGain();

                // connect gainNode to audio sources
                source.connect(gainNode);

                // output gainNode through speakers
                gainNode.connect(destination);

                // set initial volume based
                gainNode.gain.value = volume * 0.01;

                document.getElementById('mute').onchange((el) => {
                    gainNode.gain.value = el.value ? volume * 0.01 : 0
                });
                document.getElementById('volumeSlide').onchange((el) => {
                    gainNode.gain.value = isMuted ? 0 : volume * 0.01;
                });
            }
            ).catch((e) => {
                console.log("Error 003.")
            });
    } else {
        alert(`Your browser doesn't support the required audio API 😅`);
    }
};

function onVolumeChange(el) {
    if (!isMuted) {
        document.getElementById('volumeAmount').innerHTML = el.value;
        volume = el.value;
    }
}

function onMuteChange(el) {
    isMuted = el.checked;
    if (isMuted) {
        document.getElementById('volumeSlide').value = 0;
        document.getElementById('volumeSlide').setAttribute('disabled', true);
        document.getElementById('volumeAmount').innerHTML = 0;
    } else {
        document.getElementById('volumeSlide').value = volume;
        document.getElementById('volumeSlide').removeAttribute('disabled');
        document.getElementById('volumeAmount').innerHTML = volume;
    }
}

function isSafari() {
    return /constructor/i.test(window.HTMLElement)
        || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })
            (!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
}