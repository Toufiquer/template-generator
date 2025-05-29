import InterfaceInputComponent from '@/components/common/home/main';
import { ModeToggle } from '@/components/common/mode-toggle';

export default function Home() {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center min-h-screen dark:bg-slate-500 dark:text-slate-50 gap-4">
      <div className="w-full flex items-center justify-center">
        <ModeToggle />
      </div>

      <div className="w-full min-h-screen border-1 max-w-7xl"></div>
      {/* <InterfaceInputComponent /> */}
    </div>
  );
}
