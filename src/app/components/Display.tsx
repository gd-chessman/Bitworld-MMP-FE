"use client"
import * as React from 'react';
import { LangToggle } from './LanguageSelect';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/ui/dropdown-menu';
import { Button } from '@/ui/button';
import { Sun, Moon, Settings } from 'lucide-react';
import { useTheme } from "next-themes"
import { useState, useEffect } from 'react';

export default function Display() {
    const { theme, setTheme } = useTheme();
    const [isDark, setIsDark] = useState(theme);
    useEffect(() => {
        setIsDark(theme);
    }, [theme]);
    return (
        <div >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-max text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 xl:px-2 px-1 flex items-center gap-2 transition-colors"
                    >
                        <Settings className='xl:h-6 h-4 xl:w-6 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    className='w-max max-w-[130px] 2xl:max-w-[200px] xl:px-2 px-1 py-2 bg-white dark:bg-theme-neutral-1000 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg transition-colors' 
                    align="end" 
                    style={{ width: '200px' }}
                >
                    <LangToggle className='hover:bg-theme-blue-300 dark:hover:bg-theme-blue-100 bg-theme-neutral-300' />
                    <div className='flex items-center justify-evenly gap-4 xl:mt-3 mt-1'>
                        <Moon 
                            className="cursor-pointer transition-colors xl:w-7 w-5" 
                            onClick={() => isDark === "light" && setTheme("dark")} 
                            style={isDark === "dark" ? { color: "#fff" } : { color: "#6b7280" }}
                        />
                        <Sun 
                            className="cursor-pointer transition-colors xl:w-7 w-5" 
                            onClick={() => isDark === "dark" && setTheme("light")} 
                            style={isDark === "light" ? { color: "#f59e0b" } : { color: "#6b7280" }}
                        />
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
