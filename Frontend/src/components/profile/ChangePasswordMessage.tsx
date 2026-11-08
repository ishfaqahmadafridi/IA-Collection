import type { ProfileMessageProps } from '../../types/profile';

export default function ChangePasswordMessage({ message }: ProfileMessageProps) {
    if (!message.text) return null;

    return (
        <div role={message.type === 'success' ? 'status' : 'alert'} className={`p-4 rounded-lg ${
            message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
            {message.text}
        </div>
    );
}
