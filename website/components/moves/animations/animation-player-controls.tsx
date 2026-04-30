import { AnimationControls } from './animation-controls';
import { useAnimationPlayer } from './animation-player-context';

export const AnimationPlayerControls = () => {
  const {
    frameCounter,
    totalFrames,
    isPlaying,
    playbackSpeed,
    useGif,
    showAdditionalControls,
    onPlay,
    onPause,
    onNextFrame,
    onPreviousFrame,
    onGoToFrame,
    onPlaybackSpeedChange,
    move,
  } = useAnimationPlayer();

  return (
    <AnimationControls
      frameCounter={frameCounter}
      totalFrames={totalFrames}
      isPlaying={isPlaying}
      playbackSpeed={playbackSpeed}
      onPlay={onPlay}
      onPause={onPause}
      onNextFrame={onNextFrame}
      onPreviousFrame={onPreviousFrame}
      onGoToFrame={onGoToFrame}
      showPlaybackSpeed={!useGif}
      onPlaybackSpeedChange={onPlaybackSpeedChange}
      showFirstLastButtons={showAdditionalControls}
      onGoToFirstFrame={() => onGoToFrame(1)}
      onGoToLastFrame={() => {
        if (totalFrames > 0) {
          onGoToFrame(totalFrames);
        }
      }}
      move={move}
    />
  );
};
