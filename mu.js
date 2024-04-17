
function O() {
    const audioContext = new AudioContext();
    const gainNode = audioContext.createGain();
    const frequencies = [
      18, 18, 18, 13, 23, 15, 18, 18, 18, 13, 13, 13, 8, 18, 10, 13, 13, 13, 6, 6,
      6, 3, 9, 5, 6, 6, 6, 8, 10, 12, 11, 14, 12, 17, 17, 17, 12, 22, 14, 17, 16,
      17, 18, 17, 17, 12, 22, 14, 17, 17, 17, 13, 8, 8, 8, 3, 13, 5, 8, 8, 8, 9,
      11, 15, 13, 13, 13, 8, 18, 10, 13, 13, 13, 16, 18, 18, 18, 13, 23, 15, 18,
      18, 18, 8, 8, 8, 3, 13, 5, 8, 8, 8, 9, 11, 15,
    ];
  
    gainNode.gain.value = 0.1
    for (let i = 0; i < frequencies.length; i++) {
      const oscillatorNode = audioContext.createOscillator();
  
      if (frequencies[i]) {
        oscillatorNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
  
        const startTime = i * 0.1;
        const frequency = 440 * 1.06 ** (13 - frequencies[i]);
  
        oscillatorNode.start(startTime);
        oscillatorNode.stop(startTime + 0.09);
  
        oscillatorNode.frequency.setValueAtTime(frequency, startTime);
        oscillatorNode.type = "sawtooth";
        gainNode.gain.setValueAtTime(1, startTime);
        gainNode.gain.setTargetAtTime(0.0001, startTime + 0.08, 0.005);
      }
    }
  }
  O()
  setInterval(() => {
    O();
  }, 9500);
  