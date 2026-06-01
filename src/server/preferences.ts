import * as vscode from "vscode";
import { ProjectPreferencesModel } from "../types";

const preferencesName = "ask-project-manage.preferences";

const defaultPreferences: ProjectPreferencesModel = {
    autoOpenPanel: true,
    hud: {
        visible: true,
        metrics: {
            project: true,
            folder: true,
            workspace: true,
            group: true,
        },
    },
    onboarding: {
        seen: false,
    },
};

const normalizePreferences = (value?: Partial<ProjectPreferencesModel>): ProjectPreferencesModel => {
    return {
        autoOpenPanel: value?.autoOpenPanel ?? defaultPreferences.autoOpenPanel,
        hud: {
            visible: value?.hud?.visible ?? defaultPreferences.hud.visible,
            metrics: {
                project: value?.hud?.metrics?.project ?? defaultPreferences.hud.metrics.project,
                folder: value?.hud?.metrics?.folder ?? defaultPreferences.hud.metrics.folder,
                workspace: value?.hud?.metrics?.workspace ?? defaultPreferences.hud.metrics.workspace,
                group: value?.hud?.metrics?.group ?? defaultPreferences.hud.metrics.group,
            },
        },
        onboarding: {
            seen: value?.onboarding?.seen ?? defaultPreferences.onboarding.seen,
        },
    };
};

const usePreferences = (context: vscode.ExtensionContext) => {
    const getPreferences = () => {
        return normalizePreferences(context.globalState.get<ProjectPreferencesModel>(preferencesName));
    };
    const updatePreferences = (preferences: ProjectPreferencesModel) => {
        return context.globalState.update(preferencesName, normalizePreferences(preferences));
    };
    return {
        getPreferences,
        updatePreferences,
    };
};

export { defaultPreferences, usePreferences };
