import { Dialog, Transition, DialogPanel, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import ResumeReview from './ResumeReview';

const ResumeReviewModal = ({ isOpen, setIsOpen, parsedData, pdfUrl, resumeText }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-purple-500/20 p-4 md:p-6 text-left align-middle shadow-xl transition-all text-white max-h-[90vh]">
                <div className="h-full w-full flex flex-col md:flex-row">
                  {parsedData && pdfUrl && resumeText ? (
                    <div className="h-full w-full overflow-auto">
                      <ResumeReview parsedData={parsedData} pdfUrl={pdfUrl} resumeText={resumeText} />
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-300">No resume data to preview</div>
                  )}
                </div>

                <div className="mt-4 text-right">
                  <button className="mt-2 px-4 py-2 bg-white/5 rounded-md text-white hover:bg-white/10" onClick={() => setIsOpen(false)}>
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ResumeReviewModal;