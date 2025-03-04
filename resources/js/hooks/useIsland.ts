import { useContext } from 'react';
import { IslandContext } from '@/components/context/Island';

export const useIsland = () => {
    const context = useContext(IslandContext);
    if (!context) {
        throw new Error('useIsland must be used within an IslandProvider');
    }
    return context;
};