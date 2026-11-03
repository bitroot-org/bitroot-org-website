import TypeIndex, { typeIndexMetadata } from "@/components/catalog/TypeIndex";

export const metadata = typeIndexMetadata("cli");

export default function Page() {
  return <TypeIndex type="cli" />;
}
