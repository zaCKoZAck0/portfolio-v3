import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView } from '@codemirror/view';
import { vscodeDarkInit } from '@uiw/codemirror-theme-vscode';
import { tags as t } from '@lezer/highlight';

// Override the pre-built uiw theme's broken Markdown colors
const markdownTheme = vscodeDarkInit({
  settings: {
    foreground: '#d4d4d4', // Fixes default text being light blue
  },
  styles: [
    { tag: t.heading, color: '#569cd6', fontWeight: 'bold' },
    { tag: t.strong, color: '#569cd6', fontWeight: 'bold' },
    { tag: t.quote, color: '#6a9955', fontStyle: 'italic' },
    { tag: t.link, color: '#ce9178' },
    { tag: t.url, color: '#569cd6', textDecoration: 'underline' },
  ]
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onEditorView?: (view: EditorView) => void;
}

export default function MarkdownEditor({ value, onChange, onEditorView }: MarkdownEditorProps) {
  return (
    <div className="flex-1 h-full w-full flex flex-col [&>.cm-theme]:flex-1 [&>.cm-theme]:h-full [&>.cm-editor]:h-full [&>.cm-editor]:flex-1 [&_.cm-scroller]:leading-[1.7] [&_.cm-content]:py-4 [&_.cm-gutters]:bg-[#1e1e1e] [&_.cm-gutters]:border-r-0 [&_.cm-gutters]:text-[#858585] [&_.cm-activeLineGutter]:bg-[#2a2d2e] [&_.cm-activeLineGutter]:text-[#c6c6c6] [&_.cm-activeLine]:bg-[#2a2d2e80]">
      <style>{`
        .cm-scroller::-webkit-scrollbar { width: 14px; height: 14px; }
        .cm-scroller::-webkit-scrollbar-track { background: transparent; }
        .cm-scroller::-webkit-scrollbar-thumb { background: rgba(121,121,121,0.4); border: 3px solid transparent; border-radius: 7px; background-clip: padding-box; }
        .cm-scroller::-webkit-scrollbar-thumb:hover { background: rgba(121,121,121,0.7); border: 3px solid transparent; background-clip: padding-box; }
        .cm-scroller::-webkit-scrollbar-corner { background: transparent; }
        /* Padding overrides to ensure space between line numbers and code */
        .cm-lineNumbers .cm-gutterElement { padding-left: 16px !important; padding-right: 24px !important; }
        .cm-content .cm-line { padding-left: 8px !important; padding-right: 16px !important; }
      `}</style>
      <CodeMirror
        value={value}
        height="100%"
        theme={markdownTheme}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
          EditorView.lineWrapping
        ]}
        onChange={onChange}
        onCreateEditor={(view) => onEditorView?.(view)}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: false,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        style={{ 
          fontSize: '15px', 
          fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', 'Courier New', monospace" 
        }}
      />
    </div>
  );
}
