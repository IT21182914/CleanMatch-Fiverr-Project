import { DocumentIcon } from "@heroicons/react/24/outline";

const DocumentUploadSection = ({ errors, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        ID & SSN Upload (Optional - for verified freelancer status)
      </label>
      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Optional:</span> Upload documents to
          become a verified freelancer. You can register as a cleaner without
          documents and upload them later.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            ID Front
          </label>
          <div className="relative">
            <input
              type="file"
              name="idFront"
              accept="image/*"
              onChange={onChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
            <DocumentIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
          </div>
          {errors.idFront && (
            <p className="mt-1 text-sm text-red-600">{errors.idFront}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            ID Back
          </label>
          <div className="relative">
            <input
              type="file"
              name="idBack"
              accept="image/*"
              onChange={onChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
            <DocumentIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
          </div>
          {errors.idBack && (
            <p className="mt-1 text-sm text-red-600">{errors.idBack}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            SSN Front
          </label>
          <div className="relative">
            <input
              type="file"
              name="ssnFront"
              accept="image/*"
              onChange={onChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
            <DocumentIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
          </div>
          {errors.ssnFront && (
            <p className="mt-1 text-sm text-red-600">{errors.ssnFront}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            SSN Back
          </label>
          <div className="relative">
            <input
              type="file"
              name="ssnBack"
              accept="image/*"
              onChange={onChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
            <DocumentIcon className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
          </div>
          {errors.ssnBack && (
            <p className="mt-1 text-sm text-red-600">{errors.ssnBack}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadSection;
