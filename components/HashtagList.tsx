import React, { useState, useMemo } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { Loader } from './Loader';
import { CategorizedHashtags } from '../services/geminiService';

interface HashtagListProps {
  categorizedHashtags: CategorizedHashtags | null;
  isLoading: boolean;
  selectedCategories: Record<string, boolean>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const CategoryCheckbox: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center cursor-pointer select-none">
        <input 
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="w-5 h-5 text-purple-500 bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-600 rounded focus:ring-purple-500 dark:focus:ring-purple-600 focus:ring-2"
        />
        <span className="ml-3 text-lg font-medium text-gray-800 dark:text-gray-200 capitalize">{label}</span>
    </label>
);


const HashtagList: React.FC<HashtagListProps> = ({ categorizedHashtags, isLoading, selectedCategories, setSelectedCategories }) => {
    // Use a string key to track which button was just clicked ('all' or a category name)
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const selectedHashtags = useMemo(() => {
        if (!categorizedHashtags) return [];
        return Object.entries(categorizedHashtags)
            .filter(([category]) => selectedCategories[category])
            .flatMap(([, tags]) => tags);
    }, [categorizedHashtags, selectedCategories]);

    const handleCopy = (textToCopy: string, key: string) => {
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2000);
        });
    };

    const handleCopyAllSelected = () => {
        const text = selectedHashtags.map(h => `#${h}`).join(' ');
        handleCopy(text, 'all');
    };

    const handleCopyCategory = (category: string, tags: string[]) => {
        const text = tags.map(h => `#${h}`).join(' ');
        handleCopy(text, category);
    };

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };
    
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg">
                <Loader />
                <p className="mt-4 text-gray-600 dark:text-gray-400">Generating awesome hashtags...</p>
            </div>
        );
    }
    
    if (!categorizedHashtags) {
        return null;
    }

    const sortedCategories = Object.entries(categorizedHashtags)
        .sort(([categoryA], [categoryB]) => categoryA.localeCompare(categoryB));

    const isAllCopied = copiedKey === 'all';

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg animate-fade-in space-y-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Your Hashtags</h2>
                <button 
                    onClick={handleCopyAllSelected}
                    disabled={selectedHashtags.length === 0}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 dark:text-purple-200 dark:bg-purple-600/50 dark:hover:bg-purple-600/70 transition-colors rounded-lg disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    {isAllCopied ? <CheckIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
                    {isAllCopied ? 'Copied!' : `Copy All Selected (${selectedHashtags.length})`}
                </button>
            </div>

            <div className="space-y-5">
                {sortedCategories.map(([category, tags]) => {
                    const isChecked = !!selectedCategories[category];
                    const isCategoryCopied = copiedKey === category;
                    return (
                        tags.length > 0 && (
                            <div key={category} className="border-t border-gray-200 dark:border-gray-700/50 pt-4 first:pt-0 first:border-t-0">
                                <div className="flex justify-between items-center">
                                    <CategoryCheckbox
                                        label={category}
                                        checked={isChecked}
                                        onChange={() => toggleCategory(category)}
                                    />
                                    <button
                                        onClick={() => handleCopyCategory(category, tags)}
                                        className="flex items-center justify-center gap-1.5 px-3 py-1 text-xs font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700/80 dark:hover:bg-gray-700 transition-colors rounded-md"
                                        aria-label={`Copy ${category} hashtags`}
                                    >
                                        {isCategoryCopied ? <CheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
                                        <span>{isCategoryCopied ? 'Copied' : 'Copy'}</span>
                                    </button>
                                </div>
                                <div className={`
                                    flex flex-wrap gap-2 mt-3 pl-8
                                    transition-all duration-300 ease-in-out
                                    ${isChecked ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
                                `}>
                                    {tags.map((tag, index) => (
                                        <span key={index} className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-full cursor-default transition-colors">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )
                    )
                })}
            </div>
        </div>
    );
};

const fadeInAnimation = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
`;

// Inject styles into the head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = fadeInAnimation;
document.head.appendChild(styleSheet);


export default HashtagList;