import mitt from "mitt";

type Events = {
  seek: number;
};

const emitter = mitt<Events>();

export default emitter;
