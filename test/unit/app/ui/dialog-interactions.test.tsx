// @vitest-environment happy-dom
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/dialog";
import { DropdownSelect } from "@/components/dropdown-select";
import { flushHookEffects, renderComponent } from "../render-hook";

afterEach(() => {
  document.body.replaceChildren();
});

type OutsideHandler = NonNullable<
  React.ComponentProps<typeof DialogContent>["onPointerDownOutside"]
>;

async function settleOutsideListeners(): Promise<void> {
  const tick = () =>
    flushHookEffects(() => new Promise<void>((resolve) => window.setTimeout(resolve, 0)));
  await tick();
  await tick();
}

function pointerClick(target: Element): void {
  target.dispatchEvent(
    new PointerEvent("pointerdown", {
      bubbles: true,
      button: 0,
      cancelable: true,
      composed: true,
      pointerId: 1,
      pointerType: "mouse"
    })
  );
  target.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      button: 0,
      cancelable: true,
      composed: true
    })
  );
}

function dialogOverlay(): HTMLElement | undefined {
  return [...document.body.querySelectorAll<HTMLElement>("[data-open]")].find((element) =>
    element.className.includes("fixed inset-0")
  );
}

async function openDialog(onPointerDownOutside?: OutsideHandler) {
  const view = await renderComponent(
    <Dialog defaultOpen>
      <DialogContent {...(onPointerDownOutside ? { onPointerDownOutside } : {})}>
        <DialogTitle>Test dialog</DialogTitle>
        <DialogClose aria-label="Close test dialog">Close</DialogClose>
      </DialogContent>
    </Dialog>
  );
  await settleOutsideListeners();
  return view;
}

function DialogWithOpenDropdown({
  onPointerDownOutside
}: {
  onPointerDownOutside: OutsideHandler;
}): React.ReactElement {
  const [selectOpen, setSelectOpen] = React.useState(true);
  const [value, setValue] = React.useState("first");
  return (
    <Dialog defaultOpen>
      <DialogContent onPointerDownOutside={onPointerDownOutside}>
        <DialogTitle>Dialog with dropdown</DialogTitle>
        <DropdownSelect
          ariaLabel="Test dropdown"
          open={selectOpen}
          options={[
            { label: "First", value: "first" },
            { label: "Second", value: "second" }
          ]}
          value={value}
          onOpenChange={setSelectOpen}
          onValueChange={setValue}
        />
        <output data-select-state>{selectOpen ? "open" : "closed"}</output>
        <output data-selected-value>{value}</output>
      </DialogContent>
    </Dialog>
  );
}

describe("dialog interactions", () => {
  it("ignores a backdrop click after Base UI reports it", async () => {
    const outside = vi.fn();
    const view = await openDialog(outside);
    const overlay = dialogOverlay();

    expect(overlay).toBeDefined();
    await flushHookEffects(() => pointerClick(overlay as HTMLElement));

    expect(outside).toHaveBeenCalledOnce();
    expect(document.body.querySelector('[role="dialog"]')?.hasAttribute("data-open")).toBe(true);
    await view.unmount();
  });

  it("closes a nested dropdown without closing its dialog", async () => {
    const outside = vi.fn();
    const view = await renderComponent(<DialogWithOpenDropdown onPointerDownOutside={outside} />);
    await settleOutsideListeners();
    const overlay = dialogOverlay();

    expect(document.body.querySelector("[data-select-state]")?.textContent).toBe("open");
    expect(overlay).toBeDefined();
    await flushHookEffects(() => pointerClick(overlay as HTMLElement));

    expect(document.body.querySelector("[data-select-state]")?.textContent).toBe("closed");
    // Base UI closes the nested menu before the dialog handles the same backdrop press.
    // The dialog still stays open because pointer dismissal is disabled.
    expect(outside).toHaveBeenCalledOnce();
    expect(document.body.querySelector('[role="dialog"]')?.hasAttribute("data-open")).toBe(true);
    await settleOutsideListeners();
    await view.unmount();
  });

  it("does not send a nested dropdown choice through to a linked row", async () => {
    const navigate = vi.fn();
    const outside = vi.fn();
    const view = await renderComponent(
      <a
        href="/thread"
        onClick={(event) => {
          event.preventDefault();
          navigate();
        }}
      >
        <DialogWithOpenDropdown onPointerDownOutside={outside} />
      </a>
    );
    await settleOutsideListeners();
    const second = [...document.body.querySelectorAll<HTMLElement>('[role="menuitemradio"]')].find(
      (item) => item.textContent?.includes("Second")
    );

    expect(second).toBeDefined();
    await flushHookEffects(() => pointerClick(second as HTMLElement));

    expect(navigate).not.toHaveBeenCalled();
    expect(document.body.querySelector('[role="dialog"]')?.hasAttribute("data-open")).toBe(true);
    expect(document.body.querySelector("[data-selected-value]")?.textContent).toBe("second");
    await settleOutsideListeners();
    await view.unmount();
  });

  it("still closes through Escape", async () => {
    const view = await openDialog();
    await flushHookEffects(() =>
      document.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }))
    );
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
    await view.unmount();
  });

  it("still closes through an explicit close control", async () => {
    const view = await openDialog();
    await flushHookEffects(() =>
      document.body.querySelector<HTMLButtonElement>('[aria-label="Close test dialog"]')?.click()
    );
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
    await view.unmount();
  });
});
