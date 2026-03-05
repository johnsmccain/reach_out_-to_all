import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

const ResizablePanelGroup = ({ className, ...props }: any) => (
  <div
    className={cn(
      'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
      className
    )}
    {...props}
  />
);

const ResizablePanel = ({ className, ...props }: any) => (
  <div className={className} {...props} />
);

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: any) => (
  <div
    className={cn(
      'relative flex w-px items-center justify-center bg-border',
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <DragHandleDots2Icon className="h-2.5 w-2.5" />
      </div>
    )}
  </div>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
