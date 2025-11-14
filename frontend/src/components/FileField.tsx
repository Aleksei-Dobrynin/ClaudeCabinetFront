import React, { useState } from 'react';
import {
  TextField,
  Box,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslation } from 'react-i18next';

type FileFieldType = {
  value?: string;
  error?: boolean;
  helperText?: string;
  fieldName?: string;
  inputKey?: string;
  onClear: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, error?: string) => void;
  idFile?: string;
  // New optional props for file restrictions
  allowedFileTypes?: string[];  // Array of allowed MIME types or extensions
  maxFileSize?: number;         // Max file size in bytes
};

const FileField: React.FC<FileFieldType> = ({
  value,
  error,
  helperText,
  fieldName,
  inputKey,
  onClear,
  onChange,
  idFile,
  allowedFileTypes,
  maxFileSize,
}) => {
  const { t } = useTranslation();
  // Localized error state
  const [localError, setLocalError] = useState<string | null>(null);

  const uniqueId = React.useMemo(() => idFile || `file-input-${Math.random().toString(36).substr(2, 9)}`, [idFile]);

  // Helper to format file size in a readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
  };

  // Function to check file type
  const isFileTypeAllowed = (file: File): boolean => {
    if (!allowedFileTypes || allowedFileTypes.length === 0) return true;
    
    // Check if file type is in allowed types
    return allowedFileTypes.some(type => {
      // Handle extensions (e.g. '.pdf')
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      // Handle MIME types (e.g. 'image/jpeg')
      return file.type === type;
    });
  };

  // Handler for file change
  const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    
    if (files && files.length > 0) {
      // Check file size
      if (maxFileSize && files[0].size > maxFileSize) {
        const errorMsg = t('common:fileField.fileTooLarge', {
          maxSize: formatFileSize(maxFileSize),
          fileSize: formatFileSize(files[0].size)
        });
        setLocalError(errorMsg);
        onChange(ev, errorMsg);
        return;
      }
      
      // Check file type
      if (!isFileTypeAllowed(files[0])) {
        const allowedTypesStr = allowedFileTypes?.join(', ');
        const errorMsg = t('common:fileField.invalidFileType', { allowedTypes: allowedTypesStr });
        setLocalError(errorMsg);
        onChange(ev, errorMsg);
        return;
      }
      
      // File is valid
      setLocalError(null);
    }
    
    // Setup field name if needed
    if (fieldName != null) {
      ev.target.name = fieldName;
    }
    
    onChange(ev);
  };
  
  // Handle clear button click
  const handleClear = () => {
    setLocalError(null);
    onClear();
  };

  return (
    <TextField
      error={error || !!localError}
      size="small"
      variant="outlined"
      fullWidth
      value={value || ''}
      InputProps={{
        readOnly: true, 
        endAdornment: (
          <Box display="flex" alignItems="center">
            <IconButton
              component="label"
              htmlFor={uniqueId} 
              style={{ padding: 0 }}
            >
              <CloudUploadIcon style={{ cursor: 'pointer' }} />
              <input
                style={{ display: 'none' }}
                id={uniqueId} 
                type="file"
                multiple={false}
                key={inputKey} 
                onChange={handleFileChange}
                accept={allowedFileTypes?.join(',')}
              />
            </IconButton>
            <IconButton onClick={handleClear} style={{ padding: 0 }}>
              <ClearIcon style={{ cursor: 'pointer' }} />
            </IconButton>
          </Box>
        ),
      }}
      helperText={localError || (error ? helperText : null)}
    />
  );
};

export default FileField;