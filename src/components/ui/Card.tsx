import { useEffect, useRef } from "react";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YouTubeIcon } from "../../icons/YouTubeIcon";
import { DeleteIcon } from "../../icons/DeleteIcon";
import { LinkIcon } from "../../icons/LinkIcon";

export interface CardProps {
    id: string;
    title: string;
    type: "twitter" | "youtube";
    url: string;
    tags: string[];
    onDelete: (id: string) => void;
    onShare: (url: string) => void;
}

function extractYouTubeId(url: string): string | null {
    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
}

function extractTweetId(url: string): string | null {
    const regExp = /(?:twitter|x)\.com\/\w+\/status\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

// Declare the global twttr object for TypeScript
declare global {
    interface Window {
        twttr: {
            widgets: {
                load: (element?: HTMLElement) => void;
                createTweet: (
                    tweetId: string,
                    container: HTMLElement,
                    options?: object
                ) => Promise<HTMLElement>;
            };
        };
    }
}

// Load Twitter widget script once
let twitterScriptLoaded = false;
function loadTwitterScript(): Promise<void> {
    return new Promise((resolve) => {
        if (twitterScriptLoaded && window.twttr) {
            resolve();
            return;
        }

        if (document.getElementById("twitter-wjs")) {
            // Script tag exists, wait for it to load
            const checkTwitter = setInterval(() => {
                if (window.twttr && window.twttr.widgets) {
                    clearInterval(checkTwitter);
                    twitterScriptLoaded = true;
                    resolve();
                }
            }, 100);
            return;
        }

        const script = document.createElement("script");
        script.id = "twitter-wjs";
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        script.onload = () => {
            const checkTwitter = setInterval(() => {
                if (window.twttr && window.twttr.widgets) {
                    clearInterval(checkTwitter);
                    twitterScriptLoaded = true;
                    resolve();
                }
            }, 100);
        };
        document.head.appendChild(script);
    });
}

export function Card({
    id,
    title,
    type,
    url,
    tags,
    onDelete,
    onShare,
}: CardProps) {
    const youtubeId = type === "youtube" ? extractYouTubeId(url) : null;
    const tweetId = type === "twitter" ? extractTweetId(url) : null;
    const tweetContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;

        if (type === "twitter" && tweetId && tweetContainerRef.current) {
            // Clear any previous content
            tweetContainerRef.current.innerHTML = "";

            loadTwitterScript().then(() => {
                // Only create tweet if component is still mounted
                if (isMounted && tweetContainerRef.current && window.twttr) {
                    window.twttr.widgets.createTweet(
                        tweetId,
                        tweetContainerRef.current,
                        {
                            theme: "light",
                            conversation: "none",
                            dnt: true,
                        }
                    );
                }
            });
        }

        // Cleanup function to prevent duplicate tweets
        return () => {
            isMounted = false;
            if (tweetContainerRef.current) {
                tweetContainerRef.current.innerHTML = "";
            }
        };
    }, [type, tweetId]);

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                    {type === "twitter" ? (
                        <div className="text-gray-700">
                            <TwitterIcon size="md" />
                        </div>
                    ) : (
                        <div className="text-red-600">
                            <YouTubeIcon size="md" />
                        </div>
                    )}
                    <span className="text-sm font-medium text-gray-600 capitalize">
                        {type}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onShare(url)}
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Copy link"
                    >
                        <LinkIcon size="md" />
                    </button>
                    <button
                        onClick={() => onDelete(id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <DeleteIcon size="md" />
                    </button>
                </div>
            </div>

            {/* Title */}
            <div className="px-4 py-3">
                <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">
                    {title}
                </h3>
            </div>

            {/* Embedded Content */}
            <div className="px-4 pb-4">
                {type === "youtube" && youtubeId ? (
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ) : type === "twitter" && tweetId ? (
                    <div
                        ref={tweetContainerRef}
                        className="min-h-[200px] w-full [&>div]:!m-0 [&_.twitter-tweet]:!w-full [&_twitter-widget]:!w-full [&_twitter-widget]:!max-w-full"
                    >
                        <div className="text-gray-400 text-sm flex items-center justify-center h-[200px]">
                            Loading tweet...
                        </div>
                    </div>
                ) : (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 underline break-all"
                    >
                        {url}
                    </a>
                )}
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
                <div className="px-4 pb-4">
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
