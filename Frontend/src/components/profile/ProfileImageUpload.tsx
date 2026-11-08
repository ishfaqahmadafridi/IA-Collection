import { useProfileImageUpload } from '../../hooks/profile/useProfileImageUpload';
import ProfileImageDisplay from './ProfileImageDisplay';
import ProfileImageRemoveButton from './ProfileImageRemoveButton';
import ProfileImageSelectButton from './ProfileImageSelectButton';
import ProfileImageUploadButton from './ProfileImageUploadButton';
import ProfileImageHint from './ProfileImageHint';
export default function ProfileImageUpload() {
  const { displayImage, userName, isUploading, hasPreview, error, handleImageSelect, handleImageUpload, handleRemoveImage } = useProfileImageUpload();
  return <div className="flex flex-wrap items-center gap-6">
    <div className="relative">
      <ProfileImageDisplay displayImage={displayImage} userName={userName} />
      <ProfileImageRemoveButton onRemove={handleRemoveImage} show={Boolean(displayImage)} />
    </div>
    <div className="flex-1">
      <div className="flex flex-wrap items-center gap-3">
        <ProfileImageSelectButton onSelect={handleImageSelect} />
        <ProfileImageUploadButton onUpload={handleImageUpload} isUploading={isUploading} show={hasPreview} />
      </div>
      <ProfileImageHint />
      {error && <p role="alert">{error}</p>}
    </div>
  </div>;
}
