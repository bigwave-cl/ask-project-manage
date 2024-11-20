import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import type { RenderContentParams } from "../types";
const config = {
    devUrl: "http://localhost:5173",
    proDistPath: "/webview-app/dist/",
};

const buildStaticDist = (context: vscode.ExtensionContext) => {
    const distPath = path.join(context.extensionPath, config.proDistPath);
    const distUriFile = vscode.Uri.file(distPath);
    return {
        distPath,
        distUriFile,
    };
};

const getRenderContent = (options: RenderContentParams) => {
    const isDev = process.env.VSCODE_ENV === "development";
    return isDev ? getDevRenderContent() : getProRenderContent(options);
};
const getDevRenderContent = () => {
    return getWebviewContent(config.devUrl);
};
const getProRenderContent = (options: RenderContentParams) => {
    const { panel, distPath, distUriFile } = options;
    const distUri = panel.webview.asWebviewUri(distUriFile);
    const htmlPath = path.join(distPath, "index.html");
    const htmlContent = fs.readFileSync(htmlPath, "utf8");

    return htmlContent.replace(/"(\/?[^"]+\.(css|js|png|jpg|jpeg|gif))"/g, (match, p1) => {
        // 基于文件类型来处理路径
        let resourceUri: vscode.Uri | null = null;

        if (p1.endsWith(".css") || p1.endsWith(".js")) {
            resourceUri = vscode.Uri.joinPath(distUri, p1);
        } else if (p1.endsWith(".png") || p1.endsWith(".jpg") || p1.endsWith(".jpeg") || p1.endsWith(".gif")) {
            resourceUri = vscode.Uri.joinPath(distUri, p1);
        }

        return resourceUri ? `"${panel.webview.asWebviewUri(resourceUri)}"` : p1;
    });
};
/**
 * 构建 Webview 的 HTML 内容
 */
const getWebviewContent = (baseUri: string): string => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vue Webview</title>
	  <style>
	  	html,body{
			margin: 0;
			padding: 0;
			Height: 100%;
			width: 100%;
			overflow: hidden;
		}
	  </style>
    </head>
    <body>
      <iframe src="${baseUri}" style="width: 100%; height: 100%; border: none;"></iframe>
    </body>
    </html>
  `;
};

export { getRenderContent, buildStaticDist };
