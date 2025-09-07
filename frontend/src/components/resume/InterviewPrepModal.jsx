import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { ClockIcon, UserIcon, ShieldCheckIcon } from "lucide-react";

const InterviewPrepModal = ({ isOpen, setIsOpen, onStart }) => {
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
              <DialogPanel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-[#201d33] px-6 py-8 text-left align-middle shadow-2xl transition-all text-white">
                <DialogTitle as="h3" className="text-2xl font-semibold text-purple-300 text-center mb-6">
                  🎯 Interview Prep Guide
                </DialogTitle>

                <div className="space-y-4 text-sm text-purple-100">
                  <div className="flex items-start gap-3">
                    <UserIcon className="w-4 h-4 mt-1 text-purple-400" />
                    <p>Simulated AI interviewer will ask job-role-based questions.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-4 h-4 mt-1 text-purple-400" />
                    <p>Each question has a timer — stay focused and think fast.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheckIcon className="w-4 h-4 mt-1 text-purple-400" />
                    <p>Do not refresh or close tab during the interview session.</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col space-y-3">
                  <button
                    className="bg-gray-500 hover:bg-gray-600 text-white text-sm py-2 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-purple-900 hover:bg-purple-800 text-white text-sm py-2 rounded-md"
                    onClick={() => {
                      setIsOpen(false);
                      onStart();
                    }}
                  >
                    Start Interview 🚀
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

export default InterviewPrepModal;
