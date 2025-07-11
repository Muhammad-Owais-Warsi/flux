use reqwest::{Body, Client, Method, RequestBuilder, Response};
use std::collections::HashMap;
use std::time::Instant;

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

#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct HttpResponse {
    status: u16,
    status_text: String,
    headers: HashMap<String, String>,
    body: String,
    url: String,
    time_ms: u128,
}

fn build_request(mut request: RequestBuilder, request_config: RequestConfig) -> RequestBuilder {
    
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
    
    request
}

async fn build_result(response: Response, start_time: Instant) -> HttpResponse {
    let elapsed = start_time.elapsed();
    let status = response.status();
    let status_code = status.as_u16();
    let status_text = status.canonical_reason().unwrap_or("Unknown").to_string();
    let url = response.url().to_string();
    
    let mut response_headers = HashMap::new();
    for (key, value) in response.headers().iter() {
        response_headers.insert(
            key.to_string(),
            value.to_str().unwrap_or("").to_string(),
        );
    }
    
    let text = response
        .text()
        .await
        .unwrap_or_else(|_| "<failed to read body>".into());
    
    HttpResponse {
        status: status_code,
        status_text,
        headers: response_headers,
        body: text,
        url: url,
        time_ms: elapsed.as_millis(),
    }
} 

#[tauri::command]
async fn make_request(props: Props) -> Result<HttpResponse, String> {
    println!("{:?}", props);
    let client: Client = Client::new();
    let start_time = Instant::now();

    let method: Method = props
        .method
        .parse()
        .map_err(|e| format!("Invalid HTTP method: {}", e))?;


    match method {
        Method::GET => {
            let mut request = client.request(method, props.url);

            if let Some(request_config) = props.request_config {
                request = build_request(request, request_config);
            }

            match request.send().await {
                Ok(resp) => {
                    let result = build_result(resp, start_time).await;      
                    Ok(result)    
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
               request = build_request(request, request_config);
            }

            match request.send().await {
                Ok(resp) => {
                    let result = build_result(resp, start_time).await;      
                    Ok(result)
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
                request = build_request(request, request_config);
            }

            match request.send().await {
                Ok(resp) => {
                    let result = build_result(resp, start_time).await;      
                    Ok(result)
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
                request = build_request(request, request_config);
            }

            match request.send().await {
                Ok(resp) => {
                    let result = build_result(resp, start_time).await;      
                    Ok(result)
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
                request = build_request(request, request_config);
            }

            match request.send().await {
                Ok(resp) => {
                    let result = build_result(resp, start_time).await;      
                    Ok(result)
                }
                Err(e) => {
                    println!("Request failed: {:?}", e);
                    Err(format!("Request failed: {}", e))
                }
            }
        },
        
        Method::HEAD => {
            let mut request = client.request(method, props.url);   
            
            match request.send().await {
                Ok(resp) => {
                    let result = build_result(resp, start_time).await;   
                    Ok(result)
                }
                Err(e) => {
                    println!("Request failed: {:?}", e);
                    Err(format!("Request failed: {}", e))
                }
            }
        },
        
        Method::OPTIONS => {
            let mut request = client.request(method, props.url);   
            
            match request.send().await {
                Ok(resp) => {
                    let result = build_result(resp, start_time).await;   
                    Ok(result)
                }
                Err(e) => {
                    println!("Request failed: {:?}", e);
                    Err(format!("Request failed: {}", e))
                }
            }
        }
      
        _ => {
            println!("{}", "post-alt");
            Err(String::from("Unsupported HTTP method"))
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
