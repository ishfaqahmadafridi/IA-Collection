import type { ProfileInputProps } from '../../types/profile';
export default function ProfileInput({ config, value, onChange }: ProfileInputProps) {
  return <div className="space-y-2">
    <label htmlFor={config.id} className="block text-sm font-medium capitalize">{config.label}</label>
    <input id={config.id} name={config.name} type={config.type} autoComplete={config.autoComplete}
      required={config.required} maxLength={config.maxLength} value={value} onChange={onChange}
      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-rose-500" />
  </div>;
}
