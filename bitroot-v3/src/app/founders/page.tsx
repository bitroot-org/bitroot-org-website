import PersonaHub, { personaMetadata } from "@/components/catalog/PersonaHub";

export const metadata = personaMetadata("founders");

export default function Page() {
  return <PersonaHub persona="founders" />;
}
