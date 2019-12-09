export interface HomieProperties {
  $name: string;
  $datatype: "integer" | "float" | "boolean" | "string" | "enum" | "color";
  $format?: string;
  $settable?: boolean;
  $retained?: boolean;
  $unit?: string;
}
