import { useState, useMemo } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useToast } from "../../context/ToastContext";
import CategoryTable from "../../components/Categories/CategoryTable";
import CategoryFormModal from "../../components/Categories/CategoryFormModal";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import { createCategory, updateCategory, deleteCategory } from "../../services/categoryService";
import type { Category, CategoryStatus } from "../../types/category";

const Categories = () => {
  const { categories, loading, error, refetch } = useCategories();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (categoryData: {
    name: string;
    description: string;
    status: CategoryStatus;
  }) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
        showToast(`Category ${categoryData.name} updated`, "success");
      } else {
        const newId = `CAT${String(categories.length + 1).padStart(2, "0")}`;
        await createCategory({
          id: newId,
          ...categoryData,
        });
        showToast(`Category ${categoryData.name} added`, "success");
      }
      refetch();
    } catch {
      showToast("Operation failed", "error");
    }
  };

  const handleToggleStatus = async (cat: Category) => {
    const nextStatus: CategoryStatus = cat.status === "active" ? "inactive" : "active";
    try {
      await updateCategory(cat.id, { status: nextStatus });
      showToast(`Category status set to ${nextStatus}`, "success");
      refetch();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (window.confirm(`Are you sure you want to permanently delete category ${catId}?`)) {
      try {
        await deleteCategory(catId);
        showToast("Category deleted successfully", "success");
        refetch();
      } catch {
        showToast("Failed to delete category", "error");
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Category Management (Admin Only)
          </h1>
          <p className="text-sm text-gray-500">
            Configure support categories for ticket classification and routing
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Category
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search categories by name, description, ID..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="w-full sm:w-48 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-blue-600"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        {filteredCategories.length === 0 ? (
          <EmptyState message="No categories match your search." />
        ) : (
          <>
            <CategoryTable
              categories={paginatedCategories}
              onView={(cat) => setViewingCategory(cat)}
              onEdit={handleOpenEdit}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteCategory}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredCategories.length}
              pageSize={pageSize}
            />
          </>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialCategory={editingCategory}
        isEdit={Boolean(editingCategory)}
        onSubmit={handleFormSubmit}
      />

      {/* View Category Modal */}
      {viewingCategory && (
        <Modal
          isOpen={Boolean(viewingCategory)}
          onClose={() => setViewingCategory(null)}
          title={`Category Details: ${viewingCategory.name}`}
        >
          <div className="space-y-4 mt-2">
            <div className="rounded-xl bg-blue-50/60 p-4 border border-blue-100">
              <span className="text-xs font-bold uppercase text-blue-800">
                {viewingCategory.id}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">
                {viewingCategory.name}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {viewingCategory.description}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 pt-2">
              <span>Status:</span>
              <span className={`rounded-full px-3 py-0.5 font-semibold capitalize ${
                viewingCategory.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {viewingCategory.status}
              </span>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setViewingCategory(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Categories;