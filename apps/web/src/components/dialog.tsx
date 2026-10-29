import { Dialog as BaseDialog } from '@base-ui/react';
import { tv } from 'tailwind-variants';
import { ButtonVariants, buttonVariants } from './button';
import { X } from 'lucide-react';

const dialogVariants = tv({
  slots: {
    backdrop: [
      'fixed inset-0 bg-black opacity-20 transition-opacity duration-150',
      'data-starting-style:opacity-0 data-ending-style:opacity-0',
      'supports-[-webkit-touch-callout:none]:absolute',
    ],
    viewport: [
      'fixed inset-0 flex items-center justify-center overflow-hidden py-6',
      '[@media(min-height:600px)]:pb-12 [@media(min-height:600px)]:pt-8',
    ],
    popup: [
      'relative flex w-[min(40rem,calc(100vw-2rem))] max-h-full max-w-full',
      'p-6 min-h-0 flex-col bg-white',
      'border border-gray-200 rounded-xl shadow-[0.25rem_0.25rem_0] shadow-black/12',
      'transition-[scale,opacity] duration-100 ease-out',
      'data-starting-style:scale-[0.98] data-starting-style:opacity-0',
      'data-ending-style:scale-[0.98] data-ending-style:opacity-0',
    ],
    title: 'font-semibold text-base leading-6 text-gray-800',
    description: 'font-normal text-sm leading-5 text-gray-600',
    close: [
      'text-gray-700 border rounded-lg border-gray-300 p-2 outline-none',
      'cursor-pointer hover:bg-gray-200 focus-within:ring-2 transition-all',
      'focus-within:ring-gray-400/20',
    ],
  },
});

function DialogRoot(props: BaseDialog.Root.Props) {
  return <BaseDialog.Root {...props} />;
}

type DialogTriggerProps = ButtonVariants & BaseDialog.Trigger.Props;

function DialogTrigger(props: DialogTriggerProps) {
  const { className, variant, size, ...rest } = props;

  return (
    <BaseDialog.Trigger
      className={(state) =>
        buttonVariants({
          variant,
          size,
          className:
            typeof className === 'function' ? className(state) : className,
        })
      }
      {...rest}
    />
  );
}

function DialogContent({ className, ...rest }: BaseDialog.Popup.Props) {
  const { backdrop, viewport, popup } = dialogVariants();

  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={backdrop()} />
      <BaseDialog.Viewport className={viewport()}>
        <BaseDialog.Popup
          className={(state) =>
            popup({
              className:
                typeof className === 'function' ? className(state) : className,
            })
          }
          {...rest}
        />
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

function DialogTitle({ className, ...rest }: BaseDialog.Title.Props) {
  const { title } = dialogVariants();

  return (
    <BaseDialog.Title
      className={(state) =>
        title({
          className:
            typeof className === 'function' ? className(state) : className,
        })
      }
      {...rest}
    />
  );
}

function DialogDescription({
  className,
  ...rest
}: BaseDialog.Description.Props) {
  const { description } = dialogVariants();

  return (
    <BaseDialog.Description
      className={(state) =>
        description({
          className:
            typeof className === 'function' ? className(state) : className,
        })
      }
      {...rest}
    />
  );
}

function DialogClose({ className, ...rest }: BaseDialog.Close.Props) {
  const { close } = dialogVariants();

  return (
    <BaseDialog.Close
      className={(state) =>
        close({
          className:
            typeof className === 'function' ? className(state) : className,
        })
      }
      {...rest}
    >
      <X width={14} height={14} />
    </BaseDialog.Close>
  );
}

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};
