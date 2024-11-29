import React, { useEffect, useState, useCallback } from 'react';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import SiteModal from './Common/modal';

const TauriAPI: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    // Define the callback for the event
    const myCallback = useCallback((e: any) => {
        console.log('Received event:', e);
        setModalOpen(true);
    }, []);

    useEffect(() => {
        // Set up the event listener
        const setupListener = async () => {
            try {
                const unlisten: UnlistenFn = await listen('add-new-website', myCallback);
                console.log('Event listener set up successfully.');

                // Return unlisten function for cleanup
                return unlisten;
            } catch (error) {
                console.error('Error setting up event listener:', error);
                return undefined;
            }
        };

        // Call the setup function and handle cleanup
        const unlistenEvent = setupListener();

        // Cleanup the event listener on unmount
        return () => {
            unlistenEvent.then((unlisten) => {
                if (unlisten) {
                    unlisten(); // Only call unlisten if it's a valid function
                }
            }).catch((error) => {
                console.error('Error cleaning up event listener:', error);
            });
        };
    }, [myCallback]);

    return (
        <div>
            <h1>Tauri Event Handling</h1>
            {isModalOpen && <SiteModal />}
        </div>
    );
};

export default TauriAPI;
