import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";

const ResumePreviewModal = ({ isOpen, setIsOpen, editableData, onSave }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
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
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-[#201d33] p-6 text-left align-middle shadow-xl transition-all text-white">
                <DialogTitle
                  as="h3"
                  className="text-lg font-semibold text-purple-300 mb-4"
                >
                  Preview Resume Data
                </DialogTitle>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                  {Object.entries(editableData).map(([key, value]) => (
                    <div key={key}>
                      <p className="font-semibold capitalize text-purple-500">
                        {key}
                      </p>
                      <p className="text-sm text-white whitespace-pre-wrap">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex justify-end gap-3">
                  <button
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-purple-900 hover:bg-purple-800 text-white px-4 py-2 rounded"
                    onClick={async () => {
                      const saved = await onSave();
                      if (saved) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    Save Resume & Next
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

export default ResumePreviewModal;
