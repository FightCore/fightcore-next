import { AnimationCredit as AnimationCreditModel } from '@/models/animation-credit';

export interface AnimationCreditProps {
  credit: AnimationCreditModel;
}

export const AnimationCredit = ({ credit }: AnimationCreditProps) => {
  // TODO: Implement animation credit on the data side.
  return (
    <div>
      <span className="text-muted text-sm">
        Animation by{' '}
        <a target="_blank" rel="noopener noreferrer" href={credit.url} className="text-accent underline">
          {credit.name}
        </a>
      </span>
    </div>
  );
};
