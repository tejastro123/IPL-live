import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-ipl-gold animate-spin" />
      <p className="mt-3 text-sm text-gray-500">{text}...</p>
    </div>
  );
}
