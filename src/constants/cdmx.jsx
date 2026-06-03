// Constantes de dirección para Ciudad de México
// Importar en RegisterForm, ShoppingForm y Solicitudes

export const ESTADO_CDMX = 'Ciudad de México'

export const ALCALDIAS_CDMX = [
  'Álvaro Obregón',
  'Azcapotzalco',
  'Benito Juárez',
  'Coyoacán',
  'Cuajimalpa de Morelos',
  'Cuauhtémoc',
  'Gustavo A. Madero',
  'Iztacalco',
  'Iztapalapa',
  'La Magdalena Contreras',
  'Miguel Hidalgo',
  'Milpa Alta',
  'Tláhuac',
  'Tlalpan',
  'Venustiano Carranza',
  'Xochimilco',
]

// Componente reutilizable para el select de alcaldías
export function SelectAlcaldia({ value, onChange, name = 'delegacion', required = true, className = '' }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={className}
    >
      <option value="">Selecciona una alcaldía…</option>
      {ALCALDIAS_CDMX.map(a => (
        <option key={a} value={a}>{a}</option>
      ))}
    </select>
  )
}