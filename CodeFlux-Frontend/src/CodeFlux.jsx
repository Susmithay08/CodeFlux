import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowRight, Code, Loader2 } from 'lucide-react';

const TRANSLATIONS = {
    "en-US": {
        "appTitle": "CodeFlux",
        "appSubtitle": "Programming Language Converter",
        "sourceLanguagePlaceholder": "Source Language",
        "targetLanguagePlaceholder": "Target Language",
        "convertButton": "Convert Code",
        "converting": "Converting...",
        "sourceCodeTitle": "Source Code",
        "convertedCodeTitle": "Converted Code",
        "sourceCodePlaceholder": "Enter your source code here...",
        "convertedCodePlaceholder": "Converted code will appear here...",
        "convertingPlaceholder": "Converting...",
        "footerText1": "CodeFlux uses Groq AI to convert code between programming languages.",
        "footerText2": "Results may require manual review and adjustment.",
        "searchLanguagesPlaceholder": "Search languages...",
        "noLanguagesFound": "No languages found",
        "errorEmptyCode": "Please enter some code to convert",
        "errorConversionFailed": "Failed to convert code. Please try again.",
        "exampleComment": "# Example Python code"
    },
    /* LOCALE_PLACEHOLDER_START */
    "es-ES": {
        "appTitle": "CodeFlux",
        "appSubtitle": "Convertidor de Lenguajes de Programación",
        "sourceLanguagePlaceholder": "Lenguaje de Origen",
        "targetLanguagePlaceholder": "Lenguaje de Destino",
        "convertButton": "Convertir Código",
        "converting": "Convirtiendo...",
        "sourceCodeTitle": "Código de Origen",
        "convertedCodeTitle": "Código Convertido",
        "sourceCodePlaceholder": "Ingresa tu código fuente aquí...",
        "convertedCodePlaceholder": "El código convertido aparecerá aquí...",
        "convertingPlaceholder": "Convirtiendo...",
        "footerText1": "CodeFlux utiliza Claude AI para convertir código entre lenguajes de programación.",
        "footerText2": "Los resultados pueden requerir revisión y ajuste manual.",
        "searchLanguagesPlaceholder": "Buscar lenguajes...",
        "noLanguagesFound": "No se encontraron lenguajes",
        "errorEmptyCode": "Por favor ingresa código para convertir",
        "errorConversionFailed": "Error al convertir el código. Por favor intenta de nuevo.",
        "exampleComment": "# Código Python de ejemplo"
    }
    /* LOCALE_PLACEHOLDER_END */
};

const appLocale = '{{APP_LOCALE}}';
const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
const findMatchingLocale = (locale) => {
    if (TRANSLATIONS[locale]) return locale;
    const lang = locale.split('-')[0];
    const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
    return match || 'en-US';
};
const locale = (appLocale !== '{{APP_LOCALE}}') ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);
const t = (key) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;

