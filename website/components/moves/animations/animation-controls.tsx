import { Button } from '@heroui/button';
import { Kbd } from '@heroui/kbd';
import { Select, SelectItem } from '@heroui/select';

export interface AnimationControlsProps {
  /**
   * Current frame number (1-indexed)
   */
  frameCounter: number;

  /**
   * Total number of frames
   */
  totalFrames: number;

  /**
   * Whether the animation is currently playing
   */
  isPlaying: boolean;

  /**
   * Callback when play button is pressed
   */
  onPlay: () => void;

  /**
   * Callback when pause button is pressed
   */
  onPause: () => void;

  /**
   * Callback when next frame button is pressed
   */
  onNextFrame: () => void;

  /**
   * Callback when previous frame button is pressed
   */
  onPreviousFrame: () => void;

  /**
   * Callback when a specific frame is selected
   */
  onGoToFrame?: (frameNumber: number) => void;

  /**
   * Optional: Show playback speed controls
   */
  showPlaybackSpeed?: boolean;

  /**
   * Optional: Callback for playback speed changes
   */
  onPlaybackSpeedChange?: (speed: number) => void;

  /**
   * Optional: Show first/last frame buttons
   */
  showFirstLastButtons?: boolean;

  /**
   * Optional: Callback when first frame button is pressed
   */
  onGoToFirstFrame?: () => void;

  /**
   * Optional: Callback when last frame button is pressed
   */
  onGoToLastFrame?: () => void;
}

export const AnimationControls = ({
  frameCounter,
  totalFrames,
  isPlaying,
  onPlay,
  onPause,
  onNextFrame,
  onPreviousFrame,
  showPlaybackSpeed = false,
  onPlaybackSpeedChange,
  showFirstLastButtons = false,
  onGoToFirstFrame,
  onGoToLastFrame,
}: AnimationControlsProps) => {
  const nextFrame = () => {
    onPause();
    onNextFrame();
  };

  const previousFrame = () => {
    onPause();
    onPreviousFrame();
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {isPlaying ? (
        <Button onPress={onPause} aria-label="Pause animation" startContent={<Kbd keys={['space']} />}>
          Pause
        </Button>
      ) : (
        <Button onPress={onPlay} aria-label="Play animation" startContent={<Kbd keys={['space']} />}>
          Play
        </Button>
      )}

      <Button disableAnimation aria-label="Frame counter" disableRipple>
        Frame: {frameCounter} {totalFrames > 0 && `of ${totalFrames}`}
      </Button>

      <Button onPress={previousFrame} aria-label="Previous frame" startContent={<Kbd keys={['left']} />}>
        Previous Frame
      </Button>

      <Button onPress={nextFrame} aria-label="Next frame" startContent={<Kbd keys={['right']} />}>
        Next Frame
      </Button>

      <Select
        defaultSelectedKeys={['0.2']}
        isDisabled={!showPlaybackSpeed}
        onSelectionChange={(value) => {
          const speed = Number(value.currentKey);
          onPlaybackSpeedChange?.(speed);
        }}
        aria-label="Playback speed"
      >
        <SelectItem key={'0.2'}>12 FPS (Default)</SelectItem>
        <SelectItem key={'1'}>60 FPS (In-game speed)</SelectItem>
      </Select>

      <Button>Report issue</Button>

      {showFirstLastButtons && (
        <Button onPress={onGoToFirstFrame} aria-label="First frame">
          First Frame
        </Button>
      )}

      {showFirstLastButtons && (
        <Button onPress={onGoToLastFrame} aria-label="Last frame">
          Last Frame
        </Button>
      )}
    </div>
  );
};
