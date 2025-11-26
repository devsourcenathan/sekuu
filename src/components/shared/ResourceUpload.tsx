import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ResourceUploadProps {
    onUpload: (files: File[]) => Promise<void>;
    accept?: Record<string, string[]>;
    maxSize?: number;
    maxFiles?: number;
    uploadProgress?: number;
    isUploading?: boolean;
}

export function ResourceUpload({
    onUpload,
    accept = {
        'application/pdf': ['.pdf'],
        'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
        'application/zip': ['.zip'],
    },
    maxSize = 10 * 1024 * 1024, // 10MB
    maxFiles = 5,
    uploadProgress = 0,
    isUploading = false,
}: ResourceUploadProps) {
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                await onUpload(acceptedFiles);
            }
        },
        [onUpload]
    );

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        acceptedFiles,
        fileRejections,
    } = useDropzone({
        onDrop,
        accept,
        maxSize,
        maxFiles,
        disabled: isUploading,
    });

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                    isDragActive && 'border-primary bg-primary/5',
                    !isDragActive && 'border-muted-foreground/25 hover:border-primary/50',
                    isUploading && 'opacity-50 cursor-not-allowed'
                )}
            >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">
                    {isDragActive
                        ? 'Déposez les fichiers ici'
                        : 'Glissez-déposez des fichiers ici, ou cliquez pour sélectionner'}
                </p>
                <p className="text-xs text-muted-foreground">
                    PDF, Images, ZIP (max {formatFileSize(maxSize)})
                </p>
            </div>

            {isUploading && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span>Upload en cours...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                </div>
            )}

            {acceptedFiles.length > 0 && !isUploading && (
                <div className="space-y-2">
                    <p className="text-sm font-medium">Fichiers sélectionnés:</p>
                    {acceptedFiles.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                        >
                            <File className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatFileSize(file.size)}
                                </p>
                            </div>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                    ))}
                </div>
            )}

            {fileRejections.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-destructive">Fichiers rejetés:</p>
                    {fileRejections.map(({ file, errors }, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10"
                        >
                            <X className="h-4 w-4 text-destructive" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{file.name}</p>
                                <p className="text-xs text-destructive">
                                    {errors.map(e => e.message).join(', ')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
