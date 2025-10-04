import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void;
  isUploading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded, isUploading }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesUploaded(acceptedFiles);
  }, [onFilesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/css': ['.css'],
      'text/javascript': ['.js', '.jsx', '.ts', '.tsx'],
      'text/html': ['.html', '.htm']
    },
    multiple: true
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={isUploading} />
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Drop files here' : 'Upload files to scan'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop your CSS, JS, or HTML files here, or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supported formats: .css, .js, .jsx, .ts, .tsx, .html, .htm
            </p>
          </div>
          
          {isUploading && (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Analyzing files...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
