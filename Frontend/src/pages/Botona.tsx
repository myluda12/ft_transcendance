import React, { ReactNode } from "react";

import cn from "classnames";

export interface BotonaProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	className?: string;
}

export default function Botona({
	children,
	className,
	...props
}: BotonaProps) {
	return (
		<button
			className={cn(
				"bg-green-400 text-black max-h-12 focus:outline-none flex items-center justify-center rounded-lg transition ease-in-out duration-200 max-w-max px-4 py-2 text-normal font-semibold hover:bg-green-400/80 hover:shadow-sm",
				className
			)}
			{...props}
		>
			{children}
		</button>
	);
}

