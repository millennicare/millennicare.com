import { ChangeEvent, useEffect, useState } from "react";

export const useFileUpload = (
  initialValue: File | null,
): [File | null, boolean, (event: ChangeEvent<HTMLInputElement>) => void] => {
  const [file, setFile] = useState<File | null>(initialValue);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!file) {
      setError(true);
    }
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setFile(event.target.files[0]);
    }
  };

  return [file, error, handleFileChange];
};
