import CategoryManager from "@/components/CategoryManager";

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Category Manager</h1>
      <CategoryManager />
    </div>
  );
}