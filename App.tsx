import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import HashtagList from './components/HashtagList';
import { generateHashtags, CategorizedHashtags } from './services/geminiService';
import { SocialIcon } from './components/icons/SocialIcon';

type Theme = 'dark' | 'light';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [hashtags, setHashtags] = useState<CategorizedHashtags | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Default to dark theme
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setHashtags(null);

    try {
      const generated = await generateHashtags(topic);
      setHashtags(generated);
      // By default, select all newly generated categories
      const initialSelections = Object.keys(generated).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setSelectedCategories(initialSelections);
    } catch (err) {
      setError(err instanceof Error ? `Failed to generate hashtags: ${err.message}` : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [topic, isLoading]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="w-full max-w-2xl mx-auto">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main className="mt-8">
          <InputForm
            topic={topic}
            setTopic={setTopic}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-6 text-center text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          <div className="mt-8">
            {!hashtags && !isLoading && !error && (
                <div className="text-center text-gray-500 py-16 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                    <div className="inline-block p-4 bg-gray-200 dark:bg-gray-800 rounded-full mb-4">
                        <SocialIcon className="w-10 h-10 text-purple-500 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Ready to trend?</h3>
                    <p>Enter a topic above to generate your hashtags.</p>
                </div>
            )}
            <HashtagList 
              categorizedHashtags={hashtags} 
              isLoading={isLoading}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;