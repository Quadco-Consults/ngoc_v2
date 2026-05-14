export default function Loader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <div
        className={`${sizeClasses[size]} border-gray-200 border-t-[#00AD51] rounded-full animate-spin`}
      />
    </div>
  );
}
