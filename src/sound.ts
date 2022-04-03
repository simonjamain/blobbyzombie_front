export class Sound {
  audio = new Audio('../assets/audio.mp3');
  over = new Audio('../assets/over.mp3');
  menu = new Audio('../assets/menu.mp3');

  bpm = 128;
  measuresPerCycle = 8;
  chordsPerCycle = 4;
  beatsPerMeasure = 4;
  numberOfCycles = 10;
  beatsPerCycle = this.measuresPerCycle * this.beatsPerMeasure;
  cycleDurationInSeconds = (this.beatsPerCycle / this.bpm) * 60;
  currentCycle = 0;
  interval = 0;

  hits = Array(this.chordsPerCycle)
    .fill(undefined)
    .map((_, index) => new Audio(`../assets/hit${index}.mp3`));

  constructor() {
    this.menu.volume = 0.1;
    console.log('sdfsd')
  }

  // progression.addEventListener('click', () => {
  //   const progressionFactor = parseFloat(prompt('Progression du jeu entre 0 (début) et 1 (hors jeu) ?'));
  //   progressTo(progressionFactor);
  // });

  // hit.addEventListener('click', () => {
  //   const progressionFactor = parseFloat(prompt('Progression du jeu entre 0 (début) et 1 (hors jeu) ?'));
  //   playHit();

  //   setTimeout(() => {
  //     progressTo(progressionFactor);
  //   }, 250);
  // });

  // game_over.addEventListener('click', () => {
  //   audio.pause();
  //   over.play();

  //   setTimeout(() => {
  //     progressTo(1);
  //   }, 2500);
  // });

  goToCycle(cycle: number) {
    if (cycle >= this.numberOfCycles) {
      return;
    }

    this.currentCycle = cycle;
    console.log(`Now playing cycle ${this.currentCycle}`);

    this.audio.currentTime = (this.cycleDurationInSeconds * this.currentCycle) + this.getPlayPositionInCycle();
  }

  // playHit() {
  //   currentMeasure = Math.ceil((getPlayPositionInCycle() / cycleDurationInSeconds) * chordsPerCycle) || 1;
  //   console.log(`Current measure is ${currentMeasure}`);

  //   const hit = hits[currentMeasure - 1].cloneNode();
  //   hit.volume = 0.3;
  //   hit.play();
  // }

  getPlayPositionInCycle() {
    return this.audio.currentTime % this.cycleDurationInSeconds;
  }

  // refreshInterval() {
  //   if (interval) {
  //     clearInterval(interval);
  //   }

  //   interval = setInterval(() => {
  //     if (currentCycle < currentCycle - 1) {
  //       currentCycle++;

  //       console.log(`Now playing cycle ${currentCycle}`);
  //     }
  //   }, cycleDurationInSeconds * 1000);
  // }

  progressTo(progressionFactor: number) {
    console.log('progress to', progressionFactor);

    if (progressionFactor === 1) {
      this.audio.pause();
      this.menu.currentTime = 0;
      this.menu.play();
    } else {
      if (this.audio.paused) {
        console.log('set current time 0');
        this.audio.currentTime = 0;
        this.currentCycle = 0;
        this.audio.play();
        this.menu.pause();
      }

      const cycleMatchingProgression = Math.floor(this.numberOfCycles * progressionFactor);

      if (cycleMatchingProgression > this.currentCycle) {
        this.goToCycle(cycleMatchingProgression);
      }
    }
  }
}
