import React from 'react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


const layout = ({ children }: React.PropsWithChildren) => {

    return (
        <div className="min-h-screen w-full bg-gray-50">
            {children}
        </div>
    );
};

export default layout;
