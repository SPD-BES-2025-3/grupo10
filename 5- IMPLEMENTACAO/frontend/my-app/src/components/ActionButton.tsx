'use client'

import React from "react";

interface ActionButtonProps<T> {
    item: T;
    buttonText: string;
    colorButton: keyof typeof colorMap;
    onAction: (prop) => void;
}

const colorMap = {
    blue: "bg-blue-500 hover:bg-blue-400 text-white",
    red: "bg-red-500 hover:bg-red-400 text-white",
    green: "bg-green-600 hover:bg-green-500 text-white"
}

export const ActionButton = <T,>({ item, onAction, buttonText, colorButton }: ActionButtonProps<T>) => {
    const baseClasses = "font-semibold px-3 py-1 rounded-md text-sm text-black transition-colors cursor-pointer";
    const cor = colorMap[colorButton];

    return (
        <button
            type="button"
            onClick={() => onAction(item)}
            className={`${cor} ${baseClasses}`}
        >
            {buttonText}
        </button>
    );
}