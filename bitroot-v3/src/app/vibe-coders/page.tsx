import PersonaHub, { personaMetadata } from "@/components/catalog/PersonaHub";

export const metadata = personaMetadata("vibe-coders");

export default function Page() {
  return <PersonaHub persona="vibe-coders" />;
}
