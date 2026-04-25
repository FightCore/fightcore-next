import { Move } from '@/models/move';
import { AnimationDisplay } from './animation-display';
import { AnimationPlayerProvider } from './animation-player-context';
import { AnimationPlayerControls } from './animation-player-controls';

interface AnimationPlayerProps {
  move: Move;
  characterName: string;
  showAdditionalControls?: boolean;
  apngUrl?: string;
  preferGif?: boolean;
}

export const AnimationPlayer = ({
  move,
  characterName,
  showAdditionalControls = false,
  apngUrl,
  preferGif = false,
}: AnimationPlayerProps) => {
  return (
    <AnimationPlayerProvider
      move={move}
      characterName={characterName}
      showAdditionalControls={showAdditionalControls}
      apngUrl={apngUrl}
      preferGif={preferGif}
    >
      <AnimationDisplay />
      <AnimationPlayerControls />
    </AnimationPlayerProvider>
  );
};
