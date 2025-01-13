import React, { createContext, useContext, useState } from 'react';

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
    const defaultCategories = [
        "Food",
        "Transport",
        "Entertainment",
        "Utilities",
        "Health",
        "Others",
    ];

    const [customCategories, setCustomCategories] = useState(() => {
        const savedCategories = localStorage.getItem("customCategories");
        return savedCategories ? JSON.parse(savedCategories) : [];
    });

    const addCustomCategory = (category) => {
        if (category && !customCategories.includes(category) && !defaultCategories.includes(category)) {
            setCustomCategories((prev) => {
                const updatedCategories = [...prev, category];
                localStorage.setItem("customCategories", JSON.stringify(updatedCategories));
                return updatedCategories;
            });
        } else {
            alert("Category already exists or is a default category.");
        }
    };

    const combinedCategories = [...defaultCategories, ...customCategories];

    return (
        <CategoriesContext.Provider value={{ combinedCategories, addCustomCategory }}>
            {children}
        </CategoriesContext.Provider>
    );
};

export const useCategories = () => {
    return useContext(CategoriesContext);
};
