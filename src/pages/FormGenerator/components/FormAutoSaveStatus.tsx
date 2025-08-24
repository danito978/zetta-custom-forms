import React from 'react';
import { useFormContext } from '../context/FormContext';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Save, Trash2, Clock } from 'lucide-react';

interface FormAutoSaveStatusProps {
  className?: string;
}

const FormAutoSaveStatus: React.FC<FormAutoSaveStatusProps> = ({ className = '' }) => {
  const { hasSavedValues, savedValuesInfo, clearSavedValues } = useFormContext();

  const handleClearSavedData = () => {
    const success = clearSavedValues();
    if (success) {
      // Optionally reload the page to reset form values
      window.location.reload();
    }
  };

  const formatSavedTime = (savedAt: string): string => {
    try {
      const date = new Date(savedAt);
      return date.toLocaleString();
    } catch {
      return 'Unknown time';
    }
  };

  if (!hasSavedValues) {
    return (
      <Card className={`border-green-200 bg-green-50 ${className}`}>
        <CardContent className="flex items-center gap-2 p-3">
          <Save className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700">
            Form auto-save is active - your progress will be saved automatically
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-blue-200 bg-blue-50 ${className}`}>
      <CardContent className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <div className="text-sm text-blue-700">
            <div className="font-medium">Form data restored from auto-save</div>
            {savedValuesInfo && (
              <div className="text-xs text-blue-600">
                Last saved: {formatSavedTime(savedValuesInfo.savedAt)}
              </div>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearSavedData}
          className="text-blue-700 border-blue-300 hover:bg-blue-100"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear Saved Data
        </Button>
      </CardContent>
    </Card>
  );
};

export default FormAutoSaveStatus;
