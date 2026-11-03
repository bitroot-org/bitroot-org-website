import {
  ItemDetailPage,
  itemMetadata,
  itemStaticParams,
} from "@/components/catalog/ItemDetail";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return itemStaticParams("pack");
}

export function generateMetadata(props: Props) {
  return itemMetadata("pack", props);
}

export default function Page(props: Props) {
  return <ItemDetailPage type="pack" {...props} />;
}
