
import { emit, listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { Window } from '@tauri-apps/api/window';

/**
 * Emits an event to the Tauri backend
 * @param eventName The event name to emit
 * @param payload The data to send with the event
 */
export const emitEvent = async (eventName: string, payload: any) => {
  try {
    await emit(eventName, payload);
    console.log(`Event ${eventName} emitted with payload:`, payload);
  } catch (error) {
    console.error(`Error emitting event ${eventName}:`, error);
  }
};

/**
 * Listens for an event from the Tauri backend and handles it
 * @param eventName The event name to listen for
 * @param handler The handler function that will process the event when it is received
 */
export const listenForEvent = (eventName: string, handler: (event: any) => void) => {
  listen(eventName, (event) => {
    handler(event);
  })
    .then(() => {
      console.log(`Listening for event: ${eventName}`);
    })
    .catch((error) => {
      console.error(`Error listening for event ${eventName}:`, error);
    });
};

/**
 * Example function to invoke a command from Tauri backend
 * This can be used to call Rust functions directly (for example, calling a command in `main.rs`).
 * @param command The name of the command to invoke
 * @param payload The payload data to send with the command
 */
export const invokeCommand = async (command: string, payload: any) => {
  try {
    const response = await invoke(command, payload);
    console.log(`Command ${command} invoked successfully. Response:`, response);
    return response;
  } catch (error) {
    console.error(`Error invoking command ${command}:`, error);
  }
};

/**
 * Sets up an event listener for opening a new widget (example use case).
 * This function can be called in a React component to handle the `create-new-widget` event.
 */
export const setupWidgetListener = () => {
  listenForEvent('create-new-widget', () => {
    console.log('Received create-new-widget event from backend!');
    // Here, you can trigger state updates or UI changes in your frontend
    // For example, show a new widget in your React component
  });
};

/**
 * Maximize the Tauri window
 */
export const maximizeWindow = async () => {
  try {
    const mainWindow = Window.getCurrent();
    await mainWindow.maximize();
    console.log('Window maximized');
  } catch (error) {
    console.error('Error maximizing window:', error);
  }
};

/**
 * Close the current Tauri window
 */
export const closeWindow = async () => {
  try {
    const mainWindow = Window.getCurrent();
    await mainWindow.close();
    console.log('Window closed');
  } catch (error) {
    console.error('Error closing window:', error);
  }
};


