import TypeIndex, { typeIndexMetadata } from "@/components/catalog/TypeIndex";

export const metadata = typeIndexMetadata("plugin");

export default function Page() {
  return <TypeIndex type="plugin" />;
}
