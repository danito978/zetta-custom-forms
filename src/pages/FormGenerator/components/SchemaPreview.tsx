import React from 'react';

interface SchemaPreviewProps {
  schema: any;
}

const SchemaPreview = ({ schema }: SchemaPreviewProps) => {
  if (!schema) return null;

  const fieldCount = schema.fields ? Object.keys(schema.fields).length : 0;

  return (
    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-3">Schema Summary</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium text-neutral-700">Title:</span>
          <span className="ml-2 text-neutral-900">{schema.title || 'Untitled Form'}</span>
        </div>
        <div>
          <span className="font-medium text-neutral-700">Fields:</span>
          <span className="ml-2 text-neutral-900">{fieldCount}</span>
        </div>
        <div>
          <span className="font-medium text-neutral-700">Type:</span>
          <span className="ml-2 text-neutral-900">{schema.type || 'object'}</span>
        </div>
        {schema.description && (
          <div className="md:col-span-3">
            <span className="font-medium text-neutral-700">Description:</span>
            <span className="ml-2 text-neutral-900">{schema.description}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaPreview;
