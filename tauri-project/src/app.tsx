import React, { useEffect, useCallback } from 'react';
import * as tauriEvent from '@tauri-apps/api/event';
import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';
import { RUNNING_IN_TAURI } from './tauri/TauriProvider';
import { useToast, Text, Button } from "@chakra-ui/react";
import MainRouter from '@/router';
import { RouterProvider } from 'react-router-dom';
import { Toast } from './components/Common/toast';

export default function App() {
    const toast = useToast();

    // Handle update installation
    const handleInstallUpdate = useCallback(async (update) => {
        Toast(toast, {
            title: "Installing update",
            description: "Will relaunch afterwards",
            status: "success",
            position: "top-right",
        });

        try {
            await update.downloadAndInstall();
            await relaunch();
        } catch (error) {
            console.error("Error installing update:", error);
            Toast(toast, {
                title: "Update failed",
                description: "There was an error installing the update.",
                status: "error",
                position: "top-right",
            });
        }
    }, [toast]);

    if (RUNNING_IN_TAURI) {
        useEffect(() => {
            const setupEventListener = async () => {
                const unlisten = await tauriEvent.listen('add-new-website', ({ payload }) => {
                    console.log(payload);
                });
                return unlisten;
            };
        
            const cleanupListener = async () => {
                const unlisten = await setupEventListener();
                return unlisten; // Return cleanup function for useEffect cleanup
            };
        
            cleanupListener().then(unlisten => {
                return () => unlisten(); // Cleanup listener on component unmount
            });
        
            return () => {};
        }, []);
        

        // Check for updates on component mount
        useEffect(() => {
            const checkForUpdate = async () => {
                try {
                    const update = await check();
                    if (update?.available) {
                        Toast(toast, {
                            title: `Update available`,
                            description: (
                                <>
                                    <Text>Update</Text>
                                    <Button style={{ width: '100%' }} onClick={() => handleInstallUpdate(update)}>
                                        Install update and relaunch
                                    </Button>
                                </>
                            ),
                            status: "success",
                            position: "top-right",
                        });
                    }
                } catch (error) {
                    console.error("Error checking for updates:", error);
                    Toast(toast, {
                        title: "Error checking for update",
                        description: "There was an error checking for updates.",
                        status: "error",
                        position: "top-right",
                    });
                }
            };

            checkForUpdate();
        }, [toast, handleInstallUpdate]);
    }
    return <RouterProvider router={MainRouter} />;
}
