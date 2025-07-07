use reqwest::{Body, Client, Method};
use std::collections::HashMap;

#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct AuthConfig {
    auth_type: String,
    values: HashMap<String, String>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct RequestConfig {
    parameters: Option<Vec<(String, String)>>,
    body: Option<String>,
    headers: Option<Vec<(String, String)>>,
    authorisation: Option<AuthConfig>,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct Props {
    url: String,
    method: String,
    request_config: Option<RequestConfig>,
}

#[tauri::command]
async fn make_request(props: Props) -> Result<String, String> {
    println!("{:?}", props);
    let client: Client = Client::new();

    let method: Method = props
        .method
        .parse()
        .map_err(|e| format!("Invalid HTTP method: {}", e))?;

    match method {
        Method::GET => {
            let mut request = client.request(method, props.url);

            if let Some(request_config) = props.request_config {
                if let Some(body) = request_config.body {
                    request = request.header("Content-Type", "application/json");
                    request = request.body(Body::from(body));
                }

                if let Some(parameters) = request_config.parameters {
                    request = request.query(&parameters);
                }

                if let Some(headers) = request_config.headers {
                    for (key, value) in headers.iter() {
                        request = request.header(key, value);
                    }
                }
                
                if let Some(authorisation) = request_config.authorisation {
                    match authorisation.auth_type.as_str() {
                        "basic" => {
                            println!("{:?}", authorisation.values);
                            if let Some(username) = authorisation.values.get("username") {
                                let password = authorisation.values.get("password");
                                request = request.basic_auth(username, password);
                            }
                        }
                        
                        "bearer" => {
                            println!("{:?}", authorisation.values);
                            if let Some(token) = authorisation.values.get("token") {
                                request = request.bearer_auth(token);
                            }
                        }
                        
                        _ => {
                            println!("{:?}", authorisation.values);
                        }

                    }
                }
            }

            match request.send().await {
                Ok(resp) => {
                    let status = resp.status();
                    let text = resp
                        .text()
                        .await
                        .unwrap_or_else(|_| "<failed to read body>".into());
                    println!("Status: {:?}, Body: {}", status, text);
                    Ok(text)
                }
                Err(e) => {
                    println!("Request failed: {:?}", e);
                    Err(format!("Request failed: {}", e))
                }
            }
        }

        Method::POST => {
            let mut request = client.request(method, props.url);

            if let Some(request_config) = props.request_config {
                if let Some(body) = request_config.body {
                    request = request.header("Content-Type", "application/json");
                    request = request.body(Body::from(body));
                }

                if let Some(parameters) = request_config.parameters {
                    request = request.query(&parameters);
                }

                if let Some(headers) = request_config.headers {
                    for (key, value) in headers.iter() {
                        request = request.header(key, value);
                    }
                }
                
                if let Some(authorisation) = request_config.authorisation {
                    match authorisation.auth_type.as_str() {
                        "basic" => {
                            println!("{:?}", authorisation.values);
                            if let Some(username) = authorisation.values.get("username") {
                                let password = authorisation.values.get("password");
                                request = request.basic_auth(username, password);
                            }
                        }
                        
                        "bearer" => {
                            println!("{:?}", authorisation.values);
                            if let Some(token) = authorisation.values.get("token") {
                                request = request.bearer_auth(token);
                            }
                        }
                        
                        _ => {
                            println!("{:?}", authorisation.values);
                        }

                    }
                }
            }

            match request.send().await {
                Ok(resp) => {
                    let status = resp.status();
                    let text = resp
                        .text()
                        .await
                        .unwrap_or_else(|_| "<failed to read body>".into());
                    println!("Status: {:?}, Body: {}", status, text);
                    Ok(text)
                }
                Err(e) => {
                    println!("Request failed: {:?}", e);
                    Err(format!("Request failed: {}", e))
                }
            }
        },

        Method::PATCH => {
            let mut request = client.request(method, props.url);

            if let Some(request_config) = props.request_config {
                if let Some(body) = request_config.body {
                    request = request.body(Body::from(body));
                }

                if let Some(parameters) = request_config.parameters {
                    request = request.query(&parameters);
                }

                if let Some(headers) = request_config.headers {
                    for (key, value) in headers.iter() {
                        request = request.header(key, value);
                    }
                }
                
                if let Some(authorisation) = request_config.authorisation {
                    match authorisation.auth_type.as_str() {
                        "basic" => {
                            println!("{:?}", authorisation.values);
                            if let Some(username) = authorisation.values.get("username") {
                                let password = authorisation.values.get("password");
                                request = request.basic_auth(username, password);
                            }
                        }
                        
                        "bearer" => {
                            println!("{:?}", authorisation.values);
                            if let Some(token) = authorisation.values.get("token") {
                                request = request.bearer_auth(token);
                            }
                        }
                        
                        _ => {
                            println!("{:?}", authorisation.values);
                        }

                    }
                }
            }

            match request.send().await {
                Ok(resp) => {
                    let status = resp.status();
                    let text = resp
                        .text()
                        .await
                        .unwrap_or_else(|_| "<failed to read body>".into());
                    println!("Status: {:?}, Body: {}", status, text);
                    Ok(text)
                }
                Err(e) => {
                    println!("Request failed: {:?}", e);
                    Err(format!("Request failed: {}", e))
                }
            }
        },

        Method::PUT => {
            let mut request = client.request(method, props.url);

            if let Some(request_config) = props.request_config {
                if let Some(body) = request_config.body {
                    request = request.body(Body::from(body));
                }

                if let Some(parameters) = request_config.parameters {
                    request = request.query(&parameters);
                }

                if let Some(headers) = request_config.headers {
                    for (key, value) in headers.iter() {
                        request = request.header(key, value);
                    }
                }
                
                if let Some(authorisation) = request_config.authorisation {
                    match authorisation.auth_type.as_str() {
                        "basic" => {
                            println!("{:?}", authorisation.values);
                            if let Some(username) = authorisation.values.get("username") {
                                let password = authorisation.values.get("password");
                                request = request.basic_auth(username, password);
                            }
                        }
                        
                        "bearer" => {
                            println!("{:?}", authorisation.values);
                            if let Some(token) = authorisation.values.get("token") {
                                request = request.bearer_auth(token);
                            }
                        }
                        
                        _ => {
                            println!("{:?}", authorisation.values);
                        }

                    }
                }
            }

            match request.send().await {
                Ok(resp) => {
                    let status = resp.status();
                    let text = resp
                        .text()
                        .await
                        .unwrap_or_else(|_| "<failed to read body>".into());
                    println!("Status: {:?}, Body: {}", status, text);
                    Ok(text)
                }
                Err(e) => {
                    println!("Request failed: {:?}", e);
                    Err(format!("Request failed: {}", e))
                }
            }
        },

        Method::DELETE => {
            let mut request = client.request(method, props.url);

            if let Some(request_config) = props.request_config {
                if let Some(body) = request_config.body {
                    request = request.body(Body::from(body));
                }

                if let Some(parameters) = request_config.parameters {
                    request = request.query(&parameters);
                }

                if let Some(headers) = request_config.headers {
                    for (key, value) in headers.iter() {
                        request = request.header(key, value);
                    }
                }
                
                if let Some(authorisation) = request_config.authorisation {
                    match authorisation.auth_type.as_str() {
                        "basic" => {
                            println!("{:?}", authorisation.values);
                            if let Some(username) = authorisation.values.get("username") {
                                let password = authorisation.values.get("password");
                                request = request.basic_auth(username, password);
                            }
                        }
                        
                        "bearer" => {
                            println!("{:?}", authorisation.values);
                            if let Some(token) = authorisation.values.get("token") {
                                request = request.bearer_auth(token);
                            }
                        }
                        
                        _ => {
                            println!("{:?}", authorisation.values);
                        }

                    }
                }
            }

            match request.send().await {
                Ok(resp) => {
                    let status = resp.status();
                    let text = resp
                        .text()
                        .await
                        .unwrap_or_else(|_| "<failed to read body>".into());
                    println!("Status: {:?}, Body: {}", status, text);
                    Ok(text)
                }
                Err(e) => {
                    println!("Request failed: {:?}", e);
                    Err(format!("Request failed: {}", e))
                }
            }
        },
        _ => {
            println!("{}", "post-alt");
            Ok(String::from("dv"))
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![make_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
