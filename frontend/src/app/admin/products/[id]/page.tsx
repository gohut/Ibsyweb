import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/mock-data";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductForm title={`Edit ${product.name}`} product={product} />;
}
