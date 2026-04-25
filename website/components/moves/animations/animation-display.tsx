import { useAnimationPlayer } from './animation-player-context';
import ApngMove from './apng-move-gif';
import { MoveGif } from './move-gif';

export const AnimationDisplay = () => {
  const { useGif, move, characterName, apngUrl, showAdditionalControls, onApngError } = useAnimationPlayer();

  if (useGif) {
    return <MoveGif move={move} characterName={characterName} />;
  }

  return (
    <ApngMove
      url={apngUrl || move.pngUrl!}
      showAdditionalControls={showAdditionalControls}
      onError={onApngError}
    />
  );
};
