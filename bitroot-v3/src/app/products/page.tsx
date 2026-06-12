import ProductsClient from "./ProductsClient";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Products — apps from the Bitroot team",
  description:
    "Apps from the Bitroot team. BitStudio is in early access; the rest are coming soon. Every product ships with a free plan and a community program.",
  path: "/products/",
});

export default function ProductsPage() {
  return <ProductsClient />;
}
