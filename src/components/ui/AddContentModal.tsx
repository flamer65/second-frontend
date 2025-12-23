import { useState } from "react";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YouTubeIcon } from "../../icons/YouTubeIcon";

export interface AddContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        url: string;
        type: "twitter" | "youtube";
        tags: string[];
    }) => void;
    availableTags: string[];
}

export function AddContentModal({
    isOpen,
    onClose,
    onSubmit,
    availableTags,
}: AddContentModalProps) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [type, setType] = useState<"twitter" | "youtube">("youtube");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && url.trim()) {
            onSubmit({
                title: title.trim(),
                url: url.trim(),
                type,
                tags: selectedTags,
            });
            setTitle("");
            setUrl("");
            setType("youtube");
            setSelectedTags([]);
            setNewTag("");
            onClose();
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const addNewTag = () => {
        const tag = newTag
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");
        if (tag && !selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
            setNewTag("");
        }
    };

    const handleNewTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addNewTag();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideUp">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-800">
                        Add New Content
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Save a Twitter post or YouTube video
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title Input */}
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a title for this content"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* URL Input */}
                    <div>
                        <label
                            htmlFor="url"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            URL
                        </label>
                        <input
                            id="url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste Twitter or YouTube link"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Type Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Content Type
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setType("youtube")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
                                    type === "youtube"
                                        ? "border-red-500 bg-red-50 text-red-600"
                                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                                }`}
                            >
                                <YouTubeIcon size="md" />
                                <span className="font-medium">YouTube</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setType("twitter")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
                                    type === "twitter"
                                        ? "border-gray-800 bg-gray-100 text-gray-800"
                                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                                }`}
                            >
                                <TwitterIcon size="md" />
                                <span className="font-medium">Twitter/X</span>
                            </button>
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags
                        </label>

                        {/* Selected Tags */}
                        {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {selectedTags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-600 text-white"
                                    >
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => toggleTag(tag)}
                                            className="ml-1 hover:bg-purple-700 rounded-full p-0.5"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="w-3 h-3"
                                            >
                                                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Add New Tag Input */}
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={handleNewTagKeyDown}
                                placeholder="Type a new tag..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm"
                            />
                            <button
                                type="button"
                                onClick={addNewTag}
                                disabled={!newTag.trim()}
                                className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg font-medium hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                Add
                            </button>
                        </div>

                        {/* Available Tags */}
                        <div className="flex flex-wrap gap-2">
                            {availableTags
                                .filter((tag) => !selectedTags.includes(tag))
                                .map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                        >
                            Add Content
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
