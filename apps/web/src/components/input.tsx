import { ComponentProps } from 'react';
import { Field } from '@base-ui/react/field';
import { tv, VariantProps } from 'tailwind-variants';

export const inputVariants = tv({
  base: 'font-sans font-normal transition-all',
  slots: {
    root: 'flex flex-col w-full gap-2',
    content: [
      'px-3 py-3.5 gap-3 inline-flex items-center rounded-lg border border-gray-300',
      'shadow-sm shadow-gray-200',
    ],
    label: [
      'font-medium text-sm leading-5 text-gray-700',
      'data-focused:text-brand-base data-filled:text-gray-700 data-invalid:text-feedback-danger',
    ],
    input: [
      'w-full text-gray-800 outline-none text-base leading-4 placeholder:text-gray-400',
      'disabled:cursor-not-allowed',
    ],
    prefix: [
      'text-gray-400',
      'data-focused:text-brand-base data-filled:text-gray-700 data-invalid:text-feedback-danger',
    ],
    suffix: 'text-gray-700',
    helper: 'text-xs text-gray-500 leading-4',
  },
});

type InputRootProps = Field.Root.Props & VariantProps<typeof inputVariants>;

function InputRoot({ className, ...rest }: InputRootProps) {
  const { root } = inputVariants();

  return (
    <Field.Root
      className={(state) =>
        root({
          className:
            typeof className === 'function' ? className(state) : className,
        })
      }
      {...rest}
    />
  );
}

type InputContentProps = ComponentProps<'div'> &
  VariantProps<typeof inputVariants>;

function InputContent(props: InputContentProps) {
  const { content } = inputVariants();

  return <div className={content()} {...props} />;
}

type InputLabelProps = Field.Label.Props & VariantProps<typeof inputVariants>;

function InputLabel(props: InputLabelProps) {
  const { label } = inputVariants();

  return <Field.Label className={label()} {...props} />;
}

type InputControlProps = Field.Control.Props;

function InputControl(props: InputControlProps) {
  const { input } = inputVariants();

  return <Field.Control className={input()} {...props} />;
}

type InputPrefixProps = Field.Item.Props & VariantProps<typeof inputVariants>;

function InputPrefix(props: InputPrefixProps) {
  const { prefix } = inputVariants();

  return <Field.Item className={prefix()} {...props} />;
}

type InputSuffixProps = Field.Item.Props & VariantProps<typeof inputVariants>;

function InputSuffix(props: InputSuffixProps) {
  const { suffix } = inputVariants();

  return <Field.Item className={suffix()} {...props} />;
}

type InputHelperTextProps = Field.Description.Props;

function InputHelperText({ className, ...rest }: InputHelperTextProps) {
  const { helper } = inputVariants();

  return (
    <Field.Description
      className={(state) =>
        helper({
          className:
            typeof className === 'function' ? className(state) : className,
        })
      }
      {...rest}
    />
  );
}

export const Input = {
  Root: InputRoot,
  Content: InputContent,
  Prefix: InputPrefix,
  Suffix: InputSuffix,
  Control: InputControl,
  Label: InputLabel,
  HelperText: InputHelperText,
};
