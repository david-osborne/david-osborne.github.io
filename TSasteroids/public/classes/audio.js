const audioLaser = new Audio('assets/audio/laserShoot.wav');
const audioLaserPlaying = false;
const audioExplosion = new Audio('assets/audio/explosion.wav');
const audioExplosionPlaying = false;
const audioCoin = new Audio('assets/audio/pickupCoin.wav');
const audioCoinPlaying = false;
const introTheme = new Audio('assets/audio/ambientmain_0.ogg');
const introThemePlaying = false;
export function playSoundEffect(effectName) {
    switch (effectName) {
        case "laser":
            playSound(audioLaser, audioLaserPlaying);
            break;
        case "explosion":
            playSound(audioExplosion, audioExplosionPlaying);
            break;
        case "coin":
            playSound(audioCoin, audioCoinPlaying);
            break;
    }
}
export function playSong(song) {
    switch (song) {
        case "introTheme":
            introTheme.volume = 0.5;
            playSound(introTheme, introThemePlaying);
            break;
    }
}
function playSound(sound, playing) {
    if (!playing) {
        sound.play();
        playing = true;
    }
}
//# sourceMappingURL=audio.js.map