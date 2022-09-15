const audioLaser = new Audio('assets/audio/laserShoot.wav');
const audioLaserPlaying: Boolean = false;
const audioExplosion = new Audio('assets/audio/explosion.wav');
const audioExplosionPlaying: Boolean = false;
const audioCoin = new Audio('assets/audio/pickupCoin.wav');
const audioCoinPlaying: Boolean = false;
const introTheme = new Audio('assets/audio/ambientmain_0.ogg');
const introThemePlaying: Boolean = false;

export function playSoundEffect(effectName: string) {
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

export function playSong(song: string) {
  switch (song) {
    case "introTheme":
      introTheme.volume = 0.5;
      playSound(introTheme, introThemePlaying);
      break;
  }
}

function playSound(sound: any, playing: Boolean) {
  if (!playing) {
    sound.play();
    playing = true;
  }
}