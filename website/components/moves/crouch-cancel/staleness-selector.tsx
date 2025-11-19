import { useCheckbox } from '@heroui/checkbox';
import { Chip } from '@heroui/chip';
import { tv } from '@heroui/theme';
import { VisuallyHidden } from '@react-aria/visually-hidden';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StalenessSelector(props: any) {
  const checkbox = tv({
    slots: {
      base: 'border-default hover:bg-default-200',
      content: 'text-default-500',
    },
    variants: {
      isSelected: {
        true: {
          base: 'border-primary bg-primary hover:bg-primary-500 hover:border-primary-500',
          content: 'text-white pl-1',
        },
      },
      isFocusVisible: {
        true: {
          base: 'outline-none ring-2 ring-focus ring-offset-2 ring-offset-background',
        },
      },
    },
  });

  const { isSelected, isFocusVisible, getBaseProps, getLabelProps, getInputProps } = useCheckbox({
    ...props,
  });

  const styles = checkbox({ isSelected, isFocusVisible });

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        color="primary"
        variant="faded"
        radius="none"
        {...getLabelProps()}
      >
        {props.slot}
      </Chip>
    </label>
  );
}
