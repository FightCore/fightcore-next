import mitt from 'mitt';

type Events = {
  seek: number;
  play: void;
  pause: void;
  nextFrame: void;
  previousFrame: void;
  frameCounterUpdate: number;
  totalFramesUpdate: number;
  setPlaybackSpeed: number;
};

const emitter = mitt<Events>();

export default emitter;
