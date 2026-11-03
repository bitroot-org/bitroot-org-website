import PersonaHub, { personaMetadata } from "@/components/catalog/PersonaHub";

export const metadata = personaMetadata("creators");

export default function Page() {
  return <PersonaHub persona="creators" />;
}
