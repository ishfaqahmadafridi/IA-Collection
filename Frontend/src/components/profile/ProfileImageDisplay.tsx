import type { ProfileImageDisplayProps } from '../../types/profile';

export default function ProfileImageDisplay({ displayImage, userName }: ProfileImageDisplayProps) {
    return (
        <div className="relative">
            {displayImage ? (
                <img
                    src={displayImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
            ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-gray-200">
                    {userName.charAt(0).toUpperCase()}
                </div>
            )}
        </div>
    );
}
