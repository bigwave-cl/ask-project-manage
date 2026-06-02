import * as vscode from "vscode";
import { ProjectPreferencesModel } from "../types";

const preferencesName = "ask-project-manage.preferences";
const onboardingAutoOpenClaimedName = "ask-project-manage.onboarding.autoOpenClaimed";
let onboardingAutoOpenReserved = false;

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
    const shouldShowOnboarding = async () => {
        const preferences = getPreferences();
        if (preferences.onboarding.seen || onboardingAutoOpenReserved) {
            return false;
        }
        const hasClaimed = context.globalState.get<boolean>(onboardingAutoOpenClaimedName, false);
        if (hasClaimed) {
            return false;
        }
        onboardingAutoOpenReserved = true;
        await context.globalState.update(onboardingAutoOpenClaimedName, true);
        return true;
    };
    const markOnboardingSeen = async () => {
        const preferences = normalizePreferences({
            ...getPreferences(),
            onboarding: {
                seen: true,
            },
        });
        await context.globalState.update(preferencesName, preferences);
        await context.globalState.update(onboardingAutoOpenClaimedName, true);
        onboardingAutoOpenReserved = true;
        return preferences;
    };
    return {
        getPreferences,
        updatePreferences,
        shouldShowOnboarding,
        markOnboardingSeen,
    };
};

export { defaultPreferences, usePreferences };
