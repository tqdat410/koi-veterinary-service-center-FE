// src/types/react-rating.d.ts
declare module 'react-rating' {
    import * as React from 'react';

    interface RatingProps {
        emptySymbol?: React.ReactNode; // Allow any valid React node for the empty symbol
        fullSymbol?: React.ReactNode; // Allow any valid React node for the full symbol
        initialRating?: number; // Initial rating value
        readonly?: boolean; // If true, the rating is read-only
        onChange?: (rating: number) => void; // Callback when rating changes
    }

    const Rating: React.FC<RatingProps>; // Use a functional component instead of class
    export default Rating;
}
