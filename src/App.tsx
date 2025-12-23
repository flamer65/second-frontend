import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { AddContentModal } from "./components/ui/AddContentModal";
import { Sidebar } from "./components/ui/Sidebar";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { PlusIcon } from "./icons/PlusIcon";
import { ShareIcon } from "./icons/ShareIcon";
import {
    isAuthenticated,
    signOut,
    getContent,
    createContent,
    deleteContent as deleteContentApi,
    getTags,
    enableSharing,
    ContentItem as ApiContentItem,
    Tag,
} from "./api";

interface ContentItem {
    id: string;
    title: string;
    type: "twitter" | "youtube";
    url: string;
    tags: string[];
}

function Dashboard() {
    const navigate = useNavigate();
    const [content, setContent] = useState<ContentItem[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<
        "all" | "twitter" | "youtube"
    >("all");

    // Fetch content and tags on mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [contentData, tagsData] = await Promise.all([
                    getContent(),
                    getTags(),
                ]);

                // Transform API content to local format
                const transformedContent: ContentItem[] = contentData.map(
                    (item: ApiContentItem) => ({
                        id: item._id,
                        title: item.title,
                        type: item.type,
                        url: item.link,
                        tags: Array.isArray(item.tags)
                            ? item.tags.map(
                                  (t: { _id: string; name: string } | string) =>
                                      typeof t === "string" ? t : t.name
                              )
                            : [],
                    })
                );

                setContent(transformedContent);
                setAvailableTags(tagsData.map((tag: Tag) => tag.name));
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const handleAddContent = async (data: {
        title: string;
        url: string;
        type: "twitter" | "youtube";
        tags: string[];
    }) => {
        // Create content on backend
        const result = await createContent({
            title: data.title,
            link: data.url,
            type: data.type,
            tags: data.tags.join(","), // Backend expects comma-separated string
        });

        if (result.success) {
            // Refresh content from backend
            const contentData = await getContent();
            const transformedContent: ContentItem[] = contentData.map(
                (item: ApiContentItem) => ({
                    id: item._id,
                    title: item.title,
                    type: item.type,
                    url: item.link,
                    tags: Array.isArray(item.tags)
                        ? item.tags.map(
                              (t: { _id: string; name: string } | string) =>
                                  typeof t === "string" ? t : t.name
                          )
                        : [],
                })
            );
            setContent(transformedContent);

            // Add any new tags to availableTags
            const newTags = data.tags.filter(
                (tag) => !availableTags.includes(tag)
            );
            if (newTags.length > 0) {
                setAvailableTags([...availableTags, ...newTags]);
            }
        }
    };

    const handleDeleteContent = async (id: string) => {
        const result = await deleteContentApi(id);
        if (result.success) {
            setContent(content.filter((item) => item.id !== id));
        } else {
            // Fallback: remove from local state anyway
            setContent(content.filter((item) => item.id !== id));
        }
    };

    const handleShareContent = (url: string) => {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
    };

    const handleShareBrain = async () => {
        const result = await enableSharing();
        if (result.success && result.hash) {
            const shareableUrl = `${window.location.origin}/shared/${result.hash}`;
            navigator.clipboard.writeText(shareableUrl);
            alert(`Shareable link copied!\n${shareableUrl}`);
        } else {
            alert("Failed to generate share link");
        }
    };

    const handleSignOut = () => {
        signOut();
        navigate("/signin");
    };

    const filteredContent =
        activeFilter === "all"
            ? content
            : content.filter((item) => item.type === activeFilter);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your brain...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 py-4">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="ml-12 lg:ml-0">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {activeFilter === "all"
                                    ? "All Content"
                                    : activeFilter === "twitter"
                                    ? "Twitter Posts"
                                    : "YouTube Videos"}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {filteredContent.length}{" "}
                                {filteredContent.length === 1
                                    ? "item"
                                    : "items"}{" "}
                                saved
                            </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button
                                variant="secondary"
                                size="md"
                                title="Share Brain"
                                startIcon={<ShareIcon size="md" />}
                                onClick={handleShareBrain}
                            />
                            <Button
                                variant="primary"
                                size="md"
                                title="Add Content"
                                startIcon={<PlusIcon size="md" />}
                                onClick={() => setIsModalOpen(true)}
                            />
                            <button
                                onClick={handleSignOut}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Sign Out"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Grid */}
                <div className="p-4 sm:p-8 max-w-7xl mx-auto">
                    {filteredContent.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <span className="text-4xl">📭</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No content yet
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Start building your second brain by adding some
                                content!
                            </p>
                            <Button
                                variant="primary"
                                size="md"
                                title="Add Your First Content"
                                startIcon={<PlusIcon size="md" />}
                                onClick={() => setIsModalOpen(true)}
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredContent.map((item) => (
                                <Card
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    type={item.type}
                                    url={item.url}
                                    tags={item.tags}
                                    onDelete={handleDeleteContent}
                                    onShare={handleShareContent}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Add Content Modal */}
            <AddContentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddContent}
                availableTags={availableTags}
            />
        </div>
    );
}

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    if (!isAuthenticated()) {
        return <Navigate to="/signin" replace />;
    }
    return <>{children}</>;
}

function App() {
    const [authView, setAuthView] = useState<"signin" | "signup">("signin");

    return (
        <Routes>
            <Route
                path="/signin"
                element={
                    isAuthenticated() ? (
                        <Navigate to="/" replace />
                    ) : authView === "signin" ? (
                        <SignIn
                            onSuccess={() => (window.location.href = "/")}
                            onSwitchToSignUp={() => setAuthView("signup")}
                        />
                    ) : (
                        <SignUp
                            onSuccess={() => setAuthView("signin")}
                            onSwitchToSignIn={() => setAuthView("signin")}
                        />
                    )
                }
            />
            <Route
                path="/signup"
                element={
                    isAuthenticated() ? (
                        <Navigate to="/" replace />
                    ) : (
                        <SignUp
                            onSuccess={() => (window.location.href = "/signin")}
                            onSwitchToSignIn={() =>
                                (window.location.href = "/signin")
                            }
                        />
                    )
                }
            />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
