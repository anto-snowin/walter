export function LoadingState({ message = 'LOADING WALTER DATA...' }: { message?: string }) {
  return (
    <div className="border-[2px] border-[#171717] bg-[#EDE8DD] p-12 text-center flex flex-col items-center justify-center my-6 shadow-[4px_4px_0px_#171717]">
      <div className="w-10 h-10 border-[3px] border-[#171717] border-t-[#C8FF00] animate-spin mb-4" />
      <p className="font-display font-bold tracking-wider text-sm uppercase text-[#171717]">
        {message}
      </p>
    </div>
  );
}