const CodeFlux = () => {
    // Top 25 programming languages
    const languages = [
        'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'C', 'Go',
        'Rust', 'Swift', 'Kotlin', 'PHP', 'Ruby', 'Scala', 'R', 'MATLAB',
        'Perl', 'Haskell', 'Lua', 'Dart', 'Elixir', 'F#', 'Clojure',
        'Objective-C', 'Visual Basic'
    ];

    const [sourceCode, setSourceCode] = useState(`${t('exampleComment')}\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(10))`);
    const [targetCode, setTargetCode] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState('Python');
    const [targetLanguage, setTargetLanguage] = useState('JavaScript');
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState('');

    const convertCode = async () => {
        if (!sourceCode.trim()) {
            setError(t('errorEmptyCode'));
            return;
        }

        setIsConverting(true);
        setError('');
        setTargetCode('');

        try {
            const prompt = `Convert the following ${sourceLanguage} code to ${targetLanguage}. Only return the converted code without any explanation or markdown formatting. Please respond in ${locale} language:

${sourceCode}`;

            const res = await fetch("https://codeflux-dlw6.onrender.com/api/convert",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt }),
                });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Conversion failed");
            }

            setTargetCode(data.result);

        } catch (err) {
            console.error("Conversion error:", err);
            setError(t('errorConversionFailed'));
        } finally {
            setIsConverting(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-mono">

            {/* Header */}
            <div className="px-8 py-6 border-b border-white/10 backdrop-blur-xl bg-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20">
                        <Code className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            {t("appTitle")}
                        </h1>
                        <p className="text-sm text-white/60">
                            {t("appSubtitle")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="p-8">
                <div className="max-w-7xl mx-auto">

                    {/* Language Selection */}
                    <div className="flex items-center justify-center gap-6 mb-10">
                        <LanguageDropdown
                            value={sourceLanguage}
                            onChange={setSourceLanguage}
                            languages={languages}
                            placeholder={t("sourceLanguagePlaceholder")}
                        />
                        <ArrowRight className="w-6 h-6 text-white/40" />
                        <LanguageDropdown
                            value={targetLanguage}
                            onChange={setTargetLanguage}
                            languages={languages}
                            placeholder={t("targetLanguagePlaceholder")}
                        />
                    </div>

                    {/* Convert Button */}
                    <div className="flex justify-center mb-10">
                        <button
                            onClick={convertCode}
                            disabled={isConverting}
                            className="px-10 py-4 rounded-xl font-semibold transition-all duration-300
            bg-gradient-to-r from-cyan-500 to-purple-600
            hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30
            disabled:opacity-50 disabled:scale-100"
                        >
                            {isConverting ? t("converting") : t("convertButton")}
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-3 rounded-xl backdrop-blur-lg text-center mb-6">
                            {error}
                        </div>
                    )}

                    {/* Code Panels */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Source */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-xl shadow-black/40 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/10 text-white/70 text-sm">
                                {t("sourceCodeTitle")} ({sourceLanguage})
                            </div>
                            <textarea
                                value={sourceCode}
                                onChange={(e) => setSourceCode(e.target.value)}
                                className="w-full h-96 p-6 bg-transparent text-cyan-300 text-sm resize-none outline-none placeholder-white/30"
                                placeholder={t("sourceCodePlaceholder")}
                            />
                        </div>

                        {/* Target */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-xl shadow-black/40 overflow-hidden relative">
                            <div className="px-6 py-4 border-b border-white/10 text-white/70 text-sm">
                                {t("convertedCodeTitle")} ({targetLanguage})
                            </div>
                            <textarea
                                value={targetCode}
                                readOnly
                                className="w-full h-96 p-6 bg-transparent text-purple-300 text-sm resize-none outline-none placeholder-white/30"
                                placeholder={
                                    isConverting
                                        ? t("convertingPlaceholder")
                                        : t("convertedCodePlaceholder")
                                }
                            />

                            {isConverting && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md">
                                    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 text-center text-white/40 text-sm">
                        <p>{t("footerText1")}</p>
                        <p className="mt-1">{t("footerText2")}</p>
                    </div>
                </div>
            </div>
        </div>
    );

};

// Custom Language Dropdown Component
const LanguageDropdown = ({ value, onChange, languages, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const filteredLanguages = languages.filter(lang =>
        lang.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageSelect = (language) => {
        onChange(language);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-3 px-5 py-3 rounded-xl
      bg-white/5 backdrop-blur-xl border border-white/10
      hover:bg-white/10 hover:border-cyan-400/40
      transition-all duration-300 min-w-56 text-white"
            >
                <span className="text-white/80 tracking-wide">
                    {value || placeholder}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-cyan-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 right-0 mt-3 rounded-2xl
        bg-[#0f0f15]/95 backdrop-blur-2xl border border-white/10
        shadow-2xl shadow-black/50 z-50 overflow-hidden"
                >
                    {/* Search Box */}
                    <div className="p-4 border-b border-white/10">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("searchLanguagesPlaceholder")}
                            className="w-full px-4 py-2 rounded-lg
            bg-black/40 text-cyan-300 placeholder-white/30
            border border-white/10 focus:border-cyan-400
            outline-none text-sm"
                            autoFocus
                        />
                    </div>

                    {/* Options */}
                    <div className="max-h-56 overflow-y-auto">
                        {filteredLanguages.length > 0 ? (
                            filteredLanguages.map((language) => (
                                <button
                                    key={language}
                                    onClick={() => handleLanguageSelect(language)}
                                    className={`w-full text-left px-5 py-3 transition-all duration-200
                ${value === language
                                            ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300"
                                            : "text-white/70 hover:bg-white/5 hover:text-white"
                                        }`}
                                >
                                    {language}
                                </button>
                            ))
                        ) : (
                            <div className="px-5 py-3 text-white/40 text-sm">
                                {t("noLanguagesFound")}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

};

export default CodeFlux;

