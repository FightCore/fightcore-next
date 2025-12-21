import { MovePropertySummary } from '@/utilities/move-summary';

export class MoveSummaryFormatter {
  private summaryFields: MovePropertySummary[] = [];

  constructor(private includeEmpty: boolean = true) {}

  public get Summary() {
    return this.summaryFields;
  }
  public addIfNotNull(
    name: string,
    value: string | number | null | undefined,
    formatter?: (value: string | number) => string,
    level?: 'warning',
    variant?: 'note' | 'knockback',
  ): void {
    if (value != null && value !== '' && value !== undefined && value !== 0) {
      if (formatter) {
        this.summaryFields.push({ name, value: formatter(value), level, variant });
      } else {
        this.summaryFields.push({ name, value: value.toString(), level, variant });
      }
    } else if (this.includeEmpty) {
      this.summaryFields.push({ name, value: '-', level, variant });
    }
  }

  public addInterpolationWarning(): void {
    this.summaryFields.push({
      name: 'Interpolated',
      value:
        'Move is interpolated: This move is based off its grounded variant, the data has not been fact checked yet and may be incorrect.',
      level: 'warning',
      variant: 'note',
    });
  }
}
