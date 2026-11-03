import TypeIndex, { typeIndexMetadata } from "@/components/catalog/TypeIndex";

export const metadata = typeIndexMetadata("skill");

export default function Page() {
  return <TypeIndex type="skill" />;
}
