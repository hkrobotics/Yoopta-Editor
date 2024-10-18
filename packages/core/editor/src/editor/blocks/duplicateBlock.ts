import { deepClone } from '../../utils/deepClone';
import { findPluginBlockByPath } from '../../utils/findPluginBlockByPath';
import { generateId } from '../../utils/generateId';
import { YooptaOperation } from '../core/applyTransforms';
import { YooEditor, YooptaBlock, YooptaBlockData, YooptaPathIndex } from '../types';

// export function duplicateBlock(editor: YooEditor, options: DuplicateBlockOptions = {}) {
//   const { blockId, focus } = options;

//   if (!blockId && !options.at) {
//     throw new Error('blockId or path should be provided');
//   }

//   let originalBlock: YooptaBlockData | null = null;

//   if (blockId) {
//     originalBlock = editor.children[blockId];

//     if (!originalBlock) {
//       throw new Error(`Block not with blockId: ${blockId} found`);
//     }
//   }

//   if (options.at) {
//     originalBlock = findPluginBlockByPath(editor, { at: options.at });

//     if (!originalBlock) {
//       throw new Error(`Block in path ${options.at} not found`);
//     }
//   }

//   if (!originalBlock) {
//     throw new Error('Block not found');
//   }

//   editor.children = createDraft(editor.children);

//   const blocks = Object.values(editor.children);

//   blocks.forEach((block) => {
//     if (block.meta.order > originalBlock!.meta.order) {
//       block.meta.order += 1;
//     }
//   });

//   const duplicatedBlock = deepClone(originalBlock);
//   const slate = buildSlateEditor(editor);

//   duplicatedBlock.id = generateId();
//   duplicatedBlock.meta.order = originalBlock.meta.order + 1;

//   // [TODO] - change ids in slate elements?
//   editor.children[duplicatedBlock.id] = duplicatedBlock;
//   editor.blockEditorsMap[duplicatedBlock.id] = slate;

//   const duplicatedId = duplicatedBlock.id;

//   editor.children = finishDraft(editor.children);
//   editor.applyChanges();
//   editor.emit('change', editor.children);

//   if (focus) {
//     editor.focusBlock(duplicatedId, { waitExecution: true });
//   }
// }

export type DuplicateBlockOptions = {
  original: { blockId?: never; path: YooptaPathIndex } | { blockId: string; path?: never };
  focus?: boolean;
  at?: YooptaPathIndex;
};

export function duplicateBlock(editor: YooEditor, options: DuplicateBlockOptions) {
  const { original, focus, at } = options;

  if (!original) {
    throw new Error('`original` should be provided');
  }

  if (!original.blockId && typeof original.path !== 'number') {
    throw new Error('blockId or path should be provided');
  }

  const { blockId, path } = original;

  let originalBlock: YooptaBlockData | null = blockId
    ? editor.children[blockId]
    : findPluginBlockByPath(editor, { at: path! });

  if (!originalBlock) {
    throw new Error('Block not found');
  }

  const operations: YooptaOperation[] = [];

  Object.values(editor.children).forEach((block) => {
    if (block.meta.order > originalBlock!.meta.order) {
      // operations.push({
      //   type: 'set_block',
      //   prevProperties: { meta: { ...block.meta, order: block.meta.order } },
      //   id: block.id,
      //   properties: {
      //     meta: { ...block.meta, order: block.meta.order + 1 },
      //   },
      // });
      // operations.push({
      //   type: 'set_block_meta',
      //   id: block.id,
      //   properties: { order: block.meta.order + 1 },
      //   prevProperties: { order: block.meta.order },
      // });
    }
  });

  const duplicatedBlock = deepClone(originalBlock);
  duplicatedBlock.id = generateId();
  // [TEST]
  duplicatedBlock.meta.order = Array.isArray(at) && typeof at === 'number' ? at : originalBlock.meta.order + 1;

  operations.push({
    type: 'insert_block',
    path: { current: duplicatedBlock.meta.order },
    block: duplicatedBlock,
  });

  editor.applyTransforms(operations);

  if (focus) {
    editor.focusBlock(duplicatedBlock.id, { waitExecution: true });
  }

  return duplicatedBlock.id;
}
