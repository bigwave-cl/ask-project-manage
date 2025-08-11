import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import type { RenderContentParams } from "../types";
const config = {
    devUrl: "http://localhost:5173",
    proDistPath: "/dist-webview-app/",
    iconPath: "/dist-webview-app/logo.png",
};

const buildStaticDist = (context: vscode.ExtensionContext) => {
    const iconPath = path.join(context.extensionPath, config.iconPath);
    const distPath = path.join(context.extensionPath, config.proDistPath);
    const distUriFile = vscode.Uri.file(distPath);
    const iconUriFile = vscode.Uri.file(iconPath);
    return {
        distPath,
        distUriFile,
        iconUriFile,
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
const getWebviewContent = async (baseUri: string): Promise<string> => {
    try {
        // 获取入口 HTML 内容
        const response = await fetch(`${baseUri}/`);
        const htmlContent = await response.text();

        // 将 HTML 内容注入 Webview 中
        return htmlContent.replace(/<head>/, `<head><base href="${baseUri}/">`);;
    } catch (error) {
        console.error("Failed to fetch HTML content:", error);
        return `<h1>无法加载内容</h1>`;
    }
//     return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Ask Project Manage</title>
// 	  <style>
// 	  	html,body{
// 			margin: 0;
// 			padding: 0;
// 			Height: 100%;
// 			width: 100%;
// 			overflow: hidden;
// 		}
// 	  </style>
//     </head>
//     <body>
//       <iframe id="myIframe" src="${baseUri}" style="width: 100%; height: 100%; border: none;" dropzone sandbox="allow-scripts allow-same-origin allow-modals allow-forms" ></iframe>
//       <script>
//             // 获取 VS Code API
//             const vscode = acquireVsCodeApi();
//             // 监听 iframe 加载完成，向 iframe 传递数据
//             const iframe = document.getElementById('myIframe');
//             // iframe.addEventListener("dragover", (e) => e.preventDefault());
//             console.log('iframe.contentWindow', iframe.contentWindow)
//             iframe.contentWindow.addEventListener("dragover", (e) => {
//                 console.log('dragover-iframe-teset', e);
//                 e.preventDefault()
//                 e.stopPropagation()
//                 // iframe.dispatchEvent(new CustomEvent("dragover", { detail: event }));
//             });
//             iframe.contentWindow.addEventListener("drop", (e) => e.preventDefault());
//             window.addEventListener('message', event => {
//                 const message = event.data;
//                 if (message.from === 'webview' && message.to === 'vscode') {
//                     vscode.postMessage(message);
//                     return
//                 }

//                 if (message.from === 'vscode' && message.to === 'webview') {
//                     iframe.contentWindow.postMessage(message, '*')
//                 }
//             });
//         </script>
//     </body>
//     </html>
//   `;
};

export { getRenderContent, buildStaticDist };
