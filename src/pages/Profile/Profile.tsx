import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500">No profile details available. Please log in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
        <p className="text-sm text-gray-500">
          View your account information and permissions
        </p>
      </div>

      <div className="max-w-3xl rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-3xl font-bold text-white shadow-lg shadow-blue-500/20">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
            <p className="text-sm text-gray-500">{currentUser.email}</p>
            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 capitalize">
                Role: {currentUser.role?.replace("_", " ")}
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 capitalize">
                Status: {currentUser.status}
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                Dept: {currentUser.department}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              User ID
            </span>
            <p className="mt-1 font-semibold text-gray-800">{currentUser.id}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Contact Phone
            </span>
            <p className="mt-1 font-semibold text-gray-800">{currentUser.phone || "Not specified"}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Department
            </span>
            <p className="mt-1 font-semibold text-gray-800">{currentUser.department}</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Member Since
            </span>
            <p className="mt-1 font-semibold text-gray-800">{currentUser.createdDate || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
