import { timeSince } from "../util/date";

export type GitStatus = "A" | "M" | "U" | "D" | "C" | "ignored";

export interface TreeNode {
  name: string;
  type: "file" | "folder";
  children?: TreeNode[];
  open?: boolean;
  gitStatus?: GitStatus;
}

export interface FileContent {
  id: string;
  name: string;
  content: string;
}

export const WORKSPACE_NAME = "zackozack";
export const FOLDER_NAME = "zackozack";

export const VSCODE_FILE_TREE: TreeNode[] = [
  {
    name: ".claude",
    type: "folder",
    open: false,
    gitStatus: "ignored",
    children: [],
  },
  {
    name: "node_modules",
    type: "folder",
    open: false,
    gitStatus: "ignored",
    children: [],
  },
  {
    name: "public",
    type: "folder",
    open: false,
    children: [],
  },
  {
    name: "src",
    type: "folder",
    open: true,
    children: [
      { name: "404.md", type: "file", gitStatus: "U" },
      { name: "PROJECTS.md", type: "file" },
      { name: "EXPERIENCE.md", type: "file" },
      { name: "README.md", type: "file", gitStatus: "M" },
    ],
  },
  { name: ".gitignore", type: "file" },
  { name: "eslint.config.js", type: "file" },
  { name: "index.html", type: "file" },
  { name: "package.json", type: "file" },
  { name: "pnpm-lock.yaml", type: "file" },
  { name: "tsconfig.app.json", type: "file" },
  { name: "tsconfig.json", type: "file" },
  { name: "tsconfig.node.json", type: "file" },
  { name: "vite.config.ts", type: "file" },
];

export const INITIAL_FILES: FileContent[] = [
  {
    id: "readme",
    name: "README.md",
    content: `
# Ayush Kumar Yadav (*zackozack*)

*SDE II @ Autodesk | Proffessional Yapper | Claude Code Whisperer*

> About me: Software Engineer with **${timeSince(new Date("2021-10-01"))} of experience**, specializing in TypeScript, Node.js, React, AWS and everything in between. **Committed to transforming complex requirements into intuitive, elegant systems.** In my free time, I enjoy hiking, photography, and exploring whatever's trending on 'Tech Twitter / X'.

## Contact

### Email:
[ayushkyadav81@gmail.com](mailto:ayushkyadav81@gmail.com)

### LinkedIn:
[linkedin.com/in/ayush-kumar-yadav](https://linkedin.com/in/ayush-kumar-yadav)

### GitHub:
[github.com/zaCKoZAck0](https://github.com/zaCKoZAck0)
`,
  },
  {
    id: "experience",
    name: "EXPERIENCE.md",
    content: `# WIP`,
  },
  {
    id: "projects",
    name: "PROJECTS.md",
    content: `# WIP`,
  },
  {
    id: "404",
    name: "404.md",
    content: `# 404 - Not Found`,
  },
];
