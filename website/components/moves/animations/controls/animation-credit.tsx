import { Move } from '@/models/move';

export interface AnimationCreditProps {
  move: Move;
}

export const AnimationCredit = ({ move }: AnimationCreditProps) => {
  // TODO: Implement animation credit on the data side.
  return (
    <div>
      <span className="text-muted text-sm">
        Animation by{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://bsky.app/profile/hrtfiend.bsky.social"
          className="text-accent underline"
        >
          Emilia
        </a>
      </span>
    </div>
  );
};
