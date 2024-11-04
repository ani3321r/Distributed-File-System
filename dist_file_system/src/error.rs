use thiserror::Error;

#[derive(Error, Debug)]
pub enum FileSystemError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error("File not found")]
    FileNotFound,
    #[error("Invalid file data")]
    InvalidFileData,
} 