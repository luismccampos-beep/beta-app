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
export declare function AvatarUpload({ currentAvatar, userName, onUpload, onDelete, className, translationNamespace, customMessages, }: AvatarUploadProps): import("react/jsx-runtime").JSX.Element;
export { type AvatarUploadProps };
