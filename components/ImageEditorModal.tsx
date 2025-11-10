import React, { ReactElement, useEffect, useRef } from 'react';

declare var Cropper: any;

interface ImageEditorModalProps {
  src: string;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}

// Icons
const RotateLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>);
const RotateRightIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15l-2 5L9 9l-2-5 5 2zm0 0l5 5M4.05 13.95l2.122-2.122m5.657-5.656l2.12-2.122" /></svg>);
const FlipHorizontalIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 16V8m-4 4h8m4 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const FlipVerticalIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8m-4-4v8m0 4a9 9 0 110-18 9 9 0 010 18z" /></svg>);
const ResetIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10M20 20l-1.5-1.5A9 9 0 003.5 14" /></svg>);

const IconButton: React.FC<React.PropsWithChildren<{ onClick: () => void, label: string }>> = ({ children, onClick, label }) => (
    <button type="button" onClick={onClick} title={label} className="p-2 rounded-md bg-brand-wheat-100 hover:bg-brand-wheat-200 text-brand-wheat-800 transition">
        {children}
        <span className="sr-only">{label}</span>
    </button>
);

export default function ImageEditorModal({ src, onClose, onSave }: ImageEditorModalProps): ReactElement {
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    if (imageRef.current) {
      const cropper = new Cropper(imageRef.current, {
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.8,
        restore: false,
        guides: false,
        center: false,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
      });
      cropperRef.current = cropper;
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }
    };
  }, [onClose, src]);

  const handleSave = () => {
    if (cropperRef.current) {
      const dataUrl = cropperRef.current.getCroppedCanvas().toDataURL();
      onSave(dataUrl);
    }
  };

  const rotate = (deg: number) => cropperRef.current?.rotate(deg);
  const flip = (axis: 'x' | 'y') => {
      const cropper = cropperRef.current;
      if (axis === 'x') cropper?.scaleX(cropper.getData().scaleX * -1);
      if (axis === 'y') cropper?.scaleY(cropper.getData().scaleY * -1);
  }
  const reset = () => cropperRef.current?.reset();


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-brand-wheat-200 flex justify-between items-center flex-shrink-0">
            <h2 className="text-xl font-bold text-brand-wheat-900">Image Editor</h2>
            <button 
                onClick={onClose} 
                className="bg-brand-wheat-200 text-brand-wheat-800 rounded-full h-8 w-8 flex items-center justify-center text-2xl font-bold hover:bg-brand-wheat-300 transition"
                aria-label="Close image editor"
            >
            &times;
            </button>
        </div>
        <div className="flex-grow p-4 overflow-hidden bg-brand-wheat-50">
            <div className="w-full h-full">
                <img ref={imageRef} src={src} alt="Image to edit" style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }} />
            </div>
        </div>
        <div className="p-4 border-t border-brand-wheat-200 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
             <div className="flex items-center gap-2">
                <IconButton onClick={() => rotate(-90)} label="Rotate Left"><RotateLeftIcon /></IconButton>
                <IconButton onClick={() => rotate(90)} label="Rotate Right"><RotateRightIcon /></IconButton>
                <div className="w-px h-6 bg-brand-wheat-200 mx-1"></div>
                <IconButton onClick={() => flip('x')} label="Flip Horizontal"><FlipHorizontalIcon /></IconButton>
                <IconButton onClick={() => flip('y')} label="Flip Vertical"><FlipVerticalIcon /></IconButton>
                <div className="w-px h-6 bg-brand-wheat-200 mx-1"></div>
                <IconButton onClick={reset} label="Reset"><ResetIcon /></IconButton>
             </div>
             <div className="flex items-center gap-2">
                 <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-brand-wheat-800 bg-brand-wheat-100 hover:bg-brand-wheat-200 rounded-md">Cancel</button>
                 <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-brand-teal-500 hover:bg-brand-teal-600 rounded-md">Apply & Save</button>
             </div>
        </div>
      </div>
    </div>
  );
}
