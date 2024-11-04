use std::path::PathBuf;
use tokio::fs;
use uuid::Uuid;
use crate::error::FileSystemError;

pub struct LocalStorage {
    base_path: PathBuf,
}

impl LocalStorage {
    pub fn new(base_path: impl Into<PathBuf>) -> Self {
        Self {
            base_path: base_path.into(),
        }
    }

    pub async fn init(&self) -> Result<(), FileSystemError> {
        fs::create_dir_all(&self.base_path).await?;
        Ok(())
    }

    pub async fn store_file(&self, id: Uuid, data: &[u8]) -> Result<(), FileSystemError> {
        let file_path = self.base_path.join(id.to_string());
        fs::write(file_path, data).await?;
        Ok(())
    }

    pub async fn get_file(&self, id: Uuid) -> Result<Vec<u8>, FileSystemError> {
        let file_path = self.base_path.join(id.to_string());
        let data = fs::read(file_path).await?;
        Ok(data)
    }

    pub async fn delete_file(&self, id: Uuid) -> Result<(), FileSystemError> {
        let file_path = self.base_path.join(id.to_string());
        fs::remove_file(file_path).await?;
        Ok(())
    }
}
