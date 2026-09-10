import type { Category } from "../../types/category";

interface CategoryTableProps {
  categories: Category[];
  onView?: (category: Category) => void;
  onEdit?: (category: Category) => void;
  onToggleStatus?: (category: Category) => void;
  onDelete?: (categoryId: string) => void;
}

const CategoryTable = ({
  categories,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: CategoryTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl bg-white border border-gray-100 shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200/70">
          <tr>
            <th className="px-5 py-3.5">ID</th>
            <th className="px-5 py-3.5">Category Name</th>
            <th className="px-5 py-3.5">Description</th>
            <th className="px-5 py-3.5">Status</th>
            {(onView || onEdit || onToggleStatus || onDelete) && (
              <th className="px-5 py-3.5 text-right">Actions</th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-gray-700">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50/60 transition">
              <td className="px-5 py-3.5 font-semibold text-gray-500">
                {category.id}
              </td>
              <td className="px-5 py-3.5 font-medium text-gray-900">
                {category.name}
              </td>
              <td className="px-5 py-3.5 text-gray-600 max-w-sm truncate">
                {category.description}
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    category.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {category.status}
                </span>
              </td>
              {(onView || onEdit || onToggleStatus || onDelete) && (
                <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                  {onView && (
                    <button
                      type="button"
                      onClick={() => onView(category)}
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
                    >
                      View
                    </button>
                  )}
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      Edit
                    </button>
                  )}
                  {onToggleStatus && (
                    <button
                      type="button"
                      onClick={() => onToggleStatus(category)}
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      {category.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(category.id)}
                      className="rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;