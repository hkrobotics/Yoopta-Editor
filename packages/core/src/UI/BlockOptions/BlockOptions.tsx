import TurnIcon from './icons/turn.svg';
import { TrashIcon, CopyIcon, Link2Icon } from '@radix-ui/react-icons';
import { useYooptaEditor } from '../../contexts/UltraYooptaContext/UltraYooptaContext';
import { useState } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  inline,
  autoUpdate,
  FloatingPortal,
  FloatingOverlay,
} from '@floating-ui/react';
import { ActionMenuComponent } from '../../tools/ActionMenuList/ActionMenuComponent';

const DropdownMenuGroup = ({ children }) => <div className="flex flex-col">{children}</div>;

const DropdownMenuContent = ({ children }) => (
  <div
    onClick={(e) => e.stopPropagation()}
    className="bg-[#FFF] relative min-w-[200px] w-auto overflow-hidden rounded-md border bg-popover py-[6px] px-0 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
  >
    {children}
  </div>
);

const DropdownMenuItem = ({ children }) => (
  <div className="relative flex cursor-default select-none items-center text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
    {children}
  </div>
);

const BlockOptions = ({ isOpen, onClose, refs, floatingStyles }) => {
  const editor = useYooptaEditor();
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const { refs: actionMenuRefs, floatingStyles: actionMenuFloatingStyles } = useFloating({
    placement: 'right',
    open: isActionMenuOpen,
    onOpenChange: setIsActionMenuOpen,
    middleware: [inline(), flip(), shift(), offset(10)],
    whileElementsMounted: autoUpdate,
  });

  if (!isOpen) return null;

  const onDelete = () => {
    const selection = editor.selection;
    editor.deleteBlock({ at: selection });
    editor.setBlockSelected(null);
    editor.setSelection(null);

    onClose();
  };

  const onDuplicate = () => {
    editor.duplicateBlock({ at: editor.selection, focus: true });
    editor.setBlockSelected(null);

    onClose();
  };

  const onCopy = () => {
    console.log('editor', editor.selectedBlocks);
  };

  return (
    // [TODO] - take care about SSR
    <FloatingPortal root={document.getElementById('yoopta-editor')}>
      <FloatingOverlay lockScroll className="z-[100]" onClick={onClose}>
        <div style={floatingStyles} ref={refs.setFloating}>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <button
                  type="button"
                  className="rounded-sm hover:bg-[#37352f14] leading-[120%] px-2 py-1.5 mx-[4px] cursor-pointer w-full flex justify-start"
                  onClick={onDelete}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  type="button"
                  className="rounded-sm hover:bg-[#37352f14] leading-[120%] px-2 py-1.5 mx-[4px] cursor-pointer w-full flex justify-start"
                  onClick={onDuplicate}
                >
                  <CopyIcon className="w-4 h-4 mr-2" />
                  Duplicate
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                {isActionMenuOpen && (
                  <FloatingPortal root={document.getElementById('yoopta-editor')}>
                    <FloatingOverlay lockScroll className="z-[100]" onClick={() => setIsActionMenuOpen(false)}>
                      <div style={actionMenuFloatingStyles} ref={actionMenuRefs.setFloating}>
                        <ActionMenuComponent
                          actions={Object.keys(editor.blocks)}
                          editor={editor}
                          selectedAction={''}
                          onClose={() => setIsActionMenuOpen(false)}
                          empty={false}
                          onMouseEnter={() => undefined}
                        />
                      </div>
                    </FloatingOverlay>
                  </FloatingPortal>
                )}
                <button
                  type="button"
                  className="rounded-sm hover:bg-[#37352f14] leading-[120%] px-2 py-1.5 mx-[4px] cursor-pointer w-full flex justify-start"
                  ref={actionMenuRefs.setReference}
                  onClick={() => setIsActionMenuOpen((open) => !open)}
                >
                  <TurnIcon className="w-4 h-4 mr-2" />
                  Turn into
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  type="button"
                  className="rounded-sm hover:bg-[#37352f14] leading-[120%] px-2 py-1.5 mx-[4px] cursor-pointer w-full flex justify-start"
                  onClick={onCopy}
                >
                  <Link2Icon className="w-4 h-4 mr-2" />
                  Copy link to block
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </div>
      </FloatingOverlay>
    </FloatingPortal>
  );
};

export { BlockOptions };
