export default function imageIdToURI(imageId) {
    const colonIndex = imageId.indexOf(':');
    return imageId.substring(colonIndex + 1);
}
