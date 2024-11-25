interface vscode {
    postMessage(message: any): void;
};
declare global {
    interface Window {
        acquireVsCodeApi(): vscode;
    }
}