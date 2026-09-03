const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitizeText(value, maxLength) {
  return String(value ?? '')
    .replace(CONTROL_CHARACTERS, '')
    .slice(0, maxLength)
}

export function sanitizeEmail(value) {
  return sanitizeText(value, 254).toLowerCase();
}

export function sanitizePhone(value) {
  return sanitizeText(value, 15).replace(/[^0-9+().\s-]/g, '');
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPhone(value) {
  return /^[0-9+().\s-]{7,15}$/.test(value);
}

export function sanitizeCourseForm(form) {
  form = form || {};
  return {
    name: sanitizeText(form.name, 50),
    age: sanitizeText(form.age, 2),
    email: sanitizeEmail(form.email),
    phone: sanitizePhone(form.phone),
    option: sanitizeText(form.option, 20),
    note: sanitizeText(form.note, 1000),
  };
}

export function sanitizeKontaktForm(form) {
  form = form || {};
  return {
    name: sanitizeText(form.name, 50),
    email: sanitizeEmail(form.email),
    phone: sanitizePhone(form.phone),
    note: sanitizeText(form.note, 1000),
  };
}

export function validateContactFields(form) {
  return Boolean(
    form.name &&
    isValidEmail(form.email) &&
    isValidPhone(form.phone) &&
    form.note
  );
}

export function validateCourseFields(form) {
  return Boolean(
    form.name &&
    /^(?:[1-9]|[1-9]\d|1[01]\d|120)$/.test(form.age) &&
    isValidEmail(form.email) &&
    isValidPhone(form.phone) &&
    ['Yekem', 'Duyem', 'Sêyem'].includes(form.option)
  );
}
