// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use reqwest;
use serde_json::Value;


#[tauri::command]
async fn call(url: &str, method: &str) -> Result<Value, String> {
    println!("{} {}", url, method);

    let response = reqwest::get(url).await;

    match response {
        Ok(resp) => match resp.json::<Value>().await {
            Ok(body) => {
                println!("{:?}", body);
                Ok(body)
            }
            ,
            Err(err) => {
                println!("Failed to read response body: {:?}", err);
                Err(format!("Failed to read response body: {:?}", err))
            }
        },
        Err(err) => {
            println!("HTTP GET request failed: {:?}", err);
            Err(format!("HTTP GET request failed: {:?}", err))
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![call])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
