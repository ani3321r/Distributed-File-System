use axum::{
    extract::{Multipart, Path, State},
    http::{StatusCode, HeaderValue, Method, header},
    response::Json,
    routing::{get, post, delete},
    Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tower_http::cors::{CorsLayer, Any};
use uuid::Uuid;

mod error;
mod storage;

use error::FileSystemError;
use storage::LocalStorage;

#[derive(Serialize, Deserialize)]
struct FileMetadata {
    id: Uuid,
    name: String,
    size: u64,
    created_at: chrono::DateTime<chrono::Utc>,
}

struct AppState {
    storage: LocalStorage,
}

async fn upload_file(
    State(state): State<Arc<AppState>>,
    mut multipart: Multipart,
) -> Result<Json<FileMetadata>, StatusCode> {
    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap().to_string();
        let data = field.bytes().await.unwrap();
        
        let file_id = Uuid::new_v4();
        state.storage.store_file(file_id, &data).await.unwrap();

        let metadata = FileMetadata {
            id: file_id,
            name,
            size: data.len() as u64,
            created_at: chrono::Utc::now(),
        };

        return Ok(Json(metadata));
    }
    
    Err(StatusCode::BAD_REQUEST)
}

async fn get_file(
    State(state): State<Arc<AppState>>,
    Path(file_id): Path<Uuid>,
) -> Result<Vec<u8>, StatusCode> {
    state.storage.get_file(file_id)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)
}

async fn delete_file(
    State(state): State<Arc<AppState>>,
    Path(file_id): Path<Uuid>,
) -> StatusCode {
    match state.storage.delete_file(file_id).await {
        Ok(_) => StatusCode::NO_CONTENT,
        Err(_) => StatusCode::NOT_FOUND,
    }
}

#[tokio::main]
async fn main() {
    // Initialize logging
    tracing_subscriber::fmt::init();

    // Initialize storage
    let storage = LocalStorage::new("./files");
    storage.init().await.unwrap();

    // Create app state
    let state = Arc::new(AppState { storage });

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_origin("http://localhost:8000".parse::<HeaderValue>().unwrap())
        .allow_headers([header::CONTENT_TYPE]);

    // Build router with CORS
    let app = Router::new()
        .route("/files", post(upload_file))
        .route("/files/:id", get(get_file))
        .route("/files/:id", delete(delete_file))
        .layer(cors)
        .with_state(state);

    // Start server
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("Server running on http://127.0.0.1:3000");
    axum::serve(listener, app).await.unwrap();
}