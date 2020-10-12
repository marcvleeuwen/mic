let volume = 100;
let isMuted = false;
let gainNode;

function initAudio() {
    document.getElementById('volumeAmount').innerHTML = volume;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    isSafari();

    var ctx;
    var source;
    var destination;

    if (navigator.getUserMedia) {
        navigator.getUserMedia(
            { audio: true },
            function (stream) {
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
            },
            function () { console.log("Error 003.") }
        );
    } else {
        alert(`Your browser doesn't support the required audio API 😅`);
    }
};

function onVolumeChange(el) {
    if (!isMuted) {
        document.getElementById('volumeAmount').innerHTML = el.value;
        volume = el.value;
    }
    gainNode.gain.value = isMuted ? 0 : volume * 0.01;
}

function onMuteChange(el) {
    isMuted = el.checked;
    gainNode.gain.value = isMuted ? 0 : volume * 0.01;
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
    is = /constructor/i.test(window.HTMLElement)
        || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })
            (!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    alert(is);
    return is;
}