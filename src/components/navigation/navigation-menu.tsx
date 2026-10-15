'use client';

import { IconSelector } from '@tabler/icons-react';
import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu';
import { cva } from 'class-variance-authority';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { cn } from '@/lib/utils';

function NavigationMenu({
  align = 'start',
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props & Pick<NavigationMenuPrimitive.Positioner.Props, 'align'>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
        className,
      )}
      {...props}
    >
      {children}
      <NavigationMenuPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  );
}

type Pill = { x: number; top: number; width: number; height: number };

function NavigationMenuList({
  className,
  onPointerOver,
  onPointerLeave,
  onFocus,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) {
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<Pill | null>(null);
  const [shown, setShown] = useState(false);
  const inside = useRef(false);
  const pillRef = useRef<HTMLSpanElement>(null);

  const moveTo = (item: HTMLElement) => {
    const list = listRef.current;
    if (!list) return;

    const bounds = list.getBoundingClientRect();
    const box = item.getBoundingClientRect();
    const next = {
      x: box.left - bounds.left,
      top: box.top - bounds.top,
      width: box.width,
      height: box.height,
    };
    if (shown) {
      setPill(next);
      return;
    }

    flushSync(() => setPill(next));
    void pillRef.current?.getBoundingClientRect();
    setShown(true);
  };

  const itemUnder = (target: EventTarget | null) => {
    const list = listRef.current;
    if (!list || !(target instanceof Element)) return null;

    const item = target.closest<HTMLElement>(
      '[data-slot="navigation-menu-trigger"], [data-slot="navigation-menu-link"]',
    );
    return item && list.contains(item) ? item : null;
  };

  const settle = () => {
    const open = listRef.current?.querySelector<HTMLElement>('[data-popup-open]');
    if (open) moveTo(open);
    else setShown(false);
  };

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const observer = new MutationObserver(() => {
      if (!inside.current) settle();
    });
    observer.observe(list, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-popup-open'],
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <NavigationMenuPrimitive.List
      ref={listRef}
      data-slot="navigation-menu-list"
      className={cn(
        'group relative flex flex-1 list-none items-center justify-center gap-1 sm:gap-2',
        className,
      )}
      onPointerOver={(event) => {
        inside.current = true;
        const item = itemUnder(event.target);
        if (item) moveTo(item);
        onPointerOver?.(event);
      }}
      onPointerLeave={(event) => {
        inside.current = false;
        settle();
        onPointerLeave?.(event);
      }}
      onFocus={(event) => {
        const item = itemUnder(event.target);
        if (item) moveTo(item);
        onFocus?.(event);
      }}
      {...props}
    >
      {pill ? (
        <span
          ref={pillRef}
          aria-hidden
          data-slot="navigation-menu-pill"
          className={cn(
            'pointer-events-none absolute rounded-full bg-gray-100 ease-out motion-reduce:transition-none',
            shown
              ? 'transition-[transform,width,opacity] duration-200'
              : 'transition-opacity duration-150',
          )}
          style={{
            transform: `translateX(${String(pill.x)}px)`,
            top: pill.top,
            width: pill.width,
            height: pill.height,
            opacity: shown ? 1 : 0,
          }}
        />
      ) : null}
      {props.children}
    </NavigationMenuPrimitive.List>
  );
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn('relative', className)}
      {...props}
    />
  );
}

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger relative inline-flex h-9 w-max items-center justify-center rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-950 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#00594C] aria-disabled:pointer-events-none aria-disabled:opacity-50",
);

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), 'group', className)}
      {...props}
    >
      {children}{' '}
      <IconSelector className="relative top-px ms-1 size-3 shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors" aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  keepMounted = true,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      keepMounted={keepMounted}
      className={cn(
        'w-auto p-1.5 bg-white text-gray-900 rounded-2xl shadow-xl border border-gray-100 ring-1 ring-black/5 transition-all duration-200',
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuPositioner({
  className,
  side = 'bottom',
  sideOffset = 8,
  align = 'start',
  alignOffset = 0,
  collisionPadding = 16,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={cn(
          'isolate z-50 transition-[top,left,right,bottom] duration-200 ease-out',
          className,
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup className="popover-panel relative origin-top rounded-2xl bg-white text-gray-900 shadow-xl border border-gray-100 ring-1 ring-black/5 transition-[width,height] duration-200 ease-out outline-none overflow-hidden">
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}

function NavigationMenuLink({ className, ...props }: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "relative flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-950 hover:bg-gray-50 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#00594C]",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>) {
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-indicator"
      className={cn(
        'top-full z-1 flex h-1.5 items-end justify-center overflow-hidden',
        className,
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-white border border-gray-100 shadow-md" />
    </NavigationMenuPrimitive.Icon>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
};
