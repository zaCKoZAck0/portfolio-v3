import { forwardRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownPreview = forwardRef<HTMLDivElement, { content: string }>(
  ({ content }, ref) => {
    return (
      <>
        <div className="w-px bg-[#333] shrink-0" />
        <div
          ref={ref}
          className="vsc-md-preview flex-1 min-w-0 overflow-auto bg-[#1e1e1e] px-8 py-6 text-[15px] leading-[1.7] font-[Segoe_UI,Ubuntu,-apple-system,sans-serif] text-[#d4d4d4]"
        >
          <style>{`
          .vsc-md-preview h1 { font-size: 2em; font-weight: 600; color: #e2e2e2; margin: 0.4em 0 0.5em; padding-bottom: 0.3em; border-bottom: 1px solid #333; }
          .vsc-md-preview h2 { font-size: 1.5em; font-weight: 600; color: #e2e2e2; margin: 1.2em 0 0.4em; padding-bottom: 0.25em; border-bottom: 1px solid #333; }
          .vsc-md-preview h3 { font-size: 1.25em; font-weight: 600; color: #e2e2e2; margin: 1em 0 0.3em; }
          .vsc-md-preview p { margin: 0.6em 0; }
          .vsc-md-preview a { color: #4fc1ff; text-decoration: none; }
          .vsc-md-preview a:hover { text-decoration: underline; }
          .vsc-md-preview strong { color: #e2e2e2; font-weight: 600; }
          .vsc-md-preview code { background: #2d2d2d; padding: 2px 6px; border-radius: 3px; font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace; font-size: 0.9em; }
          .vsc-md-preview pre { background: #2d2d2d; padding: 12px 16px; border-radius: 4px; overflow-x: auto; margin: 0.8em 0; }
          .vsc-md-preview pre code { background: transparent; padding: 0; }
          .vsc-md-preview blockquote { border-left: 3px solid #444; padding: 4px 16px; margin: 0.6em 0; color: #aaa; }
          .vsc-md-preview ul, .vsc-md-preview ol { padding-left: 1.8em; margin: 0.4em 0; }
          .vsc-md-preview li { margin: 0.2em 0; }
          .vsc-md-preview hr { border: none; border-top: 1px solid #333; margin: 1.5em 0; }
          .vsc-md-preview table { border-collapse: collapse; width: 100%; margin: 0.8em 0; }
          .vsc-md-preview th, .vsc-md-preview td { border: 1px solid #444; padding: 6px 12px; text-align: left; }
          .vsc-md-preview th { background: #2d2d2d; font-weight: 600; color: #e2e2e2; }
          .vsc-md-preview::-webkit-scrollbar { width: 14px; height: 14px; }
          .vsc-md-preview::-webkit-scrollbar-track { background: transparent; }
          .vsc-md-preview::-webkit-scrollbar-thumb { background: rgba(121,121,121,0.4); border: 3px solid transparent; border-radius: 7px; background-clip: padding-box; }
          .vsc-md-preview::-webkit-scrollbar-thumb:hover { background: rgba(121,121,121,0.7); border: 3px solid transparent; background-clip: padding-box; }
        `}</style>
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </div>
      </>
    );
  },
);

MarkdownPreview.displayName = "MarkdownPreview";

export default MarkdownPreview;
