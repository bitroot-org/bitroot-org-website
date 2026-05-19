import ProductsClient from "./ProductsClient";

export const metadata = {
  title: "Products — bitroot.org",
  description:
    "Apps from the Bitroot team. BitStudio is in early access; the rest are coming soon. Every product ships with a free plan and a community program.",
};

export default function ProductsPage() {
  return <ProductsClient />;
}
