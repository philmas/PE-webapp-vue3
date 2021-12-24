<template>
  <Container>
    <div class="editorButtons">
      <div class="action" v-for="button in actionButtonsFiltered">
        <div v-if="button.id == 'divider'" class="divider"></div>
        <Button
          v-else
          size="tiny"
          :tooltip="button?.id"
          :icon="button.icon"
          :disabled="button?.isDisabled && button.isDisabled()"
          :class="{
            active: button?.isActive && button?.isActive(),
          }"
          @click="button.action()"
        ></Button>
      </div>

      <Button class="insertButton" size="small" @click="insertTable">
        Tabel invoegen
      </Button>
    </div>
    <editor-content :editor="editor" />
  </Container>
</template>

<script setup lang="ts">
import Button from "@/components/buttons/Button.vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

import Container from "@/components/Container.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: { type: "doc", content: [{ type: "paragraph" }] },
  },
});

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit, Underline, Table, TableRow, TableHeader, TableCell],
  onUpdate: () => {
    emit("update:modelValue", editor.value.getJSON());
  },
});

const chainedCmd = computed(() => editor?.value.chain().focus());
const tableIsVisible = computed(
  () => editor?.value?.can()?.deleteRow() || false
);

const textSize = computed(() => {
  if (editor.value?.isActive("heading", { level: 1 })) return "h1";
  if (editor.value?.isActive("heading", { level: 2 })) return "h2";
  if (editor.value?.isActive("blockquote")) return "blockquote";
  if (
    editor.value?.isActive("orderedList") ||
    editor.value?.isActive("bulletList")
  )
    return "list";
  else return "p";
});

const decreaseSize = () => {
  if (textSize.value == "h2" || textSize.value == "blockquote")
    editor.value.commands.setParagraph();
  else if (textSize.value == "h1")
    editor.value.commands.setHeading({ level: 2 });
  else return;

  editor.value.commands.focus();
};

const increaseSize = () => {
  if (textSize.value == "p") editor.value.commands.setHeading({ level: 2 });
  else if (textSize.value == "h2")
    editor.value.commands.setHeading({ level: 1 });
  else return;

  editor.value.commands.focus();
};

const insertTable = (e: Event) => {
  if (!e || tableIsVisible.value) return;
  editor.value
    .chain()
    .focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run();
};

const editorButtons = [
  {
    id: "tekst kleiner",
    icon: "text_decrease",
    action: decreaseSize,
    vanishIf: () => tableIsVisible.value,
    isDisabled: () => !(textSize.value == "h1" || textSize.value === "h2"),
  },
  {
    id: "tekst groter",
    icon: "text_increase",
    action: () => increaseSize(),
    vanishIf: () => tableIsVisible.value,
    isDisabled: () => !(textSize.value === "p" || textSize.value === "h2"),
  },
  {
    id: "divider",
    vanishIf: () => tableIsVisible.value,
  },
  {
    id: "lijst",
    icon: "format_list_bulleted",
    vanishIf: () => tableIsVisible.value,
    isActive: () =>
      editor.value?.isActive("bulletList") ||
      editor.value?.isActive("orderedList"),
    action: () => chainedCmd.value.toggleBulletList().run(),
  },
  {
    id: "citaat",
    icon: "format_quote",
    vanishIf: () => tableIsVisible.value,
    isActive: () => editor.value?.isActive("blockquote"),
    action: () => chainedCmd.value.toggleBlockquote().run(),
  },
  {
    id: "header aan/uit",
    icon: "title",
    vanishIf: () => !tableIsVisible.value,
    action: () => chainedCmd.value.toggleHeaderRow().run(),
  },
  {
    id: "rij toevoegen",
    icon: "table_rows",
    vanishIf: () => !tableIsVisible.value,
    action: () => chainedCmd.value.addRowAfter().run(),
  },
  {
    id: "colom toevoegen",
    icon: "view_column",
    vanishIf: () => !tableIsVisible.value,
    action: () => chainedCmd.value.addColumnAfter().run(),
  },
  {
    id: "rij verwijderen",
    icon: "delete",
    vanishIf: () => !tableIsVisible.value || !editor.value?.can()?.deleteRow(),
    action: () => chainedCmd.value.deleteRow().run(),
  },
  {
    id: "colom verwijderen",
    icon: "delete",
    vanishIf: () =>
      !tableIsVisible.value || !editor.value?.can()?.deleteColumn(),
    action: () => chainedCmd.value.deleteColumn().run(),
  },
  {
    id: "split",
    icon: "call_split",
    vanishIf: () => !tableIsVisible.value || !editor.value?.can()?.splitCell(),
    action: () => chainedCmd.value.splitCell().run(),
  },
  {
    id: "merge",
    icon: "call_merge",
    vanishIf: () => !tableIsVisible.value || !editor.value?.can()?.mergeCells(),
    action: () => chainedCmd.value.mergeCells().run(),
  },
  {
    id: "divider",
  },
  {
    id: "bold",
    icon: "format_bold",
    isActive: () => editor?.value?.isActive("bold"),
    action: () => chainedCmd.value.toggleBold().run(),
  },
  {
    id: "italic",
    icon: "format_italic",
    isActive: () => editor?.value?.isActive("italic"),
    action: () => chainedCmd.value.toggleItalic().run(),
  },
  {
    id: "underline",
    icon: "format_underlined",
    isActive: () => editor?.value?.isActive("underline"),
    action: () => chainedCmd.value.toggleUnderline().run(),
  },
  {
    id: "divider",
  },
  {
    id: "ongedaan maken",
    icon: "undo",
    action: () => chainedCmd.value.undo().run(),
    isDisabled: () => !editor.value?.can()?.undo(),
  },
  {
    id: "opnieuw doen",
    icon: "redo",
    action: () => chainedCmd.value.redo().run(),
    isDisabled: () => !editor.value?.can()?.redo(),
  },
];

const actionButtonsFiltered = computed(() =>
  editorButtons.filter((button) => !(button.vanishIf && button.vanishIf()))
);
</script>

<style scoped lang="scss">
.editorButtons {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  position: sticky;
  top: 4.5rem;
  background: #ffffffab;
  backdrop-filter: blur(7px) saturate(2);
  padding: 1rem 0.5rem 1.5rem;
  z-index: 1;
  width: 100%;
  overflow: visible auto;
  & .divider {
    width: 1px;
    height: 2rem;
    background-color: var(--grey-color-700);
  }
  & .action button {
    --bg: transparent;
    --color: var(--grey-color-800);
    &.active {
      --bg: var(--primary-color-300);
      --color: var(--primary-color-900);
    }
    &.disabled {
      --color: var(--grey-color-200);
      --bg: transparent;
    }
  }
  & .insertButton {
    margin-left: auto;
  }
}
</style>

<style lang="scss">
.ProseMirror {
  padding: var(--padding-small);
  outline: none;
  & h1 {
    margin: 0;
  }
  // Placeholder voor title
  & h1:first-of-type {
    & br {
      content: "";
    }
    & br:after {
      content: "Type hier een titel";
      color: var(--grey-color-300);
    }
  }
  // placeholder voor eerste content regel
  & h1:first-of-type + * {
    & br {
      content: "";
    }
    & br:after {
      content: "Type hier een spectaculaire blog";
      color: var(--grey-color-300);
    }
  }
}
/* Table-specific styling */
.tableWrapper {
  overflow-x: auto;
}
.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
</style>
