import { Radio, RadioGroup, RadioGroupProps } from '@base-ui/react';
import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
  LucideIcon,
} from 'lucide-react';
import type { IconName } from 'lucide-react/dynamic';
import { useId } from 'react';

type IconOption = {
  label: string;
  name: IconName;
  icon: LucideIcon;
};

const icons = [
  {
    label: 'Trabalho',
    name: 'briefcase-business',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Transporte',
    name: 'car-front',
    icon: CarFront,
  },
  {
    label: 'Saúde',
    name: 'heart-pulse',
    icon: HeartPulse,
  },
  {
    label: 'Poupança',
    name: 'piggy-bank',
    icon: PiggyBank,
  },
  {
    label: 'Compras',
    name: 'shopping-cart',
    icon: ShoppingCart,
  },
  {
    label: 'Lazer',
    name: 'ticket',
    icon: Ticket,
  },
  {
    label: 'Serviços',
    name: 'tool-case',
    icon: ToolCase,
  },
  {
    label: 'Restaurante',
    name: 'utensils',
    icon: Utensils,
  },
  {
    label: 'Pet',
    name: 'paw-print',
    icon: PawPrint,
  },
  {
    label: 'Casa',
    name: 'house',
    icon: House,
  },
  {
    label: 'Presente',
    name: 'gift',
    icon: Gift,
  },
  {
    label: 'Academia',
    name: 'dumbbell',
    icon: Dumbbell,
  },
  {
    label: 'Estudo',
    name: 'book-open',
    icon: BookOpen,
  },
  {
    label: 'Viagem',
    name: 'baggage-claim',
    icon: BaggageClaim,
  },
  {
    label: 'Internet',
    name: 'mailbox',
    icon: Mailbox,
  },
  {
    label: 'Contas',
    name: 'receipt-text',
    icon: ReceiptText,
  },
] as const satisfies readonly IconOption[];

export function CategoryIconPicker({ className, ...rest }: RadioGroupProps) {
  const labelId = useId();

  return (
    <div className='flex flex-col gap-2'>
      <span
        id={labelId}
        className='leading-5 text-gray-700 text-sm font-medium'
      >
        Ícone
      </span>
      <RadioGroup
        aria-labelledby={labelId}
        className={`inline-flex flex-wrap gap-2 ${className}`}
        {...rest}
      >
        {icons.map(({ icon: Icon, name }) => (
          <Radio.Root
            key={name}
            value={name}
            className='
            flex size-10.5 shrink-0 cursor-pointer
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
            <Icon size={20} aria-hidden='true' />
          </Radio.Root>
        ))}
      </RadioGroup>
    </div>
  );
}
