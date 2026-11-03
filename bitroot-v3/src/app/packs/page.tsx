import TypeIndex, { typeIndexMetadata } from "@/components/catalog/TypeIndex";

export const metadata = typeIndexMetadata("pack");

export default function Page() {
  return <TypeIndex type="pack" />;
}
