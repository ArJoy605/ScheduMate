const ConfirmationModal = ({ header, content, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 rounded p-6 w-64">
        <div className="flex justify-center text-red-500 items-center text-lg font-bold mb-2">
          {header}
        </div>
        <div className="flex justify-center text-amber-400 items-center mb-7">
          {content}
        </div>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
