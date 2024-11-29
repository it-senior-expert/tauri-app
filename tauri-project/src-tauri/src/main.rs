// this hides the console for Windows release builds
#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]
#[macro_use]
extern crate lazy_static;

lazy_static! {
  static ref AUTO_START_SELECTED: Mutex<bool> = Mutex::new(false);
  static ref ALWAYS_ON_TOP: Mutex<bool> = Mutex::new(false);
}
use std::sync::Mutex;
use tauri::Manager; // used by .get_window
use tauri::{ self, SystemTrayEvent, SystemTrayMenuItem };
use tauri::{ CustomMenuItem, SystemTray, SystemTrayMenu };
use tauri::{ Menu, Submenu };
use tauri_plugin_autostart::MacosLauncher;
// use tauri_plugin_positioner::Positioner;
use std::time::{ SystemTime, UNIX_EPOCH };

#[derive(Clone, serde::Serialize)]
struct SingleInstancePayload {
  args: Vec<String>,
  cwd: String,
}

#[derive(serde::Serialize)]
struct CustomResponse {
  message: String,
}

fn get_epoch_ms() -> u128 {
  SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis()
}

#[tauri::command]
async fn message_from_rust(window: tauri::Window) -> Result<CustomResponse, String> {
  println!("Called from {}", window.label());
  window.emit("add-new-website", "Hello from Rust!").expect("Failed to emit event");
  Ok(CustomResponse {
    message: format!("Hello from rust!\nTime: {}", get_epoch_ms()),
  })
}

fn create_app_menu() -> Menu {
  return Menu::new().add_submenu(
    Submenu::new(
      "Tauri App",
      Menu::new()
        .add_item(CustomMenuItem::new("about_app".to_string(), "About App"))
        .add_item(CustomMenuItem::new("new_website", "New Website"))
    )
  );
}


fn main() {
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let hide = CustomMenuItem::new("hide".to_string(), "Hide");
  let auto_start = CustomMenuItem::new("auto_start".to_string(), "Auto Start");
  let always_top = CustomMenuItem::new("always_top".to_string(), "Always On Top");
  let tray_menu = SystemTrayMenu::new()
    .add_item(hide)
    .add_item(auto_start)
    .add_item(always_top)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(quit);

  // main window should be invisible to allow either the setup delay or the plugin to show the window
  tauri::Builder
    ::default()
    // .setup(|app| {
    // let id = app.listen_global("add-new-website", |_event| {
    //   println!("got event-name with payload");
    // });
    // app.unlisten(id);
    // app.emit_all("new-website", Payload { message: "Hello World".to_string() }).unwrap();
    // Ok(())
    // app.emit_all("add-new-website", {}).unwrap();
    //   Ok(())
    // })
    .menu(create_app_menu())
    .on_menu_event(|event| {
      match event.menu_item_id() {
        "about_app" => {
          println!("About this app");
        }
        "new_website" => {
          event.window().emit_all("add-new-website", "Submenu Item 2 clicked").unwrap();
          println!("New Website Added");
        }
        _ => {}
      }
    })
    .system_tray(SystemTray::new().with_menu(tray_menu))
    .on_system_tray_event(|app, event| {
      match event {
        SystemTrayEvent::LeftClick { .. } => {
          let window = match app.get_window("main") {
            Some(window) =>
              match window.is_visible().expect("winvis") {
                true => {
                  // hide the window instead of closing due to processes not closing memory leak: https://github.com/tauri-apps/wry/issues/590
                  window.hide().expect("winhide");
                  // window.close().expect("winclose");
                  return;
                }
                false => window,
              }
            None => {
              return;
            }
          };
          #[cfg(not(target_os = "macos"))]
          {
            window.show().unwrap();
          }
          window.set_focus().unwrap();
        }
        SystemTrayEvent::RightClick { position: _, size: _, .. } => {
          println!("system tray received a right click");
        }
        SystemTrayEvent::DoubleClick { position: _, size: _, .. } => {
          println!("system tray received a double click");
        }
        SystemTrayEvent::MenuItemClick { id, .. } =>
          match id.as_str() {
            "hide" => {
              let window = app.get_window("main").unwrap();
              window.hide().unwrap();
            }
            "always_top" => {
              let window = app.get_window("main").unwrap();
              let mut always_on_top = ALWAYS_ON_TOP.lock().unwrap();

              // Toggle the always on top state
              *always_on_top = !*always_on_top;
              window.set_always_on_top(*always_on_top).unwrap();

              // Update the menu item checked state based on the window's always on top status
              let tray = app.tray_handle();
              let always_top_item = tray.get_item("always_top");
              always_top_item.set_selected(*always_on_top).expect("Failed to set menu item state");

              println!("Setting window to always stay on top: {}", *always_on_top);
            }
            "auto_start" => {
              let mut selected = AUTO_START_SELECTED.lock().unwrap();
              *selected = !*selected; // Toggle the state

              let tray = app.tray_handle();
              let auto_start_item = tray.get_item("auto_start");
              auto_start_item.set_selected(*selected).expect("Failed to set menu item state");
            }
            "quit" => {
              std::process::exit(0);
            }
            _ => {}
          }
        _ => {}
      }
    })
    .invoke_handler(tauri::generate_handler![message_from_rust])
    .plugin(
      tauri_plugin_single_instance::init(|app, argv, cwd| {
        app.emit_all("fromOtherInstance", SingleInstancePayload { args: argv, cwd }).unwrap();
      })
    )
    .plugin(
      tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, Some(vec!["--flag1", "--flag2"]))
    )
    // .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_store::Builder::default().build())
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
