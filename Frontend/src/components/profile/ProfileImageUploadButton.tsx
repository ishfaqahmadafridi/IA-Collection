import type { ProfileImageUploadButtonProps } from '../../types/profile';

export default function ProfileImageUploadButton({ onUpload, isUploading, show }: ProfileImageUploadButtonProps) {
    if (!show) return null;

    return (
        <button
            onClick={onUpload}
            disabled={isUploading}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
    );
}
