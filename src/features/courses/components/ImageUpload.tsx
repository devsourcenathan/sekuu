import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
    value?: File | string; // Can be File or URL string
    onChange: (value: File | undefined) => void;
    disabled?: boolean;
    maxSize?: number; // in MB
    className?: string;
}

export function ImageUpload({
    value,
    onChange,
    disabled = false,
    maxSize = 2, // Backend limit is 2MB
    className,
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string>('');
    const [preview, setPreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Generate preview URL
    const getPreviewUrl = (file: File | string | undefined): string => {
        if (!file) return '';
        if (typeof file === 'string') return file; // Already a URL
        return URL.createObjectURL(file); // Create object URL for File
    };

    // Update preview when value changes
    useState(() => {
        if (value) {
            setPreview(getPreviewUrl(value));
        }
    });

    const validateFile = (file: File): boolean => {
        setError('');

        // Check file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return false;
        }

        // Check file size (backend limit is 2MB)
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > maxSize) {
            setError(`File size must be less than ${maxSize}MB`);
            return false;
        }

        return true;
    };

    const handleFile = (file: File) => {
        if (!validateFile(file)) return;

        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        // Pass the File object to parent
        onChange(file);
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleRemove = () => {
        setPreview('');
        onChange(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const currentPreview = preview || (typeof value === 'string' ? value : '');

    return (
        <div className={cn('space-y-2', className)}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                disabled={disabled}
                className="hidden"
            />

            {currentPreview ? (
                <div className="relative group">
                    <img
                        src={currentPreview}
                        alt="Cover"
                        className="w-full h-48 object-cover rounded-lg border"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemove}
                            disabled={disabled}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    className={cn(
                        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                        isDragging
                            ? 'border-primary bg-primary/5'
                            : 'border-muted-foreground/25 hover:border-primary/50',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <div className="flex flex-col items-center gap-2">
                        {isDragging ? (
                            <Upload className="h-10 w-10 text-primary" />
                        ) : (
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        )}
                        <div className="text-sm">
                            <span className="font-semibold text-primary">Click to upload</span>
                            {' or drag and drop'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, WEBP up to {maxSize}MB
                        </p>
                    </div>
                </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
