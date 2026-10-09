type V = (value: string) => string | null;

export function chain(...fns: V[]): V {
  return (value) => {
    for (const fn of fns) {
      const err = fn(value);
      if (err) return err;
    }
    return null;
  };
}

export const requerido =
  (label: string): V =>
  (v) =>
    v.trim() ? null : `${label} es requerido`;

export const minLength =
  (label: string, min: number): V =>
  (v) =>
    v.trim().length >= min
      ? null
      : `${label} debe tener al menos ${min} caracteres`;

export const maxLength =
  (label: string, max: number): V =>
  (v) =>
    v.trim().length <= max
      ? null
      : `${label} no puede exceder ${max} caracteres`;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const patron =
  (_label: string, regex: RegExp, mensaje: string): V =>
  (v) =>
    regex.test(v.trim()) ? null : mensaje;

export const correo = chain(
  requerido("El correo"),
  patron("El correo", EMAIL_REGEX, "Ingrese un correo válido"),
);

const PHONE_REGEX = /^[+]?[\d\s()-]{7,20}$/;

export const telefono = chain(
  requerido("El teléfono"),
  patron("El teléfono", PHONE_REGEX, "Ingrese un número de teléfono válido"),
);

export function soloDigitos(value: string): string {
  return value.replace(/\D/g, "");
}

export function filtrarDigitos(inputProps: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
    inputProps.onChange(e);
  };
}

const TIME_REGEX = /^\d{2}:\d{2}$/;

export const horaHHmm = patron(
  "Hora",
  TIME_REGEX,
  "Use formato HH:mm (ej. 09:00)",
);

export function correoOpcional(value: string): string | null {
  if (!value.trim()) return null;
  return patron("Correo", EMAIL_REGEX, "Ingrese un correo válido")(value);
}

export function telefonoOpcional(value: string): string | null {
  if (!value.trim()) return null;
  return patron(
    "Teléfono",
    PHONE_REGEX,
    "Ingrese un número de teléfono válido",
  )(value);
}

export function requeridoSi(
  label: string,
  condition: boolean,
): (value: string) => string | null {
  return (value) => (condition ? requerido(label)(value) : null);
}

export function passwordUsuario(opcional: boolean): V {
  return (value) => {
    if (opcional && !value.trim()) return null;
    return chain(requerido("Contraseña"), minLength("Contraseña", 6))(value);
  };
}
