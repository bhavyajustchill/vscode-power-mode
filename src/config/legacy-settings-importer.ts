import * as vscode from 'vscode';
import { ConfigurationKeys, DeprecatedConfigurationKeys } from './configuration-keys';

const LEGACY_SECTION = "powermode";
const SECTION = "powermodeReborn";
const LEGACY_EXTENSION_ID = "hoovercj.vscode-power-mode";

// Stored in globalState for user settings and in workspaceState for workspace and folder settings
// so that settings are only imported once and later changes by the user are respected.
const IMPORTED_STATE_KEY = "legacySettingsImported";

const ALL_KEYS: readonly string[] = [...ConfigurationKeys, ...DeprecatedConfigurationKeys];

type InspectValueKey = "globalValue" | "workspaceValue" | "workspaceFolderValue";

/**
 * Copies the settings of the original Power Mode extension ("powermode.*") to the
 * Power Mode Reborn settings ("powermodeReborn.*"). Settings that are already set for
 * Power Mode Reborn are never overwritten, and the original settings are left untouched.
 * Deprecated keys are copied as-is so the regular configuration migration can upgrade them.
 */
export const importLegacySettings = async (context: vscode.ExtensionContext) => {
    let importedCount = 0;

    if (!context.globalState.get<boolean>(IMPORTED_STATE_KEY)) {
        importedCount += await importScope(undefined, "globalValue", vscode.ConfigurationTarget.Global);
        await context.globalState.update(IMPORTED_STATE_KEY, true);
    }

    const folders = vscode.workspace.workspaceFolders || [];
    if (folders.length > 0 && !context.workspaceState.get<boolean>(IMPORTED_STATE_KEY)) {
        importedCount += await importScope(undefined, "workspaceValue", vscode.ConfigurationTarget.Workspace);

        // Folder settings only differ from workspace settings in multi-root workspaces.
        // NOTE: "workspaceFile" is not part of the vscode typings used by this project.
        const isMultiRootWorkspace = !!(vscode.workspace as { workspaceFile?: vscode.Uri }).workspaceFile;
        if (isMultiRootWorkspace) {
            for (const folder of folders) {
                importedCount += await importScope(folder.uri, "workspaceFolderValue", vscode.ConfigurationTarget.WorkspaceFolder);
            }
        }
        await context.workspaceState.update(IMPORTED_STATE_KEY, true);
    }

    if (importedCount > 0) {
        notifyImported(importedCount);
    }
}

const importScope = async (resource: vscode.Uri | undefined, valueKey: InspectValueKey, target: vscode.ConfigurationTarget): Promise<number> => {
    const legacyConfig = vscode.workspace.getConfiguration(LEGACY_SECTION, resource);
    const config = vscode.workspace.getConfiguration(SECTION, resource);
    let importedCount = 0;

    for (const key of ALL_KEYS) {
        const legacyValue = legacyConfig.inspect(key)?.[valueKey];
        if (isNullOrUndefined(legacyValue) || !isNullOrUndefined(config.inspect(key)?.[valueKey])) {
            continue;
        }

        try {
            await config.update(key, legacyValue, target);
            importedCount++;
        } catch (e) {
            console.error(`Power Mode Reborn: Failed to import "${LEGACY_SECTION}.${key}"`, e);
        }
    }

    return importedCount;
}

const notifyImported = async (importedCount: number) => {
    const isLegacyExtensionActive = !!vscode.extensions.getExtension(LEGACY_EXTENSION_ID);
    const message = `Power Mode Reborn imported ${importedCount} setting${importedCount === 1 ? "" : "s"} from the original Power Mode extension.`
        + (isLegacyExtensionActive ? " Disable or uninstall the original Power Mode extension to avoid duplicate effects." : "");

    const openSettings = "Open Settings";
    const selection = await vscode.window.showInformationMessage(message, openSettings);
    if (selection === openSettings) {
        vscode.commands.executeCommand("workbench.action.openSettings", SECTION);
    }
}

const isNullOrUndefined = (value: any) => value === null || value === undefined;
