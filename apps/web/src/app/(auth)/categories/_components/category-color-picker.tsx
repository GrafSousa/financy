import { useId } from 'react';
import {
  Radio,
  RadioGroup,
  RadioGroupProps,
  RadioIndicator,
} from '@base-ui/react';

const colors = [
  {
    value: 'green-base',
    bg: 'bg-green-base',
    label: 'Verde',
  },
  {
    value: 'blue-base',
    bg: 'bg-blue-base',
    label: 'Azul',
  },
  {
    value: 'purple-base',
    bg: 'bg-purple-base',
    label: 'Roxo',
  },
  {
    value: 'pink-base',
    bg: 'bg-pink-base',
    label: 'Rosa',
  },
  {
    value: 'red-base',
    bg: 'bg-red-base',
    label: 'Vermelho',
  },
  {
    value: 'orange-base',
    bg: 'bg-orange-base',
    label: 'Laranja',
  },
  {
    value: 'yellow-base',
    bg: 'bg-yellow-base',
    label: 'Amarelo',
  },
];

export function CategoryColorPicker({ className, ...rest }: RadioGroupProps) {
  const labelId = useId();

  return (
    <div className='flex flex-col gap-2'>
      <span
        id={labelId}
        className='leading-5 text-gray-700 text-sm font-medium'
      >
        Cor
      </span>
      <RadioGroup
        aria-labelledby={labelId}
        className={`inline-flex flex-wrap gap-2 ${className}`}
        {...rest}
      >
        {colors.map(({ value, bg, label }) => (
          <Radio.Root
            key={label}
            value={value}
            aria-label={label}
            className='
            flex w-12.5 h-7.5 p-1 shrink-0 cursor-pointer
            items-center justify-center rounded-lg
            border border-gray-300
            hover:bg-gray-200
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-brand-base
            data-checked:border-brand-base
            data-checked:bg-brand-base/10
            data-disabled:cursor-not-allowed
            data-disabled:opacity-50
          '
          >
            <Radio.Indicator />
            <div className={`${bg} w-10 h-5 rounded-sm`} />
          </Radio.Root>
        ))}
      </RadioGroup>
    </div>
  );
}
