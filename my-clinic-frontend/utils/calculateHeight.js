import { useStore } from "../src/Store";


export const calculateDynamicHeight = (dataLength) => {
    const itemsPerScreen = 7; // Number of items per screen
    const itemHeight = 50; // Height of each item in pixels
    const headerHeight = 100; // Height of header in pixels
    const footerHeight = 100; // Height of footer in pixels
    const scaleFactor = 1.8; // Scaling factor for height increase
    const fixedHeightThreshold = 5; // Threshold for fixed height

    // If data length is less than the threshold, set a fixed height
    if(dataLength === 0){
        return '573.5px'
    }
    if (dataLength < fixedHeightThreshold) {
        return '110vh';
    } else {
        // Calculate total height of all items and header/footer
        const totalHeight = (dataLength * itemHeight) + headerHeight + footerHeight;

        // Calculate the dynamic height by scaling the total height
        const dynamicHeight = totalHeight * scaleFactor;

        return `${dynamicHeight}px`;
    }
};