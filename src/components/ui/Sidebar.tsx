import { TwitterIcon } from "../../icons/TwitterIcon";
import { YouTubeIcon } from "../../icons/YouTubeIcon";

export interface SidebarProps {
    activeFilter: "all" | "twitter" | "youtube";
    onFilterChange: (filter: "all" | "twitter" | "youtube") => void;
    isOpen: boolean;
    onToggle: () => void;
}

export function Sidebar({
    activeFilter,
    onFilterChange,
    isOpen,
    onToggle,
}: SidebarProps) {
    const filters: {
        key: "all" | "twitter" | "youtube";
        label: string;
        icon?: React.ReactNode;
    }[] = [
        { key: "all", label: "All Content" },
        { key: "twitter", label: "Twitter", icon: <TwitterIcon size="md" /> },
        { key: "youtube", label: "YouTube", icon: <YouTubeIcon size="md" /> },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={onToggle}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
                aria-label="Toggle menu"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    {isOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    )}
                </svg>
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col z-40
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0
            `}
            >
                {/* Logo / Branding */}
                <div className="px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                🧠
                            </span>
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-800 text-lg">
                                Second Brain
                            </h1>
                            <p className="text-xs text-gray-500">
                                Save your ideas
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4">
                    <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Filter by Type
                    </p>
                    <ul className="space-y-1">
                        {filters.map((filter) => (
                            <li key={filter.key}>
                                <button
                                    onClick={() => {
                                        onFilterChange(filter.key);
                                        // Close sidebar on mobile after selection
                                        if (window.innerWidth < 1024) {
                                            onToggle();
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                                        activeFilter === filter.key
                                            ? "bg-purple-100 text-purple-700 font-medium"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    {filter.icon && (
                                        <span
                                            className={
                                                activeFilter === filter.key
                                                    ? "text-purple-600"
                                                    : "text-gray-400"
                                            }
                                        >
                                            {filter.icon}
                                        </span>
                                    )}
                                    {!filter.icon && (
                                        <span
                                            className={`w-4 h-4 rounded-full ${
                                                activeFilter === filter.key
                                                    ? "bg-purple-600"
                                                    : "bg-gray-300"
                                            }`}
                                        />
                                    )}
                                    {filter.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center">
                        © 2024 Second Brain
                    </p>
                </div>
            </aside>
        </>
    );
}
