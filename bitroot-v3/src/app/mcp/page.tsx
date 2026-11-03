import TypeIndex, { typeIndexMetadata } from "@/components/catalog/TypeIndex";

export const metadata = typeIndexMetadata("mcp");

export default function Page() {
  return <TypeIndex type="mcp" />;
}
