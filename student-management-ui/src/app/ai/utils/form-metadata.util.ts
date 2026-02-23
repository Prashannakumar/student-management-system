export interface FormFieldMetadata {
  id: string;
  label: string;
  type: string;
}

export function extractFormMetadata(form: any): FormFieldMetadata[] {

  const result: FormFieldMetadata[] = [];

  Object.keys(form.controls).forEach(key => {

    const control = form.controls[key];

    result.push({
      id: key,
      label: formatLabel(key),
      type: detectType(control.value)
    });

  });

  return result;
}

function detectType(value: any): string {
  if (typeof value === 'number') return 'number';
  if (value instanceof Date) return 'date';
  return 'text';
}

function formatLabel(key: string): string {
  return key.replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
}