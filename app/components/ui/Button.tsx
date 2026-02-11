import { cn } from "@/app/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    isSelected?: boolean;
    isPrimary?: boolean;
}

function Button({ text,isSelected, isPrimary, className, ...props }: ButtonProps) {
    if(isPrimary){
        return ( 
            <button className={cn(`px-4 py-2 ${isSelected ? 'border-green-700' : 'border-green-500'} border text-white rounded `,className)} {...props}>
                {text}
            </button>
        );
    }
    return ( 
    <button className={cn(`px-4 py-2 ${isSelected ? 'bg-blue-700' : 'bg-blue-500'} text-white rounded `,className)} {...props}>
        {text}
    </button> 
    );
}

export default Button;