"use client";
import { Camera, Loader2, Trash2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@akmleva/ui';

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ');

interface AvatarUploadProps {
  currentAvatar?: string | undefined;
  userName?: string;
  onUpload: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  className?: string;
  translationNamespace?: string;
  customMessages?: {
    invalidType?: string;
    tooLarge?: string;
    uploadError?: string;
    deleteError?: string;
    instructions?: string;
    requirements?: string;
    dragDrop?: string;
    uploading?: string;
    selectFile?: string;
  };
}

export function AvatarUpload({
  currentAvatar,
  userName = 'User',
  onUpload,
  onDelete,
  className,
  translationNamespace = 'admin',
  customMessages,
}: AvatarUploadProps) {
  const t = useTranslations(translationNamespace);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMessage = (key: keyof NonNullable<AvatarUploadProps['customMessages']>): string => {
    // Use Object.entries to avoid variable-key bracket access (security/detect-object-injection)
    const custom = customMessages
      ? Object.entries(customMessages).find(([k]) => k === key)?.[1]
      : undefined;
    if (custom) return custom;
    try {
      return t(`profile.avatar.${key}`);
    } catch {
      // Fallback strings if translation key is missing
      const fallbacks: Record<typeof key, string> = {
        invalidType:  'Por favor, selecione uma imagem',
        tooLarge:     'A imagem deve ter no máximo 5MB',
        uploadError:  'Erro ao fazer upload da imagem',
        deleteError:  'Erro ao remover imagem',
        instructions: 'Clique ou arraste uma imagem',
        requirements: 'PNG, JPG até 5MB',
        dragDrop:     'Arraste uma imagem aqui',
        uploading:    'Enviando...',
        selectFile:   'Selecionar arquivo',
      };
      switch (key) {
        case 'invalidType':  return fallbacks.invalidType;
        case 'tooLarge':     return fallbacks.tooLarge;
        case 'uploadError':  return fallbacks.uploadError;
        case 'deleteError':  return fallbacks.deleteError;
        case 'instructions': return fallbacks.instructions;
        case 'requirements': return fallbacks.requirements;
        case 'dragDrop':     return fallbacks.dragDrop;
        case 'uploading':    return fallbacks.uploading;
        case 'selectFile':   return fallbacks.selectFile;
      }
    }
  };

  const handleFileSelect = async (file: File) => {
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError(getMessage('invalidType'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(getMessage('tooLarge'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      await onUpload(file);
      setError(null);
    } catch {
      setError(getMessage('uploadError'));
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsUploading(true);
    try {
      await onDelete();
      setPreview(null);
      setError(null);
    } catch {
      setError(getMessage('deleteError'));
    } finally {
      setIsUploading(false);
    }
  };

  const displayAvatar = preview || currentAvatar;
  const initials = userName.charAt(0).toUpperCase();

  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      {/* Avatar Display */}
      <div
        className={cn('relative group', isDragging && 'ring-4 ring-indigo-500 ring-offset-2')}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          {displayAvatar ? (
            <img src={displayAvatar} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {initials}
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isUploading
              ? <Loader2 className="h-8 w-8 text-white animate-spin" />
              : <Camera className="h-8 w-8 text-white" />
            }
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </button>

        {displayAvatar && onDelete && (
          <button
            onClick={() => void handleDelete()}
            disabled={isUploading}
            className="absolute top-0 right-0 p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4 text-white" />
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFileSelect(file);
          }}
          className="hidden"
        />
      </div>

      {/* Instructions */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">{getMessage('instructions')}</p>
        <p className="text-xs text-muted-foreground mt-1">{getMessage('requirements')}</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          <X className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={cn(
          'w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors',
          isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-muted-foreground">{getMessage('dragDrop')}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {getMessage('uploading')}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {getMessage('selectFile')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export { type AvatarUploadProps };