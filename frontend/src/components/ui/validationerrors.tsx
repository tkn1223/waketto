interface ValidationErrorsProps {
  errors: string[];
  className?: string;
}

export function ValidationErrors({ errors, className }: ValidationErrorsProps) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {errors.map((error, index) => (
        <p key={index} className="text-red-600 text-sm">
          {error}
        </p>
      ))}
    </div>
  );
}
