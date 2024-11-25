export interface CommandHandlerData<T extends any> {
    data: T;
    code?: 200 | 400;
}
export interface MessageParams<T extends any> {
    // 'open-folder' | 'open-workspace'
    command: string;
    data: T;
}
export enum CommandTypes {
    open = "ask-project-manage.openPanel",
    close = "ask-project-manage.closePanel",
}
export enum EventTypes {
    openPanel = "ask-project-manage.openPanel",
    closePanel = "ask-project-manage.closePanel",
}
export type ProjectItemModel = {
    name: string;
    key: string;
    source: string;
    path: string;
    sort: number;
    type: "workspace" | "folder";
};
export type ProjectGroupItemModel = {
    label: string;
    key: string;
};
export type ProjectChooseInfo = {
    url: string;
    type: ProjectItemModel['type'];
};
export interface ProjectConfigItemModel extends ProjectGroupItemModel {
    children: Pick<ProjectItemModel, "name" | "key" | "source" | "path" | "type">[];
}

export type FormDataModel = {
    name?: string;
    title?: string;
    nameLabel?: string;
    groupKey?: string;
    listKey?: string;
    subInfo?: string;
};