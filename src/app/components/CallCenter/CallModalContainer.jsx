'use client';

import CallModal from './CallModal';
import { useCall } from '@/context/CallContext';

const CallModalContainer = () => {
  const { isVisible } = useCall();
  if (!isVisible) return null;

  return (
    <div className="z-[9998]">
      <CallModal />
    </div>
  );
};

export default CallModalContainer;
